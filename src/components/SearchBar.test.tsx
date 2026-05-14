import { act, createRef, type ComponentProps } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cleanupRenderedComponents,
  renderComponent,
} from '../test/renderComponent';
import { SearchBar } from './SearchBar';

function renderSearchBar(
  props: Partial<ComponentProps<typeof SearchBar>> = {}
) {
  const defaultProps: ComponentProps<typeof SearchBar> = {
    value: '',
    onChange: vi.fn(),
    placeholder: '搜索习语、语言或标签',
  };

  return renderComponent(<SearchBar {...defaultProps} {...props} />).container;
}

afterEach(cleanupRenderedComponents);

describe('SearchBar', () => {
  it('渲染 search input 并透传常用输入属性', () => {
    const view = renderSearchBar({
      name: 'idiom-search',
      autoComplete: 'off',
      'aria-label': '搜索编程习语',
      className: 'custom-wrapper',
    });
    const wrapper = view.querySelector('[role="search"]');
    const input = view.querySelector<HTMLInputElement>('input[type="search"]');

    expect(wrapper?.className).toContain('custom-wrapper');
    expect(input?.id).toBe('search-input');
    expect(input?.name).toBe('idiom-search');
    expect(input?.placeholder).toBe('搜索习语、语言或标签');
    expect(input?.autocomplete).toBe('off');
    expect(input?.getAttribute('aria-label')).toBe('搜索编程习语');
    expect(view.textContent).toContain('搜索编程习语');
  });

  it('有输入值和 onClear 时展示清除按钮并触发回调', () => {
    const onClear = vi.fn();
    const view = renderSearchBar({ value: 'async', onClear });
    const input = view.querySelector<HTMLInputElement>('input[type="search"]');
    const clearButton = view.querySelector<HTMLButtonElement>(
      'button[aria-label="清除搜索"]'
    );

    expect(clearButton).not.toBeNull();
    expect(input?.getAttribute('aria-describedby')).toBe('clear-search-button');

    act(() => {
      clearButton?.click();
    });

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('无输入值或缺少 onClear 时隐藏清除按钮', () => {
    const emptyView = renderSearchBar({ value: '', onClear: vi.fn() });
    const readonlyView = renderSearchBar({ value: 'async' });

    expect(emptyView.querySelector('button[aria-label="清除搜索"]')).toBeNull();
    expect(
      readonlyView.querySelector('button[aria-label="清除搜索"]')
    ).toBeNull();
    expect(
      readonlyView
        .querySelector<HTMLInputElement>('input[type="search"]')
        ?.getAttribute('aria-describedby')
    ).toBeNull();
  });

  it('转发 ref 到 input 元素', () => {
    const ref = createRef<HTMLInputElement>();

    renderSearchBar({ ref, value: 'hooks' });

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.value).toBe('hooks');
  });
});
