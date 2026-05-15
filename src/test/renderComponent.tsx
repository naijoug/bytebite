import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

interface RenderedComponent {
  container: HTMLDivElement;
  rerender: (ui: ReactNode) => void;
  unmount: () => void;
}

const renderedComponents: RenderedComponent[] = [];

export function renderComponent(ui: ReactNode): RenderedComponent {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const root: Root = createRoot(container);

  const rendered: RenderedComponent = {
    container,
    rerender(nextUi: ReactNode) {
      act(() => {
        root.render(nextUi);
      });
    },
    unmount() {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };

  rendered.rerender(ui);
  renderedComponents.push(rendered);

  return rendered;
}

export function renderWithRouter(
  ui: ReactNode,
  routerProps?: MemoryRouterProps
): RenderedComponent {
  return renderComponent(<MemoryRouter {...routerProps}>{ui}</MemoryRouter>);
}

export function cleanupRenderedComponents() {
  while (renderedComponents.length > 0) {
    renderedComponents.pop()?.unmount();
  }
}
