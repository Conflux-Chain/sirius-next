import {
  forwardRef,
  ComponentProps,
  ForwardedRef,
  MouseEvent,
  MouseEventHandler,
} from 'react';
import clsx from 'clsx';

export interface BaseButtonProps {
  htmlType?: ComponentProps<'button'>['type'];
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  style?: React.CSSProperties;
}

export const BaseButton = forwardRef<unknown, BaseButtonProps>(
  (
    { children, className, loading, disabled, onClick, htmlType, ...props },
    ref,
  ) => {
    const handleClick: MouseEventHandler<HTMLElement> = e => {
      if (loading || disabled) return;
      onClick?.(e as MouseEvent<HTMLButtonElement>);
    };
    return (
      <button
        ref={ref as ForwardedRef<HTMLButtonElement>}
        type={htmlType}
        className={clsx(
          'sirius-btn inline-flex justify-center items-center cursor-pointer border-none',
          disabled && 'cursor-not-allowed',
          loading && 'pointer-events-none',
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  },
);
