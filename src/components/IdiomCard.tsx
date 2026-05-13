import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Idiom } from '../types';
import { Card, Badge } from './common';
import { useAppContext } from '../contexts';
import {
  summarizeSearchMatchLabels,
  type SearchMatchLabel,
} from '../utils/filters';

const MAX_VISIBLE_SEARCH_MATCH_LABELS = 3;

export interface IdiomCardProps {
  idiom: Idiom;
  searchMatchLabels?: SearchMatchLabel[];
}

const difficultyConfig = {
  beginner: { label: '初级', variant: 'success' as const },
  intermediate: { label: '中级', variant: 'warning' as const },
  advanced: { label: '高级', variant: 'danger' as const },
};

export const IdiomCard = memo(function IdiomCard({
  idiom,
  searchMatchLabels = [],
}: IdiomCardProps) {
  const { isFavorite } = useAppContext();
  const difficulty = difficultyConfig[idiom.difficulty];
  const languageIds = Array.from(
    new Set(
      idiom.implementations.map((implementation) => implementation.languageId)
    )
  );
  const languageCount = languageIds.length;
  const visibleLanguageIds = languageIds.slice(0, 4);
  const hiddenLanguageCount = Math.max(
    languageCount - visibleLanguageIds.length,
    0
  );
  const favorited = isFavorite(idiom.id);
  const { visibleLabels, hiddenCount: hiddenSearchMatchLabelCount } =
    summarizeSearchMatchLabels(
      searchMatchLabels,
      MAX_VISIBLE_SEARCH_MATCH_LABELS
    );
  const hasSearchMatchLabels = searchMatchLabels.length > 0;

  return (
    <article>
      <Link
        to={`/idiom/${idiom.id}`}
        aria-label={`查看 ${idiom.title} 的详细信息，难度：${difficulty.label}，支持 ${languageCount} 种语言`}
      >
        <Card hover className="h-full relative">
          <div className="flex flex-col h-full">
            {/* 收藏状态指示器 */}
            {favorited && (
              <div className="absolute top-3 right-3" aria-hidden="true">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="sr-only">已收藏</span>
              </div>
            )}

            {/* 标题和难度 */}
            <div className="flex items-start justify-between gap-2 mb-2 pr-6">
              <h3 className="text-lg font-semibold text-gray-900 flex-1">
                {idiom.title}
              </h3>
              <Badge
                variant={difficulty.variant}
                size="sm"
                aria-label={`难度：${difficulty.label}`}
              >
                {difficulty.label}
              </Badge>
            </div>

            {/* 描述 */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {idiom.description}
            </p>

            {/* 分类和范式标签 */}
            <div
              className="flex flex-wrap gap-1.5 mb-3"
              role="list"
              aria-label="标签"
            >
              <Badge variant="primary" size="sm" role="listitem">
                {idiom.category}
              </Badge>
              {idiom.paradigms.map((paradigm) => (
                <Badge
                  key={paradigm}
                  variant="default"
                  size="sm"
                  role="listitem"
                >
                  {paradigm}
                </Badge>
              ))}
            </div>

            {/* 底部信息 */}
            <div className="mt-auto pt-3 border-t border-gray-100 space-y-2">
              {hasSearchMatchLabels && (
                <div
                  className="flex flex-wrap items-center gap-1.5 text-xs text-blue-700"
                  aria-label={`搜索命中：${searchMatchLabels.join('、')}`}
                >
                  <span className="font-medium">匹配：</span>
                  {visibleLabels.map((label) => (
                    <Badge key={label} variant="primary" size="sm">
                      {label}
                    </Badge>
                  ))}
                  {hiddenSearchMatchLabelCount > 0 && (
                    <Badge
                      variant="primary"
                      size="sm"
                      aria-label={`另有 ${hiddenSearchMatchLabelCount} 个命中字段`}
                    >
                      +{hiddenSearchMatchLabelCount}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  <span>{languageCount} 种语言</span>
                </span>
                {idiom.tags.length > 0 && (
                  <span className="text-xs text-gray-400">
                    {idiom.tags.slice(0, 2).join(', ')}
                    {idiom.tags.length > 2 && '...'}
                  </span>
                )}
              </div>

              <div
                className="flex flex-wrap gap-1.5"
                role="list"
                aria-label="支持语言"
              >
                {visibleLanguageIds.map((languageId) => (
                  <Badge
                    key={languageId}
                    variant="default"
                    size="sm"
                    role="listitem"
                  >
                    {languageId}
                  </Badge>
                ))}
                {hiddenLanguageCount > 0 && (
                  <Badge variant="default" size="sm" role="listitem">
                    +{hiddenLanguageCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </article>
  );
});
