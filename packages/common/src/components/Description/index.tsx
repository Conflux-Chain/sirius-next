import React from 'react';
import clsx from 'clsx';

interface Props {
  title: React.ReactNode;
  children: React.ReactNode;
  noBorder?: boolean;
  vertical?: boolean;
  size?: 'medium' | 'small' | 'tiny';
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export type DescriptionProps = Props & NativeAttrs;

export const Description = ({
  title,
  style,
  className,
  children,
  noBorder,
  vertical = false,
  size = 'medium',
  ...others
}: DescriptionProps) => {
  return (
    <div
      style={style}
      className={clsx(
        'description',
        'flex min-h-3.2857rem lh-3.2857rem lt-sm:flex-col',
        !noBorder && 'border-b-1px border-b-solid border-b-#e8e9ea',
        vertical && 'flex-col',
        className,
        size,
      )}
      {...others}
    >
      <div
        className={clsx(
          'left',
          'px-0 lh-1.5714rem min-w-160px max-w-260px text-#74798c flex-shrink-0',
          size === 'tiny' ? 'py-0.5rem' : 'py-0.8571rem',
          size === 'small' ? 'w-10rem ' : vertical ? 'w-full' : 'w-25%',
        )}
      >
        {title}
      </div>
      <div
        className={clsx(
          'right',
          'py-0.8571rem px-0 lh-1.5714rem text-#282d30 flex-grow-1 lt-sm:pt-0',
          size === 'tiny' ? 'py-0.5rem' : 'py-0.8571rem',
          vertical && 'pt-0',
        )}
      >
        {children}
      </div>
    </div>
  );
};
