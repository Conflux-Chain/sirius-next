import React, {
  Children,
  isValidElement,
  cloneElement,
  HTMLAttributes,
  ComponentProps,
} from 'react';
import _Tooltip from '@cfx-kit/ui-components/dist/Tooltip';
import clsx from 'clsx';

interface Props
  extends Omit<
    ComponentProps<typeof _Tooltip>,
    'trigger' | 'containerClassName'
  > {
  title: React.ReactNode;
  children?: React.ReactNode;
  triggerProps?: HTMLAttributes<HTMLElement>;
}

export const Tooltip: React.FC<Props> = ({
  title,
  children = null,
  positioning = {},
  triggerProps: _triggerProps = {},
  ...rest
}) => {
  const { placement = 'top' } = positioning;
  return (
    <_Tooltip
      trigger={({ triggerProps }) => {
        if (Children.count(children) === 1 && isValidElement(children)) {
          delete triggerProps.onClick;
          return cloneElement(children, {
            ...triggerProps,
            ...(children.props as {}),
            ..._triggerProps,
          });
        } else {
          return (
            <span {...triggerProps} {..._triggerProps}>
              {children}
            </span>
          );
        }
      }}
      containerClassName={clsx(
        'sirius-next-tooltip',
        'lh-normal max-w-250px z-1000 w-max min-w-unset!',
        'all-[a]:text-[var(--theme-color-blue0)] all-[a:hover]:text-[var(--theme-color-blue2)]',
        '[&.ui-tooltip>[data-part=arrow]]:[--arrow-size:6px] [&.ui-tooltip>[data-part=arrow]]:[--arrow-background:#333]',
      )}
      openDelay={0}
      {...rest}
      positioning={{
        ...positioning,
        placement,
      }}
    >
      <div className="px-8px py-6px text-12px text-#fff text-left shadow break-words ws-normal bg-#333 min-w-30px min-h-32px decoration-none rounded-2px">
        {title}
      </div>
    </_Tooltip>
  );
};
