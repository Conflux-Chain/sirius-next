import clsx from 'clsx';
import { forwardRef, useMemo } from 'react';
import RowContext from './RowContext';

export type Gutter = number | undefined;
export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  gutter?: Gutter | [Gutter, Gutter];
  align?: 'top' | 'middle' | 'bottom' | 'stretch';
  justify?:
    | 'start'
    | 'end'
    | 'center'
    | 'space-around'
    | 'space-between'
    | 'space-evenly';
  prefixCls?: string;
  wrap?: boolean;
}

const Row = forwardRef<HTMLDivElement, RowProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    justify,
    align,
    className,
    style,
    children,
    gutter = 0,
    wrap = true,
    ...others
  } = props;

  const gutters = Array.isArray(gutter) ? gutter : [gutter, undefined];

  const rowStyle: React.CSSProperties = {};
  const horizontalGutter =
    gutters[0] != null && gutters[0] > 0 ? gutters[0] / -2 : undefined;

  if (horizontalGutter) {
    rowStyle.marginLeft = horizontalGutter;
    rowStyle.marginRight = horizontalGutter;
  }

  [, rowStyle.rowGap] = gutters;

  const [gutterH, gutterV] = gutters;
  const rowContext = useMemo(
    () => ({ gutter: [gutterH, gutterV] as [number, number], wrap }),
    [gutterH, gutterV, wrap],
  );

  return (
    <RowContext.Provider value={rowContext}>
      <div
        {...others}
        className={clsx(
          'sirius-row flex flex-row',
          {
            'flex-wrap': wrap,
            'justify-start': justify === 'start',
            'justify-end': justify === 'end',
            'justify-center': justify === 'center',
            'justify-around': justify === 'space-around',
            'justify-between': justify === 'space-between',
            'items-start': align === 'top',
            'items-center': align === 'middle',
            'items-end': align === 'bottom',
          },
          className,
        )}
        style={{ ...rowStyle, ...style }}
        ref={ref}
      >
        {children}
      </div>
    </RowContext.Provider>
  );
});

export default Row;
