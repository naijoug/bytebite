import { memo } from 'react';
import { useAppContext } from '../contexts';
import { Button } from './common';
import type { ButtonProps } from './common/Button';

export interface FavoriteButtonProps extends Omit<ButtonProps, 'onClick'> {
  idiomId: string;
  showLabel?: boolean;
}

/**
 * 收藏按钮组件
 * 用于添加或移除习语收藏
 */
export const FavoriteButton = memo(function FavoriteButton({
  idiomId,
  showLabel = true,
  variant,
  size = 'md',
  className = '',
  ...props
}: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useAppContext();
  const favorited = isFavorite(idiomId);

  // 如果没有指定 variant，根据收藏状态自动选择
  const buttonVariant = variant || (favorited ? 'primary' : 'outline');

  return (
    <Button
      variant={buttonVariant}
      size={size}
      onClick={() => toggleFavorite(idiomId)}
      className={`flex items-center gap-2 ${className}`}
      aria-label={favorited ? '取消收藏' : '添加收藏'}
      {...props}
    >
      <svg
        className="w-5 h-5"
        fill={favorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {showLabel && (favorited ? '已收藏' : '收藏')}
    </Button>
  );
});
