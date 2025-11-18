import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import type { Idiom, Language, UserPreferences } from '../types';
import { loadAllData } from '../utils/dataLoader';
import { loadPreferences, savePreferences } from '../utils/storage';

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
  const [preferences, setPreferences] = useState<UserPreferences>(
    loadPreferences()
  );

  // 加载数据
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await loadAllData();
        setIdioms(data.idioms);
        setLanguages(data.languages);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to load data')
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
