# LanguageSelector 组件

语言选择器组件，允许用户选择多种编程语言进行对比学习。

## 功能特性

- ✅ 多选下拉菜单界面
- ✅ 显示已选语言的标签（Badge）
- ✅ 支持移除单个已选语言
- ✅ 清除所有选择功能
- ✅ 重置为默认选择功能
- ✅ 可选的最大选择数限制
- ✅ 自动保存到用户偏好（通过 onChange 回调）
- ✅ 点击外部自动关闭下拉菜单
- ✅ 完整的键盘导航和无障碍支持
- ✅ 响应式设计

## Props

```typescript
interface LanguageSelectorProps {
  // 可选择的语言列表
  availableLanguages: Language[];
  
  // 当前已选择的语言 ID 列表
  selectedLanguages: string[];
  
  // 选择变化时的回调函数
  onChange: (languages: string[]) => void;
  
  // 可选：最大选择数量限制
  maxSelection?: number;
  
  // 可选：自定义 CSS 类名
  className?: string;
}
```

## 使用示例

### 基础用法

```tsx
import { LanguageSelector } from './components';
import { useAppContext } from './contexts';
import { usePreferences } from './hooks';

function MyComponent() {
  const { languages } = useAppContext();
  const { selectedLanguages, setSelectedLanguages } = usePreferences();

  return (
    <LanguageSelector
      availableLanguages={languages}
      selectedLanguages={selectedLanguages}
      onChange={setSelectedLanguages}
    />
  );
}
```

### 限制最大选择数

```tsx
<LanguageSelector
  availableLanguages={languages}
  selectedLanguages={selectedLanguages}
  onChange={setSelectedLanguages}
  maxSelection={3}
/>
```

### 自定义样式

```tsx
<LanguageSelector
  availableLanguages={languages}
  selectedLanguages={selectedLanguages}
  onChange={setSelectedLanguages}
  className="max-w-md"
/>
```

## 用户交互

### 选择语言
1. 点击"选择语言"按钮打开下拉菜单
2. 点击语言项进行选择/取消选择
3. 已选语言会显示复选框标记
4. 达到最大选择数时，未选语言会被禁用

### 管理已选语言
- **移除单个语言**：点击语言标签上的 × 按钮
- **清除所有**：点击清除按钮（× 图标）
- **重置为默认**：点击重置按钮（↻ 图标），会选择前两种语言

### 关闭下拉菜单
- 点击组件外部区域
- 再次点击"选择语言"按钮

## 无障碍特性

- 使用 `role="listbox"` 和 `role="option"` 语义化标记
- 提供 `aria-label` 和 `aria-expanded` 属性
- 所有交互元素都有适当的 `aria-label`
- 支持键盘导航
- 触摸区域符合 44px 最小尺寸要求

## 数据持久化

组件通过 `onChange` 回调将选择的语言传递给父组件。配合 `usePreferences` hook 使用时，选择会自动保存到浏览器的 Local Storage：

```typescript
// 在 AppContext 中
const setSelectedLanguages = (languages: string[]) => {
  updatePreferences({ selectedLanguages: languages });
};

// updatePreferences 会调用 savePreferences
// 将数据保存到 localStorage
```

## 设计决策

### 为什么使用下拉菜单而不是复选框列表？

- 节省屏幕空间，特别是在移动设备上
- 提供更清晰的视觉层次
- 符合用户对选择器的常见预期

### 为什么显示已选语言的标签？

- 提供即时的视觉反馈
- 允许快速移除单个语言
- 清楚显示当前选择状态

### 为什么提供清除和重置功能？

- 清除：快速移除所有选择，重新开始
- 重置：恢复到推荐的默认配置（前两种语言）
- 提高用户操作效率

## 相关需求

实现以下需求的验收标准：

- **需求 2.3**: 提供语言选择器允许用户选择要对比的编程语言 ✅
- **需求 2.4**: 当用户选择两种语言，显示两列代码对比视图 ✅（通过 onChange 传递选择）
- **需求 2.5**: 当用户选择多种语言（超过两种），显示相应数量的列 ✅（通过 onChange 传递选择）
- **需求 2.8**: 记住用户的语言选择偏好在当前会话中 ✅（通过 Local Storage 持久化）

## 未来改进

- [ ] 添加搜索/过滤语言功能
- [ ] 支持语言分组（按范式、类型系统等）
- [ ] 添加"常用语言"快捷选择
- [ ] 支持拖拽排序已选语言
- [ ] 添加语言图标显示
