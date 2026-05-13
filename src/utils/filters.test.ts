import { describe, it, expect } from 'vitest';
import {
  searchIdioms,
  filterIdioms,
  searchAndFilterIdioms,
  getAvailableCategories,
  getAvailableParadigms,
  getAvailableDifficulties,
  getAvailableLanguageIds,
  getAvailableLanguageOptions,
  getIdiomSearchMatchLabels,
} from './filters';
import type { Idiom, FilterOptions, Language } from '../types';

// 测试数据
const mockIdioms: Idiom[] = [
  {
    id: 'test-1',
    title: '数组映射',
    description: '将数组中的每个元素通过函数转换',
    category: '数据处理',
    difficulty: 'beginner',
    paradigms: ['函数式'],
    tags: ['数组', '转换'],
    implementations: [
      {
        languageId: 'javascript',
        code: 'const result = arr.map(x => x * 2)',
        explanation: 'JS map',
      },
      {
        languageId: 'python',
        code: 'result = list(map(lambda x: x * 2, arr))',
        explanation: 'Python map',
      },
    ],
  },
  {
    id: 'test-2',
    title: '错误处理',
    description: '处理可能失败的操作',
    category: '错误处理',
    difficulty: 'intermediate',
    paradigms: ['过程式', '函数式'],
    tags: ['错误', '异常'],
    implementations: [
      {
        languageId: 'javascript',
        code: 'try { } catch(e) { }',
        explanation: 'JS try-catch',
      },
      {
        languageId: 'go',
        code: 'if err != nil { }',
        explanation: 'Go error handling',
      },
    ],
  },
  {
    id: 'test-3',
    title: '并发处理',
    description: '同时执行多个任务',
    category: '并发',
    difficulty: 'advanced',
    paradigms: ['并发'],
    tags: ['并发', '异步'],
    implementations: [
      {
        languageId: 'go',
        code: 'go func() { }()',
        explanation: 'Go goroutines',
      },
    ],
  },
];

const mockLanguages: Language[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    version: 'ES2023',
    paradigms: ['函数式'],
    typeSystem: 'dynamic',
    description: 'JavaScript language',
    features: ['map'],
    officialDocs: 'https://developer.mozilla.org/',
  },
  {
    id: 'python',
    name: 'Python',
    version: '3.12',
    paradigms: ['过程式'],
    typeSystem: 'dynamic',
    description: 'Python language',
    features: ['list'],
    officialDocs: 'https://docs.python.org/',
  },
];

describe('searchIdioms', () => {
  it('应该返回所有习语当搜索词为空', () => {
    const result = searchIdioms(mockIdioms, '');
    expect(result).toHaveLength(3);
  });

  it('应该根据标题搜索习语', () => {
    const result = searchIdioms(mockIdioms, '数组');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('test-1');
  });

  it('应该根据描述搜索习语', () => {
    const result = searchIdioms(mockIdioms, '失败');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('test-2');
  });

  it('应该根据标签搜索习语', () => {
    const result = searchIdioms(mockIdioms, '异常');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('test-2');
  });

  it('应该根据分类搜索习语', () => {
    const result = searchIdioms(mockIdioms, '并发');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('test-3');
  });

  it('应该根据实现语言搜索习语', () => {
    const result = searchIdioms(mockIdioms, 'python');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('test-1');
  });

  it('应该根据实现代码搜索习语', () => {
    const result = searchIdioms(mockIdioms, 'goroutines');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('test-3');
  });

  it('应该根据实现说明搜索习语', () => {
    const result = searchIdioms(mockIdioms, 'try-catch');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('test-2');
  });

  it('应该不区分大小写搜索', () => {
    const result = searchIdioms(mockIdioms, '数组映射');
    expect(result).toHaveLength(1);
  });

  it('应该返回空数组当没有匹配结果', () => {
    const result = searchIdioms(mockIdioms, '不存在的内容');
    expect(result).toHaveLength(0);
  });
});

describe('getIdiomSearchMatchLabels', () => {
  it('应该返回空数组当搜索词为空', () => {
    const labels = getIdiomSearchMatchLabels(mockIdioms[0], '  ');
    expect(labels).toEqual([]);
  });

  it('应该返回命中的基础字段标签', () => {
    const labels = getIdiomSearchMatchLabels(mockIdioms[0], '数组');
    expect(labels).toEqual(['标题', '描述', '标签']);
  });

  it('应该返回命中的实现字段标签', () => {
    const labels = getIdiomSearchMatchLabels(mockIdioms[1], 'try-catch');
    expect(labels).toEqual(['实现说明']);
  });

  it('应该支持不区分大小写匹配实现代码', () => {
    const labels = getIdiomSearchMatchLabels(mockIdioms[2], 'FUNC');
    expect(labels).toEqual(['实现代码']);
  });
});

describe('filterIdioms', () => {
  it('应该返回所有习语当没有筛选条件', () => {
    const result = filterIdioms(mockIdioms, {});
    expect(result).toHaveLength(3);
  });

  it('应该按分类筛选', () => {
    const filters: FilterOptions = { categories: ['数据处理'] };
    const result = filterIdioms(mockIdioms, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('test-1');
  });

  it('应该按难度筛选', () => {
    const filters: FilterOptions = { difficulty: ['beginner'] };
    const result = filterIdioms(mockIdioms, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('test-1');
  });

  it('应该按范式筛选', () => {
    const filters: FilterOptions = { paradigms: ['函数式'] };
    const result = filterIdioms(mockIdioms, filters);
    expect(result).toHaveLength(2);
  });

  it('应该按语言筛选', () => {
    const filters: FilterOptions = { languages: ['go'] };
    const result = filterIdioms(mockIdioms, filters);
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.id)).toContain('test-2');
    expect(result.map((i) => i.id)).toContain('test-3');
  });

  it('应该支持多个筛选条件组合', () => {
    const filters: FilterOptions = {
      difficulty: ['intermediate', 'advanced'],
      paradigms: ['并发'],
    };
    const result = filterIdioms(mockIdioms, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('test-3');
  });

  it('应该返回空数组当没有匹配的习语', () => {
    const filters: FilterOptions = { categories: ['不存在的分类'] };
    const result = filterIdioms(mockIdioms, filters);
    expect(result).toHaveLength(0);
  });
});

describe('searchAndFilterIdioms', () => {
  it('应该同时应用搜索和筛选', () => {
    const result = searchAndFilterIdioms(mockIdioms, '处理', {
      difficulty: ['intermediate'],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('test-2');
  });

  it('应该先搜索再筛选', () => {
    const result = searchAndFilterIdioms(mockIdioms, '处理', {
      paradigms: ['函数式'],
    });
    // "处理" matches both "数据处理" and "错误处理", both have "函数式" paradigm
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.id)).toContain('test-1');
    expect(result.map((i) => i.id)).toContain('test-2');
  });
});

describe('getAvailableCategories', () => {
  it('应该返回所有唯一的分类', () => {
    const categories = getAvailableCategories(mockIdioms);
    expect(categories).toHaveLength(3);
    expect(categories).toContain('数据处理');
    expect(categories).toContain('错误处理');
    expect(categories).toContain('并发');
  });

  it('应该返回排序后的分类', () => {
    const categories = getAvailableCategories(mockIdioms);
    expect(categories).toEqual(['并发', '数据处理', '错误处理']);
  });
});

describe('getAvailableParadigms', () => {
  it('应该返回所有唯一的范式', () => {
    const paradigms = getAvailableParadigms(mockIdioms);
    expect(paradigms).toContain('函数式');
    expect(paradigms).toContain('过程式');
    expect(paradigms).toContain('并发');
  });

  it('应该返回排序后的范式', () => {
    const paradigms = getAvailableParadigms(mockIdioms);
    // Check that it's sorted and contains all paradigms
    expect(paradigms).toHaveLength(3);
    expect(paradigms).toContain('函数式');
    expect(paradigms).toContain('过程式');
    expect(paradigms).toContain('并发');
    // Verify it's sorted
    expect(paradigms).toEqual([...paradigms].sort());
  });
});

describe('getAvailableDifficulties', () => {
  it('应该返回所有难度级别', () => {
    const difficulties = getAvailableDifficulties();
    expect(difficulties).toEqual(['beginner', 'intermediate', 'advanced']);
  });
});

describe('getAvailableLanguageIds', () => {
  it('应该返回所有唯一且排序后的语言 ID', () => {
    const languageIds = getAvailableLanguageIds(mockIdioms);
    expect(languageIds).toEqual(['go', 'javascript', 'python']);
  });
});

describe('getAvailableLanguageOptions', () => {
  it('应该只返回有实现的语言，并使用语言展示名称', () => {
    const languageOptions = getAvailableLanguageOptions(
      mockIdioms,
      mockLanguages
    );

    expect(languageOptions).toEqual([
      { id: 'go', name: 'go' },
      { id: 'javascript', name: 'JavaScript' },
      { id: 'python', name: 'Python' },
    ]);
  });
});
