import type { ReactNode } from 'react';

export type EmptyStateIcon = 'search' | 'favorite';
export type EmptyStateSize = 'md' | 'lg';

export interface EmptyStateProps {
  icon?: EmptyStateIcon;
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  size?: EmptyStateSize;
  role?: 'status' | 'note';
  className?: string;
}

const iconPathByType: Record<EmptyStateIcon, string> = {
  search:
    'M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  favorite:
    'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
};

const sizeStyles: Record<EmptyStateSize, { container: string; icon: string }> =
  {
    md: {
      container: 'py-8',
      icon: 'h-12 w-12 mb-3',
    },
    lg: {
      container: 'min-h-[400px]',
      icon: 'h-24 w-24 mb-4',
    },
  };

export function EmptyState({
  icon = 'search',
  title,
  description,
  action,
  size = 'md',
  role = 'status',
  className = '',
}: EmptyStateProps) {
  const styles = sizeStyles[size];

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${styles.container} ${className}`}
      role={role}
    >
      <svg
        className={`text-gray-300 ${styles.icon}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={icon === 'favorite' ? 1.5 : 2}
          d={iconPathByType[icon]}
        />
      </svg>
      {title && (
        <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-sm sm:text-base text-gray-600 max-w-md">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
