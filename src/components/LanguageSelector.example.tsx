/**
 * LanguageSelector 使用示例
 *
 * 这个文件展示了如何使用 LanguageSelector 组件
 */

import { LanguageSelector } from './LanguageSelector';
import { useAppContext } from '../contexts';
import { usePreferences } from '../hooks';

export function LanguageSelectorExample() {
  const { languages } = useAppContext();
  const { selectedLanguages, setSelectedLanguages } = usePreferences();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          语言选择器示例
        </h2>
        <p className="text-gray-600">选择你想要对比的编程语言</p>
      </div>

      {/* 基础用法 */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">基础用法</h3>
        <LanguageSelector
          availableLanguages={languages}
          selectedLanguages={selectedLanguages}
          onChange={setSelectedLanguages}
        />
      </div>

      {/* 限制最大选择数 */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          限制最多选择 3 种语言
        </h3>
        <LanguageSelector
          availableLanguages={languages}
          selectedLanguages={selectedLanguages}
          onChange={setSelectedLanguages}
          maxSelection={3}
        />
      </div>

      {/* 显示当前选择 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          当前选择的语言
        </h3>
        {selectedLanguages.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {selectedLanguages.map((langId) => {
              const lang = languages.find((l) => l.id === langId);
              return (
                <li key={langId} className="text-gray-700">
                  {lang?.name || langId}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500">未选择任何语言</p>
        )}
      </div>
    </div>
  );
}
