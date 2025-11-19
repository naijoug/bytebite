export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-white border-t border-gray-200 mt-auto"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
              ByteBite
            </h3>
            <p className="text-sm text-gray-600">
              编程语言对比学习平台，帮助开发者通过对比学习不同语言的实现方式。
            </p>
          </div>

          <nav aria-label="快速链接">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
              快速链接
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/idioms"
                  className="inline-block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors min-h-[44px] flex items-center focus:outline-none focus:underline"
                >
                  习语列表
                </a>
              </li>
              <li>
                <a
                  href="/languages"
                  className="inline-block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors min-h-[44px] flex items-center focus:outline-none focus:underline"
                >
                  编程语言
                </a>
              </li>
              <li>
                <a
                  href="/favorites"
                  className="inline-block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors min-h-[44px] flex items-center focus:outline-none focus:underline"
                >
                  我的收藏
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="关于链接">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
              关于
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors min-h-[44px] flex items-center focus:outline-none focus:underline"
                  aria-label="在新窗口中打开 GitHub"
                >
                  GitHub
                  <span className="sr-only">(在新窗口中打开)</span>
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="inline-block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors min-h-[44px] flex items-center focus:outline-none focus:underline"
                >
                  关于项目
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
          <p className="text-center text-xs sm:text-sm text-gray-500">
            © {currentYear} ByteBite. 保留所有权利。
          </p>
        </div>
      </div>
    </footer>
  );
};
