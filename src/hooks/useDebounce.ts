import { useEffect, useState } from 'react';

/**
 * 防抖 Hook
 * 延迟更新值，直到指定的延迟时间内没有新的值变化
 *
 * @param value - 需要防抖的值
 * @param delay - 延迟时间（毫秒），默认 500ms
 * @returns 防抖后的值
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 设置定时器，在延迟后更新防抖值
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函数：如果 value 在延迟期间再次变化，清除之前的定时器
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
