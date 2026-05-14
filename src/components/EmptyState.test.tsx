import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanupRenderedComponents,
  renderComponent,
} from '../test/renderComponent';
import { EmptyState } from './EmptyState';

afterEach(cleanupRenderedComponents);

describe('EmptyState', () => {
  it('默认渲染搜索空状态并暴露 status 语义', () => {
    const view = renderComponent(
      <EmptyState title="没有找到结果" description="请尝试调整关键词" />
    ).container;
    const status = view.querySelector('[role="status"]');

    expect(status).not.toBeNull();
    expect(status?.textContent).toContain('没有找到结果');
    expect(status?.textContent).toContain('请尝试调整关键词');
    expect(view.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
  });

  it('支持自定义图标、尺寸、role、className 和操作区域', () => {
    const view = renderComponent(
      <EmptyState
        icon="favorite"
        size="lg"
        role="note"
        className="custom-empty"
        title="暂无收藏"
        description={<span>收藏后会在这里显示</span>}
        action={<button type="button">浏览习语</button>}
      />
    ).container;
    const note = view.querySelector('[role="note"]');
    const action = view.querySelector<HTMLButtonElement>('button');

    expect(note?.className).toContain('min-h-[400px]');
    expect(note?.className).toContain('custom-empty');
    expect(note?.textContent).toContain('暂无收藏');
    expect(note?.textContent).toContain('收藏后会在这里显示');
    expect(action?.textContent).toBe('浏览习语');
  });

  it('未传标题、描述和操作时只渲染图标容器', () => {
    const view = renderComponent(<EmptyState />).container;
    const status = view.querySelector('[role="status"]');

    expect(status).not.toBeNull();
    expect(status?.querySelector('h3')).toBeNull();
    expect(status?.querySelector('p')).toBeNull();
    expect(status?.querySelector('button')).toBeNull();
  });
});
