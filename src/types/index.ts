/**
 * 编程习语的代码实现
 */
export interface Implementation {
  languageId: string;
  code: string;
  explanation: string;
  output?: string;
  errorOutput?: string;
  designRationale?: string;
  pros?: string[];
  cons?: string[];
  references?: Reference[];
}

/**
 * 参考资源链接
 */
export interface Reference {
  title: string;
  url: string;
}

/**
 * 编程习语
 */
export interface Idiom {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  paradigms: string[];
  implementations: Implementation[];
  tags: string[];
}

/**
 * 编程语言
 */
export interface Language {
  id: string;
  name: string;
  version: string;
  paradigms: string[];
  typeSystem: 'static' | 'dynamic' | 'gradual';
  description: string;
  features: string[];
  officialDocs: string;
  icon?: string;
}

/**
 * 筛选选项
 */
export interface FilterOptions {
  categories?: string[];
  paradigms?: string[];
  difficulty?: ('beginner' | 'intermediate' | 'advanced')[];
  languages?: string[];
}

/**
 * 用户偏好设置
 */
export interface UserPreferences {
  favoriteIdioms: string[];
  selectedLanguages: string[];
  theme?: 'light' | 'dark';
}
