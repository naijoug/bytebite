import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts';
import { EmptyState, IdiomGrid, ErrorMessage } from '../components';
import { Card, Badge, Button, Spinner } from '../components/common';

export function LanguagePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { idioms, languages, loading } = useAppContext();

  // 查找当前语言 (memoized)
  const language = useMemo(
    () => languages.find((lang) => lang.id === id),
    [languages, id]
  );

  // 获取该语言实现的所有习语 (memoized)
  const languageIdioms = useMemo(
    () =>
      language
        ? idioms.filter((idiom) =>
            idiom.implementations.some(
              (impl) => impl.languageId === language.id
            )
          )
        : [],
    [idioms, language]
  );

  // 加载中状态
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 语言不存在
  if (!language) {
    return (
      <ErrorMessage
        title="语言未找到"
        message={`找不到 ID 为 "${id}" 的编程语言。它可能已被删除或不存在。`}
        showHomeButton={true}
      />
    );
  }

  // 类型系统标签颜色
  const getTypeSystemColor = (typeSystem: string) => {
    switch (typeSystem) {
      case 'static':
        return 'primary';
      case 'dynamic':
        return 'warning';
      case 'gradual':
        return 'default';
      default:
        return 'default';
    }
  };

  // 类型系统文本
  const getTypeSystemText = (typeSystem: string) => {
    switch (typeSystem) {
      case 'static':
        return '静态类型';
      case 'dynamic':
        return '动态类型';
      case 'gradual':
        return '渐进类型';
      default:
        return typeSystem;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* 返回按钮 */}
      <div className="mb-4 sm:mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 -ml-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          返回首页
        </Button>
      </div>

      {/* 语言标题 */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {language.name}
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          {language.description}
        </p>
      </div>

      {/* 语言基本信息卡片 */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
          基本信息
        </h2>
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* 版本 */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">版本</h3>
              <p className="text-lg font-semibold text-gray-900">
                {language.version}
              </p>
            </div>

            {/* 类型系统 */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                类型系统
              </h3>
              <Badge
                variant={getTypeSystemColor(language.typeSystem)}
                size="md"
              >
                {getTypeSystemText(language.typeSystem)}
              </Badge>
            </div>

            {/* 编程范式 */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                编程范式
              </h3>
              <div className="flex flex-wrap gap-2">
                {language.paradigms.map((paradigm) => (
                  <Badge key={paradigm} variant="default" size="sm">
                    {paradigm}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 核心特性 */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
          核心特性
        </h2>
        <Card>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {language.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-500 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* 官方文档链接 */}
      <div className="mb-6 sm:mb-8">
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                官方文档
              </h3>
              <p className="text-sm text-gray-600">
                查看 {language.name} 的官方文档和学习资源
              </p>
            </div>
            <a
              href={language.officialDocs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors w-full sm:w-auto"
            >
              访问文档
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </Card>
      </div>

      {/* 该语言实现的习语列表 */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
          {language.name} 实现的编程习语
          <span className="ml-2 text-sm sm:text-base font-normal text-gray-500">
            ({languageIdioms.length} 个)
          </span>
        </h2>

        {languageIdioms.length > 0 ? (
          <IdiomGrid
            idioms={languageIdioms}
            ariaLabel={`${language.name} 实现的编程习语列表`}
          />
        ) : (
          <Card>
            <EmptyState icon="search" description="暂无该语言的编程习语实现" />
          </Card>
        )}
      </div>
    </div>
  );
}
