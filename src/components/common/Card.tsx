import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { hover = false, padding = 'md', className = '', children, ...props },
    ref
  ) => {
    const baseStyles = 'bg-white rounded-lg shadow-sm border border-gray-200';
    const hoverStyles = hover
      ? 'hover:shadow-md hover:border-gray-300 transition-shadow cursor-pointer'
      : '';

    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${hoverStyles} ${paddingStyles[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
