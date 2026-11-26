import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface SimplePaginationProps<T extends unknown> {
  count: number;
  pageSize: number;
  loading: boolean;
  onPrevious: (cursor?: T) => void;
  onNext: (cursor: T) => void;
  className?: string;
  nextCursor?: T;
}

const buttonClassName =
  'inline-flex-center gap-4px min-w-96px h-32px px-12px border-0 rounded-2px ' +
  'font-inherit text-[#fff] bg-[var(--theme-color-link)] cursor-pointer ' +
  'enabled:hover:bg-[var(--theme-color-link-hover)] disabled:cursor-not-allowed ' +
  'disabled:bg-[rgba(0,84,254,0.04)] disabled:text-[var(--theme-color-gray4)]';

export type CursorPaginationRef = { reset: () => void };

export function CursorPagination<T>({
  count,
  pageSize,
  loading,
  onPrevious,
  onNext,
  nextCursor,
  className,
}: SimplePaginationProps<T>) {
  const { t } = useTranslation();
  const [cursorHistory, setCursorHistory] = useState<T[]>([]);
  const canNext = !loading && count >= pageSize && nextCursor !== undefined;
  const canPrevious = !loading && cursorHistory.length > 0;
  return (
    <div className={clsx('inline-flex gap-8px', className)}>
      <button
        type="button"
        className={buttonClassName}
        disabled={!canPrevious}
        onClick={() => {
          if (!canPrevious) return;
          const [_, ...last] = cursorHistory;
          setCursorHistory(last);
          onPrevious(last[0]);
        }}
      >
        {loading ? (
          <span className="i-line-md:loading-loop mr-4px"></span>
        ) : (
          <ChevronLeft size={16} aria-hidden="true" />
        )}
        {t('general.pagination.previous')}
      </button>
      <button
        type="button"
        className={buttonClassName}
        disabled={!canNext}
        onClick={() => {
          if (!canNext) return;
          setCursorHistory(v => [nextCursor, ...v]);
          onNext(nextCursor);
        }}
      >
        {t('general.pagination.next')}
        {loading ? (
          <span className="i-line-md:loading-loop ml-4px"></span>
        ) : (
          <ChevronRight size={16} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
