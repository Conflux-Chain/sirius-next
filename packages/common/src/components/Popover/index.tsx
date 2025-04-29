import React, { HTMLAttributes, ComponentProps, useRef } from 'react';
import _Popover from '@cfx-kit/ui-components/dist/Popover';
import clsx from 'clsx';
import { cn } from 'src/utils';

export interface PopoverProps
  extends Omit<ComponentProps<typeof _Popover>, 'trigger'> {
  containerClassName?: string;
  content?: React.ReactNode;
  children?: React.ReactNode;
  triggerProps?: HTMLAttributes<HTMLElement>;
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  content,
  children = null,
  positioning = {},
  className,
  containerClassName,
  arrow = true,
  ...rest
}) => {
  const { placement = 'top' } = positioning;
  const triggerRef = useRef<HTMLSpanElement>(null);
  return (
    <_Popover
      trigger={({ triggerProps }) => {
        return (
          <span
            ref={triggerRef}
            {...(content ? triggerProps : {})}
            className={cn(
              'sirius-popover-trigger',
              className,
              triggerProps.className,
            )}
          >
            {children}
          </span>
        );
      }}
      containerClassName={clsx(
        'sirius-popover-container',
        'text-#333 text-14px lh-[1.5715] font-400 ws-normal cursor-auto text-left select-text absolute top-0 left-0 z-1030 text-transform-none filter-drop-shadow',
        '[&>[data-part=arrow]]:[--arrow-size:12px] [&>[data-part=arrow]]:[--arrow-background:#fff] [&>[data-part=arrow]]:[--arrow-shadow-color:gray]',
        containerClassName,
      )}
      {...rest}
      positioning={{
        ...positioning,
        placement,
      }}
      arrow={arrow}
    >
      {({ contentProps }) => {
        return (
          <div
            className="sirius-popover-content px-12px py-16px shadow decoration-none rounded-5px bg-#fff bg-clip-padding"
            {...contentProps}
          >
            {content}
          </div>
        );
      }}
    </_Popover>
  );
};
