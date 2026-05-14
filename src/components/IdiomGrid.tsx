import { memo } from 'react';
import type { Idiom } from '../types';
import type { SearchMatchLabel } from '../utils/filters';
import { IdiomCard } from './IdiomCard';

export interface IdiomGridProps {
  idioms: Idiom[];
  ariaLabel: string;
  getSearchMatchLabels?: (idiom: Idiom) => SearchMatchLabel[];
}

export const IdiomGrid = memo(function IdiomGrid({
  idioms,
  ariaLabel,
  getSearchMatchLabels,
}: IdiomGridProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      role="list"
      aria-label={ariaLabel}
    >
      {idioms.map((idiom) => (
        <IdiomCard
          key={idiom.id}
          idiom={idiom}
          searchMatchLabels={getSearchMatchLabels?.(idiom)}
        />
      ))}
    </div>
  );
});
