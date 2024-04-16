import { forwardRef } from 'react';
import clsx from 'clsx';
import { BaseButton, BaseButtonProps } from '../BaseButton';

interface ButtonProps extends BaseButtonProps {
  color?: 'default' | 'primary';
  size?: 'default' | 'small';
}

export const ActionButton = forwardRef<unknown, ButtonProps>(
  (
    {
      className,
      color = 'default',
      size = 'default',
      disabled,
      loading,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <BaseButton
        ref={ref}
        className={clsx(
          'relative lh-[1.5715] ws-nowrap transition-all-300 select-none min-w-124px rounded-2px text-center font-normal',
          {
            'bg-[var(--theme-color-gray3)] text-[var(--theme-color-gray2)] hover:bg-[var(--theme-color-gray0)] hover-text-[var(--theme-color-gray2)]':
              disabled,
            'hover:bg-[var(--theme-color-button-bg)] hover:text-#fff':
              !disabled,
            'text-#424A71 bg-#0054fe0a': !disabled && color === 'default',
            'text-#fff bg-[var(--theme-color-primary-button-bg)]':
              !disabled && color === 'primary',
            'p-x-15px p-y-4px h-32px': size === 'default',
            'p-x-7px h-24px': size === 'small',
          },
          className,
        )}
        disabled={disabled}
        loading={loading}
        {...props}
      >
        {loading && <span className="i-line-md:loading-loop mr-4px"></span>}
        {children}
      </BaseButton>
    );
  },
);
