import { afterEach, describe, expect, it, vi } from 'vitest';
import { FavoritesPage } from './FavoritesPage';
import { createTestIdiom } from '../test/fixtures';
import type { Idiom, UserPreferences } from '../types';
import {
  cleanupRenderedComponents,
  renderComponent,
} from '../test/renderComponent';

const mockContext = vi.hoisted(() => ({
  useAppContext: vi.fn(),
}));

vi.mock('../contexts', () => ({
  useAppContext: mockContext.useAppContext,
}));

vi.mock('../components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../components')>();

  return {
    ...actual,
    IdiomGrid: ({
      idioms,
      ariaLabel,
    }: {
      idioms: Idiom[];
      ariaLabel: string;
    }) => (
      <section aria-label={ariaLabel} data-testid="idiom-grid">
        {idioms.map((idiom) => (
          <article key={idiom.id} data-idiom-id={idiom.id}>
            {idiom.title}
          </article>
        ))}
      </section>
    ),
  };
});

afterEach(() => {
  cleanupRenderedComponents();
  mockContext.useAppContext.mockReset();
});

const idioms: Idiom[] = [
  createTestIdiom(),
  createTestIdiom({
    id: 'guard-clause',
    title: 'Guard clause',
    description: 'Return early for invalid states.',
    category: 'Control Flow',
    difficulty: 'intermediate',
    paradigms: ['Imperative'],
    implementations: [
      {
        languageId: 'go',
        code: 'if err != nil { return err }',
        explanation: 'Returns on error.',
      },
    ],
    tags: ['control-flow'],
  }),
  createTestIdiom({
    id: 'retry-backoff',
    title: 'Retry with backoff',
    description: 'Retry a transient operation with backoff.',
    category: 'Reliability',
    difficulty: 'advanced',
    paradigms: ['Resilience'],
    implementations: [
      {
        languageId: 'python',
        code: 'retry(operation)',
        explanation: 'Retries transient failures.',
      },
    ],
    tags: ['retry'],
  }),
];

function mockFavoritesPageContext({
  favoriteIdioms = [],
  loading = false,
}: {
  favoriteIdioms?: string[];
  loading?: boolean;
}) {
  const preferences: UserPreferences = {
    favoriteIdioms,
    selectedLanguages: ['typescript', 'python'],
  };

  mockContext.useAppContext.mockReturnValue({
    idioms,
    preferences,
    loading,
  });
}

describe('FavoritesPage', () => {
  it('shows the loading state while data is loading', () => {
    mockFavoritesPageContext({ loading: true });

    const { container } = renderComponent(<FavoritesPage />);

    expect(container.textContent).toContain('加载中...');
    expect(container.querySelector('.animate-spin')).toBeInstanceOf(
      HTMLElement
    );
  });

  it('renders an empty state when there are no favorite idioms', () => {
    mockFavoritesPageContext({ favoriteIdioms: [] });

    const { container } = renderComponent(<FavoritesPage />);

    expect(container.textContent).toContain('我的收藏');
    expect(container.textContent).toContain('还没有收藏任何习语');
    expect(container.textContent).toContain('暂无收藏');
    expect(container.textContent).toContain(
      '浏览编程习语并点击收藏按钮，将感兴趣的内容添加到这里'
    );
    expect(container.querySelector('[data-testid="idiom-grid"]')).toBeNull();
  });

  it('filters idioms by favorites and renders them in the shared grid', () => {
    mockFavoritesPageContext({
      favoriteIdioms: ['retry-backoff', 'missing-id', 'map-transform'],
    });

    const { container } = renderComponent(<FavoritesPage />);
    const grid = container.querySelector('[data-testid="idiom-grid"]');
    const renderedCards = Array.from(
      container.querySelectorAll('[data-idiom-id]')
    );

    expect(container.textContent).toContain('你已收藏 2 个编程习语');
    expect(grid?.getAttribute('aria-label')).toBe('收藏的编程习语列表');
    expect(
      renderedCards.map((card) => card.getAttribute('data-idiom-id'))
    ).toEqual(['map-transform', 'retry-backoff']);
    expect(container.textContent).not.toContain('Guard clause');
  });
});
