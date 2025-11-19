import { useState } from 'react';
import { CodeComparison } from './CodeComparison';
import { LanguageSelector } from './LanguageSelector';
import type { Implementation, Language } from '../types';

// Example data
const exampleImplementations: Implementation[] = [
  {
    languageId: 'javascript',
    code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled);`,
    explanation: '使用内置的 map 方法对数组进行转换',
    output: '[2, 4, 6, 8, 10]',
    designRationale:
      'JavaScript 的 map 方法是函数式编程的核心，返回新数组而不修改原数组',
    pros: ['简洁', '不可变性', '链式调用'],
  },
  {
    languageId: 'python',
    code: `numbers = [1, 2, 3, 4, 5]
doubled = list(map(lambda n: n * 2, numbers))
print(doubled)`,
    explanation: '使用内置的 map 函数配合 lambda 表达式',
    output: '[2, 4, 6, 8, 10]',
    designRationale:
      'Python 的 map 返回迭代器，需要转换为列表。列表推导式是更 Pythonic 的方式',
    pros: ['函数式风格', '惰性求值'],
    cons: ['需要转换为列表', '列表推导式更常用'],
  },
  {
    languageId: 'go',
    code: `package main

import "fmt"

func main() {
	numbers := []int{1, 2, 3, 4, 5}
	doubled := make([]int, len(numbers))
	for i, n := range numbers {
		doubled[i] = n * 2
	}
	fmt.Println(doubled)
}`,
    explanation: 'Go 没有内置 map 函数，使用 for 循环手动实现',
    output: '[2 4 6 8 10]',
    designRationale: 'Go 强调显式和简单，避免过度抽象',
    pros: ['性能高', '代码清晰'],
    cons: ['代码较长', '需要手动管理'],
  },
];

const exampleLanguages: Language[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    version: 'ES2023',
    paradigms: ['面向对象', '函数式', '事件驱动'],
    typeSystem: 'dynamic',
    description: '一种轻量级、解释型的编程语言，主要用于Web开发',
    features: ['原型继承', '闭包', '异步编程', '动态类型', '一等函数'],
    officialDocs: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript',
  },
  {
    id: 'python',
    name: 'Python',
    version: '3.12',
    paradigms: ['面向对象', '函数式', '过程式'],
    typeSystem: 'dynamic',
    description: '一种高级、通用的编程语言，强调代码可读性',
    features: [
      '简洁的语法',
      '丰富的标准库',
      '动态类型',
      '列表推导式',
      '装饰器',
    ],
    officialDocs: 'https://docs.python.org/zh-cn/3/',
  },
  {
    id: 'go',
    name: 'Go',
    version: '1.21',
    paradigms: ['并发', '过程式'],
    typeSystem: 'static',
    description: 'Google开发的静态类型编译语言，专注于简洁和并发',
    features: [
      'Goroutines并发',
      'Channel通信',
      '接口隐式实现',
      '垃圾回收',
      '快速编译',
    ],
    officialDocs: 'https://go.dev/doc/',
  },
];

export function CodeComparisonExample() {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    'javascript',
    'python',
  ]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">代码对比示例</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">选择语言</h2>
        <LanguageSelector
          availableLanguages={exampleLanguages}
          selectedLanguages={selectedLanguages}
          onChange={setSelectedLanguages}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">代码对比</h2>
        <CodeComparison
          implementations={exampleImplementations}
          selectedLanguages={selectedLanguages}
          availableLanguages={exampleLanguages}
        />
      </div>
    </div>
  );
}
