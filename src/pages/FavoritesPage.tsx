import { useMemo } from 'react';
import { useAppContext } from '../contexts';
import { IdiomGrid } from '../components';

/**
 * 收藏列表页面
 * 显示用户收藏的所有编程习语
 */
export function FavoritesPage() {
  const { idioms, preferences, loading } = useAppContext();

  // 获取收藏的习语列表
  const favoriteIdioms = useMemo(() => {
    return idioms.filter((idiom) =>
      preferences.favoriteIdioms.includes(idiom.id)
    );
  }, [idioms, preferences.favoriteIdioms]);

  // 加载中状态
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          我的收藏
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {favoriteIdioms.length > 0
            ? `你已收藏 ${favoriteIdioms.length} 个编程习语`
            : '还没有收藏任何习语'}
        </p>
      </div>

      {/* 收藏列表 */}
      {favoriteIdioms.length > 0 ? (
        <IdiomGrid idioms={favoriteIdioms} ariaLabel="收藏的编程习语列表" />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <svg
            className="w-24 h-24 text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mb-2">暂无收藏</h3>
          <p className="text-gray-600 max-w-md">
            浏览编程习语并点击收藏按钮，将感兴趣的内容添加到这里
          </p>
        </div>
      )}
    </div>
  );
}
