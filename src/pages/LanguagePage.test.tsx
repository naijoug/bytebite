import { afterEach, describe, expect, it, vi } from 'vitest';
import { LanguagePage } from './LanguagePage';
import type { Idiom, Language } from '../types';
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

const languages: Language[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    version: '5.x',
    paradigms: ['Object-Oriented', 'Functional'],
    typeSystem: 'static',
    description: 'Typed JavaScript for scalable applications.',
    features: ['Structural typing', 'Type inference'],
    officialDocs: 'https://www.typescriptlang.org/docs/',
  },
  {
    id: 'python',
    name: 'Python',
    version: '3.12',
    paradigms: ['Object-Oriented', 'Procedural'],
    typeSystem: 'dynamic',
    description: 'Readable general-purpose programming language.',
    features: ['Batteries included'],
    officialDocs: 'https://docs.python.org/3/',
  },
];

const idioms: Idiom[] = [
  {
    id: 'map-transform',
    title: 'Map transform',
    description: 'Transform each item in a collection.',
    category: 'Collection',
    difficulty: 'beginner',
    paradigms: ['Functional'],
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
    tags: ['array', 'map'],
  },
  {
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
  },
];

function mockLanguagePageContext({
  languageId = 'typescript',
  loading = false,
  contextIdioms = idioms,
  contextLanguages = languages,
}: {
  languageId?: string;
  loading?: boolean;
  contextIdioms?: Idiom[];
  contextLanguages?: Language[];
} = {}) {
  mockRouter.useParams.mockReturnValue({ id: languageId });
  mockContext.useAppContext.mockReturnValue({
    idioms: contextIdioms,
    languages: contextLanguages,
    loading,
  });
}

afterEach(() => {
  cleanupRenderedComponents();
  mockContext.useAppContext.mockReset();
  mockRouter.useParams.mockReset();
  mockRouter.navigate.mockReset();
});

describe('LanguagePage', () => {
  it('shows the loading state while data is loading', () => {
    mockLanguagePageContext({ loading: true });

    const { container } = renderComponent(<LanguagePage />);

    expect(container.textContent).toContain('加载中...');
    expect(container.querySelector('.animate-spin')).toBeInstanceOf(
      HTMLElement
    );
  });

  it('renders an error message when the route language does not exist', () => {
    mockLanguagePageContext({ languageId: 'missing-language' });

    const { container } = renderComponent(<LanguagePage />);

    expect(container.textContent).toContain('语言未找到');
    expect(container.textContent).toContain(
      '找不到 ID 为 "missing-language" 的编程语言。它可能已被删除或不存在。'
    );
    expect(container.querySelector('[data-testid="idiom-grid"]')).toBeNull();
  });

  it('renders language details, official docs link, and navigates back home', () => {
    mockLanguagePageContext({ languageId: 'typescript' });

    const { container } = renderComponent(<LanguagePage />);
    const docsLink = container.querySelector<HTMLAnchorElement>(
      'a[href="https://www.typescriptlang.org/docs/"]'
    );
    const backButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('返回首页')
    );

    expect(container.textContent).toContain('TypeScript');
    expect(container.textContent).toContain(
      'Typed JavaScript for scalable applications.'
    );
    expect(container.textContent).toContain('5.x');
    expect(container.textContent).toContain('静态类型');
    expect(container.textContent).toContain('Object-Oriented');
    expect(container.textContent).toContain('Structural typing');
    expect(docsLink?.getAttribute('target')).toBe('_blank');

    backButton?.click();

    expect(mockRouter.navigate).toHaveBeenCalledWith('/');
  });

  it('filters idioms by the selected language and renders them in the shared grid', () => {
    mockLanguagePageContext({ languageId: 'typescript' });

    const { container } = renderComponent(<LanguagePage />);
    const grid = container.querySelector('[data-testid="idiom-grid"]');
    const renderedCards = Array.from(
      container.querySelectorAll('[data-idiom-id]')
    );

    expect(container.textContent).toContain('TypeScript 实现的编程习语');
    expect(container.textContent).toContain('(1 个)');
    expect(grid?.getAttribute('aria-label')).toBe(
      'TypeScript 实现的编程习语列表'
    );
    expect(
      renderedCards.map((card) => card.getAttribute('data-idiom-id'))
    ).toEqual(['map-transform']);
    expect(container.textContent).not.toContain('Guard clause');
  });

  it('renders an empty state when the language has no idiom implementations', () => {
    mockLanguagePageContext({ languageId: 'python', contextIdioms: [] });

    const { container } = renderComponent(<LanguagePage />);

    expect(container.textContent).toContain('Python 实现的编程习语');
    expect(container.textContent).toContain('(0 个)');
    expect(container.textContent).toContain('暂无该语言的编程习语实现');
    expect(container.querySelector('[data-testid="idiom-grid"]')).toBeNull();
  });
});
