import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts';
import {
  LanguageSelector,
  CodeComparison,
  FavoriteButton,
  ErrorMessage,
} from '../components';
import { Badge, Button, Spinner } from '../components/common';

export function IdiomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    idioms,
    languages,
    loading,
    selectedLanguages,
    setSelectedLanguages,
  } = useAppContext();

  // 查找当前习语 (memoized)
  const idiom = useMemo(() => idioms.find((i) => i.id === id), [idioms, id]);

  // 获取该习语支持的语言 (memoized)
  const availableLanguageIds = useMemo(
    () => idiom?.implementations.map((impl) => impl.languageId) || [],
    [idiom]
  );

  const availableLanguages = useMemo(
    () => languages.filter((lang) => availableLanguageIds.includes(lang.id)),
    [languages, availableLanguageIds]
  );

  // 确保至少选择了一种语言 (memoized)
  const displayLanguages = useMemo(() => {
    const effectiveSelectedLanguages =
      selectedLanguages.length > 0
        ? selectedLanguages.filter((langId) =>
            availableLanguageIds.includes(langId)
          )
        : availableLanguageIds.slice(0, 2);

    return effectiveSelectedLanguages.length > 0
      ? effectiveSelectedLanguages
      : availableLanguageIds.slice(0, 2);
  }, [selectedLanguages, availableLanguageIds]);

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

  // 习语不存在
  if (!idiom) {
    return (
      <ErrorMessage
        title="习语未找到"
        message={`找不到 ID 为 "${id}" 的编程习语。它可能已被删除或不存在。`}
        showHomeButton={true}
      />
    );
  }

  // 难度标签颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'danger';
      default:
        return 'default';
    }
  };

  // 难度文本
  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '初级';
      case 'intermediate':
        return '中级';
      case 'advanced':
        return '高级';
      default:
        return difficulty;
    }
  };

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* 返回按钮 */}
      <nav className="mb-4 sm:mb-6" aria-label="面包屑导航">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 -ml-2"
          aria-label="返回习语列表"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          返回列表
        </Button>
      </nav>

      {/* 习语标题和信息 */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {idiom.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-4">
              {idiom.description}
            </p>
          </div>

          {/* 收藏按钮 */}
          <FavoriteButton
            idiomId={idiom.id}
            className="shrink-0 w-full sm:w-auto"
          />
        </div>

        {/* 标签和元信息 */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={getDifficultyColor(idiom.difficulty)} size="md">
            {getDifficultyText(idiom.difficulty)}
          </Badge>
          <Badge variant="default" size="md">
            {idiom.category}
          </Badge>
          {idiom.paradigms.map((paradigm) => (
            <Badge key={paradigm} variant="default" size="md">
              {paradigm}
            </Badge>
          ))}
          <div className="text-sm text-gray-500">
            支持 {idiom.implementations.length} 种语言
          </div>
        </div>

        {/* 标签 */}
        {idiom.tags && idiom.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {idiom.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* 语言选择器 */}
      <section
        className="mb-6 sm:mb-8"
        aria-labelledby="language-selector-heading"
      >
        <h2
          id="language-selector-heading"
          className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4"
        >
          选择要对比的语言
        </h2>
        <LanguageSelector
          availableLanguages={availableLanguages}
          selectedLanguages={displayLanguages}
          onChange={setSelectedLanguages}
        />
      </section>

      {/* 代码对比视图 */}
      <section
        className="mb-6 sm:mb-8"
        aria-labelledby="code-comparison-heading"
      >
        <h2
          id="code-comparison-heading"
          className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4"
        >
          代码实现
        </h2>
        <CodeComparison
          implementations={idiom.implementations}
          selectedLanguages={displayLanguages}
          availableLanguages={languages}
        />
      </section>
    </article>
  );
}
