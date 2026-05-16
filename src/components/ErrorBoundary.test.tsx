import { act, type ReactElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cleanupRenderedComponents,
  renderComponent,
} from '../test/renderComponent';
import { ErrorBoundary } from './ErrorBoundary';

function ThrowingChild({
  message = 'boom',
}: {
  message?: string;
}): ReactElement {
  throw new Error(message);
}

afterEach(() => {
  cleanupRenderedComponents();
  vi.restoreAllMocks();
});

describe('ErrorBoundary', () => {
  it('正常状态下渲染子组件', () => {
    const view = renderComponent(
      <ErrorBoundary>
        <p>应用内容</p>
      </ErrorBoundary>
    ).container;

    expect(view.textContent).toContain('应用内容');
    expect(view.textContent).not.toContain('出错了');
  });

  it('捕获子组件错误并渲染默认 fallback UI', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const view = renderComponent(
      <ErrorBoundary>
        <ThrowingChild message="render failed" />
      </ErrorBoundary>
    ).container;

    expect(view.textContent).toContain('出错了');
    expect(view.textContent).toContain('应用遇到了一个意外错误');
    expect(view.textContent).toContain('错误详情');
    expect(view.textContent).toContain('Error: render failed');
    expect(view.querySelectorAll('button')).toHaveLength(2);
    expect(consoleError).toHaveBeenCalled();
  });

  it('优先渲染自定义 fallback', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const view = renderComponent(
      <ErrorBoundary fallback={<div role="alert">自定义错误提示</div>}>
        <ThrowingChild />
      </ErrorBoundary>
    ).container;

    expect(view.querySelector('[role="alert"]')?.textContent).toBe(
      '自定义错误提示'
    );
    expect(view.textContent).not.toContain('出错了');
  });

  it('点击重试后会重新渲染子组件', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    let shouldThrow = true;

    function RecoverableChild(): ReactElement {
      if (shouldThrow) {
        throw new Error('temporary failure');
      }

      return <span>恢复后的内容</span>;
    }

    const view = renderComponent(
      <ErrorBoundary>
        <RecoverableChild />
      </ErrorBoundary>
    ).container;

    expect(view.textContent).toContain('出错了');

    shouldThrow = false;
    act(() => {
      view.querySelector<HTMLButtonElement>('button')?.click();
    });

    expect(view.textContent).toContain('恢复后的内容');
    expect(view.textContent).not.toContain('出错了');
  });
});
