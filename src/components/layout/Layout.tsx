import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Skip navigation link for keyboard users */}
      <a href="#main-content" className="skip-link">
        跳转到主内容
      </a>

      <Header />

      <main
        id="main-content"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"
        role="main"
        aria-label="主要内容"
      >
        {children}
      </main>

      <Footer />
    </div>
  );
};
