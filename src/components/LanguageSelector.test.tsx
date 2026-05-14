import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LanguageSelector } from './LanguageSelector';
import type { Language } from '../types';
import {
  cleanupRenderedComponents,
  renderComponent,
} from '../test/renderComponent';

const languages: Language[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    version: 'ES2024',
    paradigms: ['functional', 'object-oriented'],
    typeSystem: 'dynamic',
    description: 'Web scripting language',
    features: ['closures'],
    officialDocs: 'https://developer.mozilla.org/',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    version: '5.9',
    paradigms: ['functional', 'object-oriented'],
    typeSystem: 'static',
    description: 'Typed JavaScript',
    features: ['types'],
    officialDocs: 'https://www.typescriptlang.org/',
  },
  {
    id: 'rust',
    name: 'Rust',
    version: '1.90',
    paradigms: ['systems'],
    typeSystem: 'static',
    description: 'Systems programming language',
    features: ['ownership'],
    officialDocs: 'https://www.rust-lang.org/',
  },
];

function getToggleButton(container: HTMLElement) {
  const button = Array.from(container.querySelectorAll('button')).find((item) =>
    item.textContent?.includes('选择语言')
  );

  if (!button) {
    throw new Error('Language selector toggle button was not found');
  }

  return button;
}

function click(element: Element | null | undefined) {
  if (!element) {
    throw new Error('Expected element to exist before clicking');
  }

  act(() => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
}

afterEach(() => {
  cleanupRenderedComponents();
});

describe('LanguageSelector', () => {
  it('opens and closes the language listbox', () => {
    const onChange = vi.fn();
    const { container } = renderComponent(
      <LanguageSelector
        availableLanguages={languages}
        selectedLanguages={[]}
        onChange={onChange}
      />
    );
    const toggleButton = getToggleButton(container);

    expect(toggleButton.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector('[role="listbox"]')).toBeNull();

    click(toggleButton);

    const listbox = container.querySelector('[role="listbox"]');
    expect(toggleButton.getAttribute('aria-expanded')).toBe('true');
    expect(listbox?.getAttribute('aria-label')).toBe('可选择的编程语言');
    expect(container.querySelectorAll('[role="option"]')).toHaveLength(3);

    act(() => {
      document.body.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true })
      );
    });

    expect(toggleButton.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it('adds and removes languages through list options and selected badges', () => {
    const onChange = vi.fn();
    const { container } = renderComponent(
      <LanguageSelector
        availableLanguages={languages}
        selectedLanguages={['javascript']}
        onChange={onChange}
      />
    );

    expect(getToggleButton(container).textContent).toContain('1');
    expect(container.textContent).toContain('JavaScript');

    click(getToggleButton(container));

    const options =
      container.querySelectorAll<HTMLButtonElement>('[role="option"]');
    expect(options[0].getAttribute('aria-selected')).toBe('true');
    expect(options[1].getAttribute('aria-selected')).toBe('false');

    click(options[1]);
    expect(onChange).toHaveBeenLastCalledWith(['javascript', 'typescript']);

    click(options[0]);
    expect(onChange).toHaveBeenLastCalledWith([]);

    click(container.querySelector('button[aria-label="移除 JavaScript"]'));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('clears all selections and resets to the first two languages', () => {
    const onChange = vi.fn();
    const { container } = renderComponent(
      <LanguageSelector
        availableLanguages={languages}
        selectedLanguages={['rust']}
        onChange={onChange}
      />
    );

    click(container.querySelector('button[aria-label="清除所有选择的语言"]'));
    expect(onChange).toHaveBeenLastCalledWith([]);

    click(container.querySelector('button[aria-label="重置为默认语言选择"]'));
    expect(onChange).toHaveBeenLastCalledWith(['javascript', 'typescript']);
  });

  it('disables unselected options when maxSelection is reached', () => {
    const onChange = vi.fn();
    const { container } = renderComponent(
      <LanguageSelector
        availableLanguages={languages}
        selectedLanguages={['javascript', 'typescript']}
        onChange={onChange}
        maxSelection={2}
        className="language-picker"
      />
    );

    expect(container.firstElementChild?.className).toContain('language-picker');

    click(getToggleButton(container));

    expect(container.textContent).toContain('最多选择 2 种语言 (已选 2)');
    const options =
      container.querySelectorAll<HTMLButtonElement>('[role="option"]');

    expect(options[0].disabled).toBe(false);
    expect(options[2].disabled).toBe(true);
    expect(options[2].className).toContain('cursor-not-allowed');

    click(options[2]);
    expect(onChange).not.toHaveBeenCalled();

    click(options[0]);
    expect(onChange).toHaveBeenCalledWith(['typescript']);
  });
});
