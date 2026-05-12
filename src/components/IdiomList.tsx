import { useState, useMemo, useCallback, memo } from 'react';
import type { Idiom, FilterOptions } from '../types';
import { IdiomCard } from './IdiomCard';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';
import { useDebounce } from '../hooks';
import { useAppContext } from '../contexts';
import {
  getAvailableCategories,
  getAvailableLanguageOptions,
  getAvailableParadigms,
  searchAndFilterIdioms,
} from '../utils/filters';

export interface IdiomListProps {
  idioms: Idiom[];
}

export const IdiomList = memo(function IdiomList({ idioms }: IdiomListProps) {
  const { languages } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);

  // 使用防抖优化搜索性能
  const debouncedQuery = useDebounce(searchQuery, 300);

  // 计算过滤后的习语列表
  const filteredIdioms = useMemo(() => {
    return searchAndFilterIdioms(idioms, debouncedQuery, filters);
  }, [idioms, debouncedQuery, filters]);

  // 处理搜索 (memoized)
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // 处理筛选 (memoized)
  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  // 清除所有筛选 (memoized)
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setFilters({});
  }, []);

  // 检查是否有激活的筛选条件
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      (filters.categories && filters.categories.length > 0) ||
      (filters.paradigms && filters.paradigms.length > 0) ||
      (filters.difficulty && filters.difficulty.length > 0) ||
      (filters.languages && filters.languages.length > 0)
    );
  }, [searchQuery, filters]);

  const availableLanguageOptions = useMemo(() => {
    return getAvailableLanguageOptions(idioms, languages);
  }, [idioms, languages]);

  return (
    <div className="space-y-6">
      {/* 搜索和筛选控制栏 */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              onClear={() => setSearchQuery('')}
              placeholder="搜索标题、标签、语言或代码..."
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 min-h-[44px] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium text-gray-700"
            aria-label={showFilters ? '隐藏筛选面板' : '显示筛选面板'}
            aria-expanded={showFilters}
            aria-controls="filter-panel"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span className="hidden sm:inline">筛选</span>
          </button>
        </div>

        {/* 筛选面板 */}
        {showFilters && (
          <div id="filter-panel">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              availableCategories={getAvailableCategories(idioms)}
              availableParadigms={getAvailableParadigms(idioms)}
              availableLanguages={availableLanguageOptions}
            />
          </div>
        )}
      </div>

      {/* 结果统计和清除按钮 */}
      <div
        className="flex items-center justify-between"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="text-sm text-gray-600">
          找到{' '}
          <span className="font-semibold text-gray-900">
            {filteredIdioms.length}
          </span>{' '}
          个习语
          {idioms.length !== filteredIdioms.length && (
            <span className="text-gray-400"> / 共 {idioms.length} 个</span>
          )}
        </p>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm sm:text-base text-blue-600 hover:text-blue-700 active:text-blue-800 font-medium min-h-[44px] px-2 py-2"
            aria-label="清除所有搜索和筛选条件"
          >
            清除筛选
          </button>
        )}
      </div>

      {/* 习语列表 */}
      {filteredIdioms.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          role="list"
          aria-label="编程习语列表"
        >
          {filteredIdioms.map((idiom) => (
            <IdiomCard key={idiom.id} idiom={idiom} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12" role="status">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">未找到习语</h3>
          <p className="mt-1 text-sm text-gray-500">
            可尝试标题、标签、语言、代码或实现说明关键词
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 min-h-[44px] text-sm sm:text-base text-blue-600 hover:text-blue-700 active:text-blue-800 font-medium"
              aria-label="清除所有搜索和筛选条件"
            >
              清除所有筛选
            </button>
          )}
        </div>
      )}
    </div>
  );
});
