export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ByteBite
            </h3>
            <p className="text-sm text-gray-600">
              编程语言对比学习平台，帮助开发者通过对比学习不同语言的实现方式。
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">快速链接</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/idioms"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  习语列表
                </a>
              </li>
              <li>
                <a
                  href="/languages"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  编程语言
                </a>
              </li>
              <li>
                <a
                  href="/favorites"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  我的收藏
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">关于</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  关于项目
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © {currentYear} ByteBite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
