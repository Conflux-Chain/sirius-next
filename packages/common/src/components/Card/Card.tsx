import clsx from 'clsx';
import { FC, ComponentProps } from 'react';
import { Spin } from '../Spin';

interface CardProps extends ComponentProps<'div'> {
  bordered?: boolean;
  loading?: boolean;
  contentClassName?: string;
}

export const Card: FC<CardProps> = ({
  children,
  className,
  contentClassName,
  loading = false,
  bordered = true,
  ...rest
}) => {
  return (
    <Spin spinning={loading}>
      <div
        className={clsx(
          'sirius-card',
          'relative p-0 m-0 bg-#fff rounded-2px text-#333 text-14px list-none',
          bordered && 'border-#f0f0f0 border-1px border-solid',
          className,
        )}
        {...rest}
      >
        <div className={clsx('sirius-card-body', 'p-24px', contentClassName)}>
          {children}
        </div>
      </div>
    </Spin>
  );
};
