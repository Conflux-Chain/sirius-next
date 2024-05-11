import clsx from 'clsx';
import React from 'react';

type SkeletonVariants = 'text' | 'circle' | 'rect';
type SkeletonAnimations = 'none' | 'pulse' | 'wave';

interface SkeletonBaseProps {
  animation?: SkeletonAnimations;
  width?: string;
  height?: string;
  variant?: SkeletonVariants;
  style?: React.CSSProperties;
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof SkeletonBaseProps>;
export type SkeletonProps = React.PropsWithChildren<
  SkeletonBaseProps & NativeAttrs
>;

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  children,
  animation = 'wave',
  variant = 'text',
  width = '',
  height = '',
  style = {},
  ...others
}) => {
  const hasChildren = Boolean(children);

  return (
    <div
      className={clsx(
        className,
        'block bg-#EFF2FA h-1.5714rem preserve-3d',
        'after:border-l-1px after:border-l-solid after:border-l-#EFF2FA',
        variant === 'text' && 'my-0 rounded-0.2857rem',
        variant === 'circle' && 'rounded-50%',
        animation === 'pulse' &&
          '-keyframes-pulse animate-name-pulse animate-ease-in-out animate-delay-0.5s animate-duration-1.5s animate-count-infinite',
        animation === 'wave' &&
          '-keyframes-wave relative overflow-hidden after:content-[""] after:bg-gradient-linear-[(90deg,#EFF2FA,#E1E5EE,#EFF2FA)] after:absolute after:animate-name-wave after:animate-ease-linear after:animate-count-infinite after:animate-delay-0.5s after:animate-duration-1.6s after:transform-translate-x--100% after:top-0 after:bottom-0 after:left-0 after:right-0',
        hasChildren && '[&>*]:invisible',
        hasChildren && !width && 'max-w-fit',
        hasChildren && !height && 'h-auto',
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...others}
    >
      <div>{children}</div>
    </div>
  );
};
