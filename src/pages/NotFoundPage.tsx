import { Link } from 'react-router-dom';

/**
 * 404 页面 - 当用户访问不存在的路由时显示
 */
export function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">页面未找到</h1>
        <p className="text-gray-600 mb-8">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回首页
          </Link>
          <Link
            to="/favorites"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            查看收藏
          </Link>
        </div>
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            您可能在寻找：
          </h2>
          <ul className="space-y-2 text-left max-w-xs mx-auto">
            <li>
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                → 浏览所有编程习语
              </Link>
            </li>
            <li>
              <Link
                to="/favorites"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                → 我的收藏列表
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
