import type { Idiom, Language } from '../types';

/**
 * 加载编程习语数据
 */
export async function loadIdioms(): Promise<Idiom[]> {
  try {
    const response = await fetch('/src/data/idioms.json');
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
 */
export async function loadLanguages(): Promise<Language[]> {
  try {
    const response = await fetch('/src/data/languages.json');
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
