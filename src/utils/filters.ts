import type { Idiom, FilterOptions } from '../types';

/**
 * 根据关键词搜索习语
 * 搜索范围：标题、描述、标签
 */
export function searchIdioms(idioms: Idiom[], query: string): Idiom[] {
  if (!query || query.trim() === '') {
    return idioms;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return idioms.filter((idiom) => {
    // 搜索标题
    if (idiom.title.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // 搜索描述
    if (idiom.description.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // 搜索标签
    if (idiom.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))) {
      return true;
    }

    // 搜索分类
    if (idiom.category.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    return false;
  });
}

/**
 * 根据筛选条件过滤习语
 */
export function filterIdioms(
  idioms: Idiom[],
  filters: FilterOptions
): Idiom[] {
  let result = idioms;

  // 按分类筛选
  if (filters.categories && filters.categories.length > 0) {
    result = result.filter((idiom) =>
      filters.categories!.includes(idiom.category)
    );
  }

  // 按范式筛选
  if (filters.paradigms && filters.paradigms.length > 0) {
    result = result.filter((idiom) =>
      idiom.paradigms.some((paradigm) => filters.paradigms!.includes(paradigm))
    );
  }

  // 按难度筛选
  if (filters.difficulty && filters.difficulty.length > 0) {
    result = result.filter((idiom) =>
      filters.difficulty!.includes(idiom.difficulty)
    );
  }

  // 按语言筛选（习语必须有该语言的实现）
  if (filters.languages && filters.languages.length > 0) {
    result = result.filter((idiom) =>
      filters.languages!.some((langId) =>
        idiom.implementations.some((impl) => impl.languageId === langId)
      )
    );
  }

  return result;
}

/**
 * 组合搜索和筛选
 */
export function searchAndFilterIdioms(
  idioms: Idiom[],
  query: string,
  filters: FilterOptions
): Idiom[] {
  // 先搜索，再筛选
  const searchResults = searchIdioms(idioms, query);
  return filterIdioms(searchResults, filters);
}

/**
 * 获取所有可用的分类
 */
export function getAvailableCategories(idioms: Idiom[]): string[] {
  const categories = new Set<string>();
  idioms.forEach((idiom) => categories.add(idiom.category));
  return Array.from(categories).sort();
}

/**
 * 获取所有可用的范式
 */
export function getAvailableParadigms(idioms: Idiom[]): string[] {
  const paradigms = new Set<string>();
  idioms.forEach((idiom) => {
    idiom.paradigms.forEach((paradigm) => paradigms.add(paradigm));
  });
  return Array.from(paradigms).sort();
}

/**
 * 获取所有难度级别
 */
export function getAvailableDifficulties(): Array<
  'beginner' | 'intermediate' | 'advanced'
> {
  return ['beginner', 'intermediate', 'advanced'];
}
