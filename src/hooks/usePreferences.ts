/**
 * 用户偏好管理 Hook
 *
 * 提供了一组便捷的方法来管理用户偏好设置，包括：
 * - 收藏管理（添加、移除、检查）
 * - 语言选择
 * - 主题设置
 * - 批量更新和重置
 *
 * 所有更改会自动持久化到 Local Storage
 *
 * @example
 * ```tsx
 * const { addFavorite, isFavorite, selectedLanguages } = usePreferences();
 *
 * // 添加收藏
 * addFavorite('array-map');
 *
 * // 检查是否已收藏
 * if (isFavorite('array-map')) {
 *   console.log('已收藏');
 * }
 *
 * // 更新语言选择
 * setSelectedLanguages(['javascript', 'python']);
 * ```
 */

import { useAppContext } from '../contexts/AppContext';
import type { UserPreferences } from '../types';
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
