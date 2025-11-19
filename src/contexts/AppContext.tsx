/**
 * 全局应用状态管理
 *
 * AppContext 提供了整个应用的全局状态，包括：
 * - 编程习语和语言数据
 * - 数据加载状态（loading, error）
 * - 用户偏好设置（收藏、语言选择、主题）
 * - 收藏管理功能
 *
 * 使用方式：
 * ```tsx
 * const { idioms, languages, toggleFavorite } = useAppContext();
 * ```
 *
 * 数据持久化：
 * - 用户偏好自动保存到 Local Storage
 * - 应用启动时自动加载保存的偏好
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Idiom, Language, UserPreferences } from '../types';
import { loadAllData } from '../utils/dataLoader';
import { loadPreferences, savePreferences } from '../utils/storage';
import { LoadingScreen, ErrorMessage } from '../components';

interface AppContextType {
  // 数据状态
  idioms: Idiom[];
  languages: Language[];
  loading: boolean;
  error: Error | null;

  // 用户偏好
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;

  // 收藏管理
  toggleFavorite: (idiomId: string) => void;
  isFavorite: (idiomId: string) => boolean;

  // 语言选择
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [idioms, setIdioms] = useState<Idiom[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [preferences, setPreferences] =
    useState<UserPreferences>(loadPreferences());

  // 加载数据
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const data = await loadAllData();
        setIdioms(data.idioms);
        setLanguages(data.languages);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('加载数据失败，请检查网络连接')
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // 重试加载数据
  const retryLoadData = () => {
    setLoading(true);
    setError(null);
    loadAllData()
      .then((data) => {
        setIdioms(data.idioms);
        setLanguages(data.languages);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err : new Error('加载数据失败，请检查网络连接')
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 更新用户偏好
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  // 切换收藏状态
  const toggleFavorite = (idiomId: string) => {
    const favoriteIdioms = preferences.favoriteIdioms.includes(idiomId)
      ? preferences.favoriteIdioms.filter((id) => id !== idiomId)
      : [...preferences.favoriteIdioms, idiomId];

    updatePreferences({ favoriteIdioms });
  };

  // 检查是否已收藏
  const isFavorite = (idiomId: string) => {
    return preferences.favoriteIdioms.includes(idiomId);
  };

  // 设置选中的语言
  const setSelectedLanguages = (languages: string[]) => {
    updatePreferences({ selectedLanguages: languages });
  };

  const value: AppContextType = {
    idioms,
    languages,
    loading,
    error,
    preferences,
    updatePreferences,
    toggleFavorite,
    isFavorite,
    selectedLanguages: preferences.selectedLanguages,
    setSelectedLanguages,
  };

  // 显示加载状态
  if (loading) {
    return <LoadingScreen message="正在加载数据..." />;
  }

  // 显示错误状态
  if (error) {
    return (
      <ErrorMessage
        title="数据加载失败"
        message={error.message}
        onRetry={retryLoadData}
        showHomeButton={false}
      />
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
