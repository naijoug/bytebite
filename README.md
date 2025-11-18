# ByteBite

编程语言对比学习平台 - 通过对比不同编程语言的实现方式来学习和理解编程概念。

## 技术栈

- **框架**: React 18+ with TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **路由**: React Router v6
- **代码质量**: ESLint + Prettier

## 项目结构

```
src/
├── components/     # 可复用组件
├── pages/          # 页面组件
├── types/          # TypeScript 类型定义
├── data/           # 静态数据文件
├── utils/          # 工具函数
├── contexts/       # React Context
└── hooks/          # 自定义 Hooks
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 功能特性

- 编程习语浏览和搜索
- 多语言代码对比视图
- 语言特性详情页
- 收藏功能
- 响应式设计（支持移动端）
