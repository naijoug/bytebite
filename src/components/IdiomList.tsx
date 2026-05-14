import { useState, useMemo, useCallback, memo } from 'react';
import type { Idiom, FilterOptions } from '../types';
import { EmptyState } from './EmptyState';
import { IdiomGrid } from './IdiomGrid';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';
import { useDebounce } from '../hooks';
import { useAppContext } from '../contexts';
import {
  getActiveFilterSummaryItems,
  getAvailableCategories,
  getAvailableLanguageOptions,
  getAvailableParadigms,
  getIdiomSearchMatchLabels,
  searchAndFilterIdioms,
} from '../utils/filters';
import type { ActiveFilterSummaryItem } from '../utils/filters';

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

  const activeFilterSummaryItems = useMemo(() => {
    return getActiveFilterSummaryItems({
      query: searchQuery,
      filters,
      languages: availableLanguageOptions,
    });
  }, [searchQuery, filters, availableLanguageOptions]);

  const handleRemoveFilterItem = useCallback(
    (item: ActiveFilterSummaryItem) => {
      if (item.type === 'query') {
        setSearchQuery('');
        return;
      }

      const filterKeyByType = {
        category: 'categories',
        paradigm: 'paradigms',
        difficulty: 'difficulty',
        language: 'languages',
      } as const;
      const filterKey = filterKeyByType[item.type];

      setFilters((currentFilters) => ({
        ...currentFilters,
        [filterKey]: currentFilters[filterKey]?.filter(
          (value) => value !== item.value
        ),
      }));
    },
    []
  );

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
      <div className="space-y-3">
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
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2" aria-label="当前搜索和筛选条件">
            {activeFilterSummaryItems.map((item) => (
              <button
                key={`${item.type}:${item.value}`}
                type="button"
                onClick={() => handleRemoveFilterItem(item)}
                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                aria-label={`移除条件：${item.label}`}
                title={`移除条件：${item.label}`}
              >
                <span>{item.label}</span>
                <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 习语列表 */}
      {filteredIdioms.length > 0 ? (
        <IdiomGrid
          idioms={filteredIdioms}
          ariaLabel="编程习语列表"
          getSearchMatchLabels={(idiom) =>
            getIdiomSearchMatchLabels(idiom, debouncedQuery)
          }
        />
      ) : (
        <EmptyState
          icon="search"
          title="未找到习语"
          description="可尝试标题、标签、语言、代码或实现说明关键词"
          className="py-12"
          action={
            hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 min-h-[44px] text-sm sm:text-base text-blue-600 hover:text-blue-700 active:text-blue-800 font-medium"
                aria-label="清除所有搜索和筛选条件"
              >
                清除所有筛选
              </button>
            )
          }
        />
      )}
    </div>
  );
});
