import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FavoriteButton } from './FavoriteButton';
import {
  cleanupRenderedComponents,
  renderComponent,
} from '../test/renderComponent';

const mockAppContext = vi.hoisted(() => ({
  isFavorite: vi.fn<(idiomId: string) => boolean>(),
  toggleFavorite: vi.fn<(idiomId: string) => void>(),
}));

vi.mock('../contexts', () => ({
  useAppContext: () => ({
    isFavorite: mockAppContext.isFavorite,
    toggleFavorite: mockAppContext.toggleFavorite,
  }),
}));

afterEach(() => {
  cleanupRenderedComponents();
  mockAppContext.isFavorite.mockReset();
  mockAppContext.toggleFavorite.mockReset();
});

describe('FavoriteButton', () => {
  it('renders an add-favorite button when the idiom is not favorited', () => {
    mockAppContext.isFavorite.mockReturnValue(false);

    const { container } = renderComponent(
      <FavoriteButton idiomId="map-transform" />
    );
    const button = container.querySelector('button');
    const icon = container.querySelector('svg');

    expect(mockAppContext.isFavorite).toHaveBeenCalledWith('map-transform');
    expect(button?.getAttribute('aria-label')).toBe('添加收藏');
    expect(button?.textContent).toBe('收藏');
    expect(button?.className).toContain('border-2 border-gray-300');
    expect(icon?.getAttribute('fill')).toBe('none');
  });

  it('renders a favorited state and forwards display props', () => {
    mockAppContext.isFavorite.mockReturnValue(true);

    const { container } = renderComponent(
      <FavoriteButton
        idiomId="map-transform"
        showLabel={false}
        variant="ghost"
        size="sm"
        className="favorite-action"
        title="Toggle favorite"
      />
    );
    const button = container.querySelector('button');
    const icon = container.querySelector('svg');

    expect(button?.getAttribute('aria-label')).toBe('取消收藏');
    expect(button?.getAttribute('title')).toBe('Toggle favorite');
    expect(button?.textContent).toBe('');
    expect(button?.className).toContain('text-gray-700 hover:bg-gray-100');
    expect(button?.className).toContain('px-3 py-2.5 text-sm');
    expect(button?.className).toContain('favorite-action');
    expect(icon?.getAttribute('fill')).toBe('currentColor');
  });

  it('toggles the current idiom when clicked', () => {
    mockAppContext.isFavorite.mockReturnValue(false);

    const { container } = renderComponent(
      <FavoriteButton idiomId="map-transform" />
    );
    const button = container.querySelector('button');

    act(() => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(mockAppContext.toggleFavorite).toHaveBeenCalledTimes(1);
    expect(mockAppContext.toggleFavorite).toHaveBeenCalledWith('map-transform');
  });
});
