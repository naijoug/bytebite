import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

declare global {
  interface Window {
    Prism: typeof Prism;
  }
}

// 将 Prism 挂载到全局，供组件与语言模块使用
window.Prism = Prism;
// Prism 的部分语言包依赖其他 grammar，需要先按顺序加载依赖。
// 例如 PHP 依赖 markup-templating，C++ 依赖 C；如果全部放进 Promise.all，
// 构建可以通过，但运行时首次高亮对应语言时可能失败。
await import('prismjs/components/prism-markup-templating');
await import('prismjs/components/prism-c');
// 动态加载需要的语言，高亮前确保语言已注册
await Promise.all([
  import('prismjs/components/prism-javascript'),
  import('prismjs/components/prism-typescript'),
  import('prismjs/components/prism-python'),
  import('prismjs/components/prism-go'),
  import('prismjs/components/prism-rust'),
  import('prismjs/components/prism-java'),
  import('prismjs/components/prism-csharp'),
  import('prismjs/components/prism-ruby'),
  import('prismjs/components/prism-php'),
  import('prismjs/components/prism-swift'),
  import('prismjs/components/prism-kotlin'),
  import('prismjs/components/prism-cpp'),
]);
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
