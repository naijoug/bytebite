import { useAppContext } from '../contexts/AppContext';
import type { UserPreferences } from '../types';

/**
 * Hook for managing user preferences
 */
export function usePreferences() {
  const {
    preferences,
    updatePreferences,
    toggleFavorite,
    isFavorite,
    selectedLanguages,
    setSelectedLanguages,
  } = useAppContext();

  /**
   * 添加收藏的习语
   */
  const addFavorite = (idiomId: string) => {
    if (!isFavorite(idiomId)) {
      toggleFavorite(idiomId);
    }
  };

  /**
   * 移除收藏的习语
   */
  const removeFavorite = (idiomId: string) => {
    if (isFavorite(idiomId)) {
      toggleFavorite(idiomId);
    }
  };

  /**
   * 获取所有收藏的习语ID列表
   */
  const getFavorites = () => {
    return preferences.favoriteIdioms;
  };

  /**
   * 更新主题
   */
  const setTheme = (theme: 'light' | 'dark') => {
    updatePreferences({ theme });
  };

  /**
   * 获取当前主题
   */
  const getTheme = () => {
    return preferences.theme || 'light';
  };

  /**
   * 重置所有偏好设置
   */
  const resetPreferences = () => {
    updatePreferences({
      favoriteIdioms: [],
      selectedLanguages: [],
      theme: 'light',
    });
  };

  /**
   * 批量更新偏好设置
   */
  const updateMultiple = (updates: Partial<UserPreferences>) => {
    updatePreferences(updates);
  };

  return {
    // 原始偏好数据
    preferences,

    // 收藏管理
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavorites,

    // 语言选择
    selectedLanguages,
    setSelectedLanguages,

    // 主题管理
    theme: getTheme(),
    setTheme,

    // 通用操作
    updatePreferences: updateMultiple,
    resetPreferences,
  };
}
