import { afterEach, describe, expect, it, vi } from 'vitest';
import { IdiomCard } from './IdiomCard';
import type { Idiom } from '../types';
import type { SearchMatchLabel } from '../utils/filters';
import {
  cleanupRenderedComponents,
  renderWithRouter,
} from '../test/renderComponent';

const mockAppContext = vi.hoisted(() => ({
  isFavorite: vi.fn<(idiomId: string) => boolean>(),
}));

vi.mock('../contexts', () => ({
  useAppContext: () => ({
    isFavorite: mockAppContext.isFavorite,
  }),
}));

afterEach(() => {
  cleanupRenderedComponents();
  mockAppContext.isFavorite.mockReset();
});

const baseIdiom: Idiom = {
  id: 'map-transform',
  title: 'Map transform',
  description: 'Transform each item in a collection.',
  category: 'Collection',
  difficulty: 'intermediate',
  paradigms: ['Functional', 'Declarative'],
  implementations: [
    {
      languageId: 'typescript',
      code: 'items.map(fn)',
      explanation: 'Maps over each item.',
    },
    {
      languageId: 'python',
      code: 'list(map(fn, items))',
      explanation: 'Maps with a callable.',
    },
    {
      languageId: 'go',
      code: 'for _, item := range items {}',
      explanation: 'Loops over items.',
    },
  ],
  tags: ['array', 'collection', 'transform'],
};

function renderIdiomCard(
  idiom: Idiom = baseIdiom,
  searchMatchLabels?: SearchMatchLabel[]
) {
  return renderWithRouter(
    <IdiomCard idiom={idiom} searchMatchLabels={searchMatchLabels} />
  );
}

describe('IdiomCard', () => {
  it('renders a linked summary with difficulty, tags, and unique language count', () => {
    mockAppContext.isFavorite.mockReturnValue(false);

    const idiomWithDuplicateLanguage: Idiom = {
      ...baseIdiom,
      implementations: [
        ...baseIdiom.implementations,
        {
          languageId: 'typescript',
          code: 'items.map(fn)',
          explanation:
            'Duplicate language implementation should not change count.',
        },
      ],
    };

    const { container } = renderIdiomCard(idiomWithDuplicateLanguage);
    const link = container.querySelector('a');
    const tagsList = container.querySelector('[aria-label="标签"]');
    const languageList = container.querySelector('[aria-label="支持语言"]');

    expect(link?.getAttribute('href')).toBe('/idiom/map-transform');
    expect(link?.getAttribute('aria-label')).toContain('难度：中级');
    expect(link?.getAttribute('aria-label')).toContain('支持 3 种语言');
    expect(container.textContent).toContain('Map transform');
    expect(container.textContent).toContain(
      'Transform each item in a collection.'
    );
    expect(container.textContent).toContain('Collection');
    expect(container.textContent).toContain('Functional');
    expect(container.textContent).toContain('Declarative');
    expect(container.textContent).toContain('array, collection...');
    expect(container.textContent).toContain('3 种语言');
    expect(tagsList?.querySelectorAll('[role="listitem"]')).toHaveLength(3);
    expect(languageList?.querySelectorAll('[role="listitem"]')).toHaveLength(3);
  });

  it('shows the favorite indicator when the idiom is favorited', () => {
    mockAppContext.isFavorite.mockImplementation(
      (idiomId) => idiomId === 'map-transform'
    );

    const { container } = renderIdiomCard();

    expect(mockAppContext.isFavorite).toHaveBeenCalledWith('map-transform');
    expect(container.textContent).toContain('已收藏');
  });

  it('summarizes long language and search-match lists', () => {
    mockAppContext.isFavorite.mockReturnValue(false);

    const idiomWithManyLanguages: Idiom = {
      ...baseIdiom,
      implementations: [
        ...baseIdiom.implementations,
        {
          languageId: 'rust',
          code: 'items.iter().map(f)',
          explanation: 'Maps with iterators.',
        },
        {
          languageId: 'swift',
          code: 'items.map(f)',
          explanation: 'Maps with closures.',
        },
      ],
    };

    const { container } = renderIdiomCard(idiomWithManyLanguages, [
      '标题',
      '描述',
      '标签',
      '实现代码',
    ]);
    const searchMatchSummary = container.querySelector(
      '[aria-label^="搜索命中："]'
    );
    const languageList = container.querySelector('[aria-label="支持语言"]');

    expect(searchMatchSummary?.textContent).toContain('匹配：标题描述标签+1');
    expect(
      searchMatchSummary?.querySelector('[aria-label="另有 1 个命中字段"]')
    ).toBeInstanceOf(HTMLElement);
    expect(languageList?.textContent).toContain('typescript');
    expect(languageList?.textContent).toContain('python');
    expect(languageList?.textContent).toContain('go');
    expect(languageList?.textContent).toContain('rust');
    expect(languageList?.textContent).toContain('+1');
  });
});
