import { useMemo, useContext, forwardRef } from 'react';
import RowContext from './RowContext';
import { useWindowSize } from '../../utils/media';
import { getPercent } from 'src/utils';
import clsx from 'clsx';

type ColSpanType = number | string;

type FlexType = number | 'none' | 'auto' | string;

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  flex?: FlexType;
  span?: ColSpanType;
  xs?: ColSpanType;
  sm?: ColSpanType;
  md?: ColSpanType;
  /** 992 */
  lg?: ColSpanType;
  /** 1025, for media.m */
  lg2?: ColSpanType;
  xl?: ColSpanType;
  xxl?: ColSpanType;
  prefixCls?: string;
}

function parseFlex(flex: FlexType): string {
  if (typeof flex === 'number') {
    return `${flex} ${flex} auto`;
  }

  if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
    return `0 0 ${flex}`;
  }

  return flex;
}
const sizes = ['xs', 'sm', 'md', 'lg', 'lg2', 'xl', 'xxl'] as const;
const sizeMap: Record<(typeof sizes)[number], number> = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  lg2: 1025,
  xl: 1200,
  xxl: 1600,
};

const Col = forwardRef<HTMLDivElement, ColProps>((props, ref) => {
  const { gutter, wrap } = useContext(RowContext);
  const windowSize = useWindowSize();

  const {
    span,
    className,
    children,
    flex,
    style,
    xs,
    sm,
    md,
    lg,
    lg2,
    xl,
    xxl,
    ...others
  } = props;

  const sizeStyle = useMemo(() => {
    let defaultPercent = span && getPercent(span, 24, 8);
    let sizeStyleObj = {
      flex: defaultPercent && `0 0 ${defaultPercent}`,
      maxWidth: defaultPercent,
    };
    sizes.forEach(size => {
      const propSize = props[size];
      if (!propSize) {
        return;
      }
      const sizeWidth = sizeMap[size];
      if (windowSize < sizeWidth) {
        return;
      }
      const percent = getPercent(propSize, 24, 8);
      sizeStyleObj = {
        flex: `0 0 ${percent}`,
        maxWidth: percent,
      };
    });
    return sizeStyleObj;
  }, [span, windowSize, xs, sm, md, lg, lg2, xl, xxl]);

  const mergedStyle: React.CSSProperties = {};
  // Horizontal gutter use padding
  if (gutter && gutter[0] > 0) {
    const horizontalGutter = gutter[0] / 2;
    mergedStyle.paddingLeft = horizontalGutter;
    mergedStyle.paddingRight = horizontalGutter;
  }

  if (flex) {
    mergedStyle.flex = parseFlex(flex);

    if (wrap === false && !mergedStyle.minWidth) {
      mergedStyle.minWidth = 0;
    }
  }

  return (
    <div
      {...others}
      style={{ ...sizeStyle, ...mergedStyle, ...style }}
      className={clsx('sirius-col relative max-w-full min-h-1px', className)}
      ref={ref}
    >
      {children}
    </div>
  );
});

export default Col;
