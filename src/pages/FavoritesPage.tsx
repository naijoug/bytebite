import { useMemo } from 'react';
import { useAppContext } from '../contexts';
import { EmptyState, IdiomGrid } from '../components';

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
        <EmptyState
          icon="favorite"
          title="暂无收藏"
          description="浏览编程习语并点击收藏按钮，将感兴趣的内容添加到这里"
          size="lg"
        />
      )}
    </div>
  );
}
