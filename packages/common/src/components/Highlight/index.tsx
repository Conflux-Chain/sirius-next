import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useHighlightStore } from 'src/store';

export const ValueHighlight: React.FC<
  {
    value?: unknown;
    scope: string;
  } & React.HTMLAttributes<HTMLDivElement>
> = ({ value, scope, children, className, ...props }) => {
  const eventRef = useRef(false);
  const { highlight, setHighlight } = useHighlightStore();
  const isHighlight = useMemo(
    () => value && highlight.scope === scope && highlight.value === value,
    [value, scope, highlight.value, highlight.scope],
  );
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isHighlight) return;
      eventRef.current = true;
      const data = (e.target as any).dataset;
      if (!value || data?.scope === 'tooltip') return;
      setHighlight(scope, value);
    },
    [scope, value, isHighlight, setHighlight],
  );
  const handleMouseLeave = useCallback(() => {
    eventRef.current = false;
    if (!value) return;
    setHighlight();
  }, [value, setHighlight]);
  useEffect(() => {
    return () => {
      if (eventRef.current) {
        setHighlight();
      }
    };
  }, [setHighlight]);
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseOver={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        'border-1px border-dashed w-fit px-10px rounded-12px',
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
