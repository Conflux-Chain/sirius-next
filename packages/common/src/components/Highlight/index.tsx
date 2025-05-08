import clsx from 'clsx';
import { useHighlightStore } from 'src/store';

export const ValueHighlight: React.FC<{
  value?: unknown;
  scope: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ value, scope, children, className, style }) => {
  const { highlight, setHighlight } = useHighlightStore();
  const isHighlight =
    value && highlight.scope === scope && highlight.value === value;
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const data = (e.target as any).dataset;
    if (!value || data?.scope === 'tooltip') return;
    setHighlight(scope, value);
  };
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseOver={handleMouseEnter}
      onMouseLeave={() => {
        if (!value) return;
        setHighlight();
      }}
      className={clsx(
        'border-1px border-dashed w-fit px-12px rounded-12px',
        isHighlight
          ? 'border-[var(--theme-color-primary)] bg-[var(--theme-color-highlight-bg)]'
          : 'border-transparent',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
};
