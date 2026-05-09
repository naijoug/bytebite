/**
 * 数据加载工具
 *
 * 负责从静态 JSON 文件加载应用数据：
 * - idioms.json: 编程习语及其实现
 * - languages.json: 编程语言信息
 *
 * 所有函数都是异步的，会抛出加载错误供调用者处理
 *
 * @example
 * ```typescript
 * try {
 *   const { idioms, languages } = await loadAllData();
 *   console.log(`加载了 ${idioms.length} 个习语`);
 * } catch (error) {
 *   console.error('数据加载失败', error);
 * }
 * ```
 */

import type { Idiom, Language } from '../types';

/**
 * 加载编程习语数据
 *
 * @returns Promise<Idiom[]> 习语数组
 * @throws 如果加载失败或 JSON 解析失败
 */
export async function loadIdioms(): Promise<Idiom[]> {
  try {
    const idiomsUrl = new URL('../data/idioms.json', import.meta.url).href;
    const response = await fetch(idiomsUrl);
    if (!response.ok) {
      throw new Error(`Failed to load idioms: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading idioms:', error);
    throw error;
  }
}

/**
 * 加载编程语言数据
 *
 * @returns Promise<Language[]> 语言数组
 * @throws 如果加载失败或 JSON 解析失败
 */
export async function loadLanguages(): Promise<Language[]> {
  try {
    const languagesUrl = new URL('../data/languages.json', import.meta.url)
      .href;
    const response = await fetch(languagesUrl);
    if (!response.ok) {
      throw new Error(`Failed to load languages: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading languages:', error);
    throw error;
  }
}

/**
 * 并行加载所有数据
 *
 * 使用 Promise.all 同时加载习语和语言数据，提高加载效率
 *
 * @returns Promise<{idioms, languages}> 包含所有数据的对象
 * @throws 如果任一数据加载失败
 */
export async function loadAllData(): Promise<{
  idioms: Idiom[];
  languages: Language[];
}> {
  try {
    const [idioms, languages] = await Promise.all([
      loadIdioms(),
      loadLanguages(),
    ]);
    return { idioms, languages };
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
}
