import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
// 将 Prism 挂载到全局，供组件与语言模块使用
(window as any).Prism = Prism;
// 动态加载需要的语言，高亮前确保语言已注册
await Promise.all([
  import('prismjs/components/prism-javascript'),
  import('prismjs/components/prism-typescript'),
  import('prismjs/components/prism-python'),
  import('prismjs/components/prism-go'),
  import('prismjs/components/prism-rust'),
  import('prismjs/components/prism-java'),
]);
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
