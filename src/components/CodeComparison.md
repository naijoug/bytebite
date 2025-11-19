# CodeComparison 组件

代码对比视图组件，用于并排展示多种编程语言的代码实现。

## 功能特性

- ✅ 集成 Prism.js 代码高亮
- ✅ 动态多列布局（根据选中语言数量自动调整）
- ✅ 显示代码说明和设计理念
- ✅ 显示代码输出示例
- ✅ 显示优缺点对比
- ✅ 提供参考资料链接
- ✅ 响应式布局（桌面端并排，移动端堆叠）

## Props

```typescript
interface CodeComparisonProps {
  implementations: Implementation[];
  selectedLanguages: string[];
  availableLanguages: Language[];
}
```

### implementations
- 类型: `Implementation[]`
- 必需: 是
- 描述: 编程习语的所有语言实现列表

### selectedLanguages
- 类型: `string[]`
- 必需: 是
- 描述: 用户选择要对比的语言 ID 列表

### availableLanguages
- 类型: `Language[]`
- 必需: 是
- 描述: 所有可用的编程语言信息

## 布局规则

组件会根据选中的语言数量自动调整布局：

- **1 种语言**: 单列布局
- **2 种语言**: 移动端单列，桌面端双列
- **3+ 种语言**: 移动端单列，平板双列，桌面端三列

## 支持的编程语言

当前支持以下语言的语法高亮：

- JavaScript
- TypeScript
- Python
- Go
- Rust
- Java

## 使用示例

```tsx
import { CodeComparison } from './components';
import { useState } from 'react';

function IdiomDetailPage() {
  const [selectedLanguages, setSelectedLanguages] = useState(['javascript', 'python']);
  
  return (
    <CodeComparison
      implementations={idiom.implementations}
      selectedLanguages={selectedLanguages}
      availableLanguages={languages}
    />
  );
}
```

## 响应式断点

- `lg`: 1024px - 双列布局
- `xl`: 1280px - 三列布局

## 样式定制

组件使用 Tailwind CSS 类名，可以通过修改 `tailwind.config.js` 来定制样式。

代码高亮主题使用 `prism-tomorrow.css`，可以通过导入不同的 Prism 主题文件来更换。

## 可访问性

- 代码块使用语义化的 `<pre>` 和 `<code>` 标签
- 外部链接包含 `rel="noopener noreferrer"` 属性
- 所有链接都有明确的文本标识

## 性能优化

- 使用 `useEffect` 钩子仅在必要时重新高亮代码
- 使用 `Map` 数据结构缓存高亮后的代码
- 代码高亮在客户端执行，避免服务器端渲染开销
