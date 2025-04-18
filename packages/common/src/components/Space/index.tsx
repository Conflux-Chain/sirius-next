import clsx from 'clsx';
import { FC } from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | 'small' | 'middle' | 'large';
  direction?: 'horizontal' | 'vertical';
  align?: 'start' | 'end' | 'center' | 'baseline';
  wrap?: boolean;
}

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24,
};

export const Space: FC<Props> = ({
  className,
  direction = 'horizontal',
  align = 'center',
  wrap = false,
  size: _size = 'small',
  children,
  style,
  ...props
}) => {
  const size = typeof _size === 'number' ? _size : spaceSize[_size];
  return (
    <div
      className={clsx(
        'sirius-space',
        'inline-flex',
        {
          'items-center': align === 'center',
          'items-end': align === 'end',
          'items-start': align === 'start',
          'items-baseline': align === 'baseline',
          'flex-row': direction === 'horizontal',
          'flex-col': direction === 'vertical',
          'flex-wrap': wrap,
        },
        className,
      )}
      style={{
        gap: size,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
