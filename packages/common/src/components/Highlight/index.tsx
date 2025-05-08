import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { useHighlightStore } from 'src/store';

export const ValueHighlight: React.FC<
  {
    value?: unknown;
    scope: string;
  } & React.HTMLAttributes<HTMLDivElement>
> = ({ value, scope, children, className, ...props }) => {
  const { highlight, setHighlight } = useHighlightStore();
  const isHighlight = useMemo(
    () => value && highlight.scope === scope && highlight.value === value,
    [value, scope, highlight.value, highlight.scope],
  );
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isHighlight) return;
      const data = (e.target as any).dataset;
      if (!value || data?.scope === 'tooltip') return;
      setHighlight(scope, value);
    },
    [scope, value, isHighlight, setHighlight],
  );
  const handleMouseLeave = useCallback(() => {
    if (!value) return;
    setHighlight();
  }, [value, setHighlight]);
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseOver={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        'border-1px border-dashed w-fit px-12px rounded-12px',
        isHighlight
          ? 'border-[var(--theme-color-primary)] bg-[var(--theme-color-highlight-bg)]'
          : 'border-transparent',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
