import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onClear, value, className = '', ...props }, ref) => {
    const showClearButton = value && String(value).length > 0;

    return (
      <div className={`relative ${className}`} role="search">
        <label htmlFor="search-input" className="sr-only">
          搜索编程习语
        </label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={ref}
          id="search-input"
          type="search"
          value={value}
          className="block w-full pl-10 pr-10 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 text-base"
          aria-describedby={showClearButton ? 'clear-search-button' : undefined}
          {...props}
        />
        {showClearButton && onClear && (
          <button
            id="clear-search-button"
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-2 flex items-center hover:text-gray-700 text-gray-400 min-w-[44px] justify-center focus:outline-none focus:text-gray-900"
            aria-label="清除搜索"
            title="清除搜索"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';
