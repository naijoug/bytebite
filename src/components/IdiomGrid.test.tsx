import { afterEach, describe, expect, it, vi } from 'vitest';
import { IdiomGrid } from './IdiomGrid';
import type { Idiom } from '../types';
import {
  cleanupRenderedComponents,
  renderComponent,
} from '../test/renderComponent';

vi.mock('./IdiomCard', () => ({
  IdiomCard: ({
    idiom,
    searchMatchLabels,
  }: {
    idiom: Idiom;
    searchMatchLabels?: string[];
  }) => (
    <article data-testid="idiom-card" data-idiom-id={idiom.id}>
      <h3>{idiom.title}</h3>
      {searchMatchLabels && searchMatchLabels.length > 0 && (
        <p aria-label={`matches for ${idiom.id}`}>
          {searchMatchLabels.join(',')}
        </p>
      )}
    </article>
  ),
}));

afterEach(() => {
  cleanupRenderedComponents();
});

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

describe('IdiomGrid', () => {
  it('renders idiom cards inside a labelled list grid', () => {
    const { container } = renderComponent(
      <IdiomGrid idioms={idioms} ariaLabel="Featured idioms" />
    );

    const grid = container.querySelector('[role="list"]');
    const cards = container.querySelectorAll('[data-testid="idiom-card"]');

    expect(grid).toBeInstanceOf(HTMLElement);
    expect(grid?.getAttribute('aria-label')).toBe('Featured idioms');
    expect(grid?.classList.contains('grid')).toBe(true);
    expect(grid?.classList.contains('grid-cols-1')).toBe(true);
    expect(grid?.classList.contains('sm:grid-cols-2')).toBe(true);
    expect(grid?.classList.contains('lg:grid-cols-3')).toBe(true);
    expect(cards).toHaveLength(2);
    expect(cards[0]?.getAttribute('data-idiom-id')).toBe('map-transform');
    expect(cards[1]?.getAttribute('data-idiom-id')).toBe('guard-clause');
  });

  it('forwards per-idiom search match labels to each card', () => {
    const { container } = renderComponent(
      <IdiomGrid
        idioms={idioms}
        ariaLabel="Search results"
        getSearchMatchLabels={(idiom) =>
          idiom.id === 'map-transform' ? ['标题', '标签'] : []
        }
      />
    );

    expect(
      container.querySelector('[aria-label="matches for map-transform"]')
        ?.textContent
    ).toBe('标题,标签');
    expect(
      container.querySelector('[aria-label="matches for guard-clause"]')
    ).toBeNull();
  });
});
