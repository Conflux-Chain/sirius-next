import React, {
  HTMLAttributes,
  ComponentProps,
  useRef,
  MouseEventHandler,
} from 'react';
import _Tooltip from '@cfx-kit/ui-components/dist/Tooltip';
import clsx from 'clsx';
import { useClickAway } from '@cfx-kit/react-utils/dist/hooks';
import { cn } from 'src/utils';

export interface TooltipProps
  extends Omit<
    ComponentProps<typeof _Tooltip>,
    'trigger' | 'containerClassName'
  > {
  title?: React.ReactNode;
  children?: React.ReactNode;
  triggerProps?: HTMLAttributes<HTMLElement>;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  title,
  children = null,
  positioning = {},
  className,
  ...rest
}) => {
  const { placement = 'top' } = positioning;
  const onCloseRef = useRef<MouseEventHandler<HTMLElement>>();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const triggerContentRef = useRef<HTMLElement | null>(null);
  useClickAway([triggerRef, triggerContentRef], e => {
    onCloseRef.current?.(
      e as unknown as React.MouseEvent<HTMLElement, MouseEvent>,
    );
  });
  return (
    <_Tooltip
      trigger={({ triggerProps }) => {
        // save onClick to hide tooltip while click outside
        onCloseRef.current = triggerProps.onClick;
        // override onClick with onPointerMove to prevent hide tooltip when click trigger and show tooltip in mobile
        triggerProps.onClick = e => {
          triggerProps.onPointerMove?.(e as React.PointerEvent<HTMLElement>);
        };
        return (
          <span
            ref={triggerRef}
            {...(title ? triggerProps : {})}
            className={cn(className, triggerProps.className)}
          >
            {children}
          </span>
        );
      }}
      containerClassName={clsx(
        'sirius-next-tooltip',
        'lh-normal max-w-250px z-1000 w-max min-w-unset!',
        'all-[a]:text-[var(--theme-color-blue0)] all-[a:hover]:text-[var(--theme-color-blue2)]',
        '[&.ui-tooltip>[data-part=arrow]]:[--arrow-size:6px] [&.ui-tooltip>[data-part=arrow]]:[--arrow-background:#333]',
      )}
      openDelay={0}
      closeOnPointerDown={false}
      {...rest}
      positioning={{
        ...positioning,
        placement,
      }}
    >
      {({ contentProps }) => {
        const _onPointerLeave = contentProps.onPointerLeave;
        contentProps.onPointerLeave = e => {
          if (e.pointerType === 'touch') return;
          _onPointerLeave?.(e);
        };
        return (
          <div
            className="px-8px py-6px text-12px text-#fff text-left shadow break-words ws-normal bg-#333 min-w-30px min-h-32px decoration-none rounded-2px"
            ref={_ref =>
              _ref
                ? (triggerContentRef.current = _ref.parentElement)
                : (triggerContentRef.current = null)
            }
            {...contentProps}
          >
            {title}
          </div>
        );
      }}
    </_Tooltip>
  );
};
