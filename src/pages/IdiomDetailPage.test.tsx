import { afterEach, describe, expect, it, vi } from 'vitest';
import { IdiomDetailPage } from './IdiomDetailPage';
import { createTestIdiom, createTestLanguage } from '../test/fixtures';
import type { Idiom, Implementation, Language } from '../types';
import {
  cleanupRenderedComponents,
  renderComponent,
} from '../test/renderComponent';

const mockContext = vi.hoisted(() => ({
  useAppContext: vi.fn(),
}));

const mockRouter = vi.hoisted(() => ({
  navigate: vi.fn(),
  useParams: vi.fn(),
}));

vi.mock('../contexts', () => ({
  useAppContext: mockContext.useAppContext,
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockRouter.navigate,
  useParams: mockRouter.useParams,
}));

vi.mock('../components', () => ({
  LanguageSelector: ({
    availableLanguages,
    selectedLanguages,
    onChange,
  }: {
    availableLanguages: Language[];
    selectedLanguages: string[];
    onChange: (languageIds: string[]) => void;
  }) => (
    <section
      data-available-language-ids={availableLanguages
        .map((language) => language.id)
        .join(',')}
      data-selected-language-ids={selectedLanguages.join(',')}
      data-testid="language-selector"
    >
      <button type="button" onClick={() => onChange(['python'])}>
        select python
      </button>
    </section>
  ),
  CodeComparison: ({
    implementations,
    selectedLanguages,
    availableLanguages,
  }: {
    implementations: Implementation[];
    selectedLanguages: string[];
    availableLanguages: Language[];
  }) => (
    <section
      data-available-language-ids={availableLanguages
        .map((language) => language.id)
        .join(',')}
      data-implementation-language-ids={implementations
        .map((implementation) => implementation.languageId)
        .join(',')}
      data-selected-language-ids={selectedLanguages.join(',')}
      data-testid="code-comparison"
    />
  ),
  FavoriteButton: ({ idiomId }: { idiomId: string }) => (
    <button data-idiom-id={idiomId} data-testid="favorite-button" type="button">
      favorite {idiomId}
    </button>
  ),
  ErrorMessage: ({
    title,
    message,
    showHomeButton,
  }: {
    title: string;
    message: string;
    showHomeButton: boolean;
  }) => (
    <section data-show-home-button={String(showHomeButton)} role="alert">
      <h1>{title}</h1>
      <p>{message}</p>
    </section>
  ),
}));

const languages: Language[] = [
  createTestLanguage(),
  createTestLanguage({
    id: 'python',
    name: 'Python',
    version: '3.12',
    paradigms: ['Object-Oriented', 'Procedural'],
    typeSystem: 'dynamic',
    description: 'Readable general-purpose programming language.',
    features: ['Batteries included'],
    officialDocs: 'https://docs.python.org/3/',
  }),
  createTestLanguage({
    id: 'go',
    name: 'Go',
    version: '1.25',
    paradigms: ['Imperative'],
    typeSystem: 'static',
    description: 'Simple concurrent systems language.',
    features: ['Goroutines'],
    officialDocs: 'https://go.dev/doc/',
  }),
];

const idioms: Idiom[] = [
  createTestIdiom({
    implementations: [
      {
        languageId: 'typescript',
        code: 'items.map(fn)',
        explanation: 'Maps over each item.',
      },
      {
        languageId: 'python',
        code: 'list(map(fn, items))',
        explanation: 'Maps over each item.',
      },
    ],
  }),
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
];

function mockIdiomDetailContext({
  idiomId = 'map-transform',
  loading = false,
  selectedLanguages = [],
  setSelectedLanguages = vi.fn(),
}: {
  idiomId?: string;
  loading?: boolean;
  selectedLanguages?: string[];
  setSelectedLanguages?: (languageIds: string[]) => void;
} = {}) {
  mockRouter.useParams.mockReturnValue({ id: idiomId });
  mockContext.useAppContext.mockReturnValue({
    idioms,
    languages,
    loading,
    selectedLanguages,
    setSelectedLanguages,
  });

  return { setSelectedLanguages };
}

afterEach(() => {
  cleanupRenderedComponents();
  mockContext.useAppContext.mockReset();
  mockRouter.useParams.mockReset();
  mockRouter.navigate.mockReset();
});

describe('IdiomDetailPage', () => {
  it('shows the loading state while idiom data is loading', () => {
    mockIdiomDetailContext({ loading: true });

    const { container } = renderComponent(<IdiomDetailPage />);

    expect(container.textContent).toContain('加载中...');
    expect(container.querySelector('.animate-spin')).toBeInstanceOf(
      HTMLElement
    );
    expect(
      container.querySelector('[data-testid="language-selector"]')
    ).toBeNull();
  });

  it('renders an error message when the route idiom does not exist', () => {
    mockIdiomDetailContext({ idiomId: 'missing-idiom' });

    const { container } = renderComponent(<IdiomDetailPage />);
    const alert = container.querySelector('[role="alert"]');

    expect(alert?.textContent).toContain('习语未找到');
    expect(alert?.textContent).toContain(
      '找不到 ID 为 "missing-idiom" 的编程习语。它可能已被删除或不存在。'
    );
    expect(alert?.getAttribute('data-show-home-button')).toBe('true');
  });

  it('renders idiom details and navigates back to the list', () => {
    mockIdiomDetailContext({ idiomId: 'map-transform' });

    const { container } = renderComponent(<IdiomDetailPage />);
    const backButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="返回习语列表"]'
    );

    expect(container.querySelector('h1')?.textContent).toBe('Map transform');
    expect(container.textContent).toContain(
      'Transform each item in a collection.'
    );
    expect(container.textContent).toContain('初级');
    expect(container.textContent).toContain('Collection');
    expect(container.textContent).toContain('Functional');
    expect(container.textContent).toContain('支持 2 种语言');
    expect(container.textContent).toContain('#array');
    expect(
      container
        .querySelector('[data-testid="favorite-button"]')
        ?.getAttribute('data-idiom-id')
    ).toBe('map-transform');

    backButton?.click();

    expect(mockRouter.navigate).toHaveBeenCalledWith('/');
  });

  it('defaults to the first two available languages and forwards comparison data', () => {
    mockIdiomDetailContext({ selectedLanguages: [] });

    const { container } = renderComponent(<IdiomDetailPage />);
    const selector = container.querySelector(
      '[data-testid="language-selector"]'
    );
    const comparison = container.querySelector(
      '[data-testid="code-comparison"]'
    );

    expect(selector?.getAttribute('data-available-language-ids')).toBe(
      'typescript,python'
    );
    expect(selector?.getAttribute('data-selected-language-ids')).toBe(
      'typescript,python'
    );
    expect(comparison?.getAttribute('data-implementation-language-ids')).toBe(
      'typescript,python'
    );
    expect(comparison?.getAttribute('data-selected-language-ids')).toBe(
      'typescript,python'
    );
    expect(comparison?.getAttribute('data-available-language-ids')).toBe(
      'typescript,python,go'
    );
  });

  it('filters invalid selected languages and delegates selector changes', () => {
    const { setSelectedLanguages } = mockIdiomDetailContext({
      selectedLanguages: ['go', 'python'],
      setSelectedLanguages: vi.fn(),
    });

    const { container } = renderComponent(<IdiomDetailPage />);
    const selector = container.querySelector(
      '[data-testid="language-selector"]'
    );
    const comparison = container.querySelector(
      '[data-testid="code-comparison"]'
    );
    const changeButton = container.querySelector<HTMLButtonElement>(
      '[data-testid="language-selector"] button'
    );

    expect(selector?.getAttribute('data-selected-language-ids')).toBe('python');
    expect(comparison?.getAttribute('data-selected-language-ids')).toBe(
      'python'
    );

    changeButton?.click();

    expect(setSelectedLanguages).toHaveBeenCalledWith(['python']);
  });
});
