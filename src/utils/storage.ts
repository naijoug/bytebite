import type { UserPreferences } from '../types';

const STORAGE_KEY = 'bytebite_preferences';

/**
 * 默认用户偏好设置
 */
const DEFAULT_PREFERENCES: UserPreferences = {
  favoriteIdioms: [],
  selectedLanguages: [],
  theme: 'light',
};

/**
 * 从 Local Storage 读取用户偏好
 */
export function loadPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { ...DEFAULT_PREFERENCES };
    }
    const parsed = JSON.parse(stored);
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch (error) {
    console.warn('Failed to load preferences from localStorage:', error);
    return { ...DEFAULT_PREFERENCES };
  }
}

/**
 * 保存用户偏好到 Local Storage
 */
export function savePreferences(preferences: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.warn('Failed to save preferences to localStorage:', error);
  }
}

/**
 * 清除所有用户偏好
 */
export function clearPreferences(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear preferences from localStorage:', error);
  }
}

/**
 * 添加收藏的习语
 */
export function addFavoriteIdiom(idiomId: string): void {
  const preferences = loadPreferences();
  if (!preferences.favoriteIdioms.includes(idiomId)) {
    preferences.favoriteIdioms.push(idiomId);
    savePreferences(preferences);
  }
}

/**
 * 移除收藏的习语
 */
export function removeFavoriteIdiom(idiomId: string): void {
  const preferences = loadPreferences();
  preferences.favoriteIdioms = preferences.favoriteIdioms.filter(
    (id) => id !== idiomId
  );
  savePreferences(preferences);
}

/**
 * 检查习语是否已收藏
 */
export function isFavoriteIdiom(idiomId: string): boolean {
  const preferences = loadPreferences();
  return preferences.favoriteIdioms.includes(idiomId);
}

/**
 * 更新选中的语言列表
 */
export function updateSelectedLanguages(languages: string[]): void {
  const preferences = loadPreferences();
  preferences.selectedLanguages = languages;
  savePreferences(preferences);
}

/**
 * 更新主题设置
 */
export function updateTheme(theme: 'light' | 'dark'): void {
  const preferences = loadPreferences();
  preferences.theme = theme;
  savePreferences(preferences);
}
