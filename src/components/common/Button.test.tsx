import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cleanupRenderedComponents,
  renderComponent,
} from '../../test/renderComponent';
import { Button } from './Button';

afterEach(cleanupRenderedComponents);

describe('Button', () => {
  it('默认渲染 primary/md 按钮并透传原生属性', () => {
    const handleClick = vi.fn();
    const { container } = renderComponent(
      <Button type="button" aria-label="保存设置" onClick={handleClick}>
        保存
      </Button>
    );
    const button = container.querySelector<HTMLButtonElement>('button');

    expect(button).not.toBeNull();
    expect(button?.type).toBe('button');
    expect(button?.getAttribute('aria-label')).toBe('保存设置');
    expect(button?.textContent).toBe('保存');
    expect(button?.className).toContain('bg-blue-600');
    expect(button?.className).toContain('text-base');

    button?.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('支持 variant、size、fullWidth、className 和 disabled 状态', () => {
    const handleClick = vi.fn();
    const { container } = renderComponent(
      <Button
        type="button"
        variant="outline"
        size="lg"
        fullWidth
        className="custom-button"
        disabled
        onClick={handleClick}
      >
        提交
      </Button>
    );
    const button = container.querySelector<HTMLButtonElement>('button');

    expect(button?.disabled).toBe(true);
    expect(button?.className).toContain('border-2 border-gray-300');
    expect(button?.className).toContain('px-6 py-3 text-lg');
    expect(button?.className).toContain('w-full');
    expect(button?.className).toContain('custom-button');

    button?.click();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('向底层 button 暴露 ref', () => {
    const refNode = createRef<HTMLButtonElement>();

    renderComponent(<Button ref={refNode}>可聚焦</Button>);

    expect(refNode.current).toBeInstanceOf(HTMLButtonElement);
    expect(refNode.current?.textContent).toBe('可聚焦');
  });
});
