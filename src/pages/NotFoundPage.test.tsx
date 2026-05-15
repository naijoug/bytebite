import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';
import {
  cleanupRenderedComponents,
  renderComponent,
} from '../test/renderComponent';

afterEach(() => {
  cleanupRenderedComponents();
});

function renderNotFoundPage() {
  return renderComponent(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>
  );
}

describe('NotFoundPage', () => {
  it('renders the 404 message and recovery explanation', () => {
    const { container } = renderNotFoundPage();

    expect(container.querySelector('.text-8xl')?.textContent).toBe('404');
    expect(container.querySelector('h1')?.textContent).toBe('页面未找到');
    expect(container.textContent).toContain(
      '抱歉，您访问的页面不存在或已被移除。'
    );
    expect(container.textContent).toContain('您可能在寻找：');
  });

  it('provides primary navigation links back to safe pages', () => {
    const { container } = renderNotFoundPage();
    const links = Array.from(container.querySelectorAll('a')).map((link) => ({
      href: link.getAttribute('href'),
      text: link.textContent?.trim(),
    }));

    expect(links).toEqual([
      { href: '/', text: '返回首页' },
      { href: '/favorites', text: '查看收藏' },
      { href: '/', text: '→ 浏览所有编程习语' },
      { href: '/favorites', text: '→ 我的收藏列表' },
    ]);
  });
});
