import { Link } from 'react-router-dom';
import type { Idiom } from '../types';
import { Card, Badge } from './common';

export interface IdiomCardProps {
  idiom: Idiom;
}

const difficultyConfig = {
  beginner: { label: '初级', variant: 'success' as const },
  intermediate: { label: '中级', variant: 'warning' as const },
  advanced: { label: '高级', variant: 'danger' as const },
};

export function IdiomCard({ idiom }: IdiomCardProps) {
  const difficulty = difficultyConfig[idiom.difficulty];
  const languageCount = idiom.implementations.length;

  return (
    <Link to={`/idiom/${idiom.id}`}>
      <Card hover className="h-full">
        <div className="flex flex-col h-full">
          {/* 标题和难度 */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 flex-1">
              {idiom.title}
            </h3>
            <Badge variant={difficulty.variant} size="sm">
              {difficulty.label}
            </Badge>
          </div>

          {/* 描述 */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {idiom.description}
          </p>

          {/* 分类和范式标签 */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge variant="primary" size="sm">
              {idiom.category}
            </Badge>
            {idiom.paradigms.map((paradigm) => (
              <Badge key={paradigm} variant="default" size="sm">
                {paradigm}
              </Badge>
            ))}
          </div>

          {/* 底部信息 */}
          <div className="mt-auto pt-3 border-t border-gray-100">
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
                <span>
                  {languageCount} 种语言
                </span>
              </span>
              {idiom.tags.length > 0 && (
                <span className="text-xs text-gray-400">
                  {idiom.tags.slice(0, 2).join(', ')}
                  {idiom.tags.length > 2 && '...'}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
