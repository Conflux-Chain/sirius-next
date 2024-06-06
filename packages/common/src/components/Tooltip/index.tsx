import React, {
  Children,
  isValidElement,
  cloneElement,
  HTMLAttributes,
  ComponentProps,
  useRef,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react';
import _Tooltip from '@cfx-kit/ui-components/dist/Tooltip';
import clsx from 'clsx';

export interface TooltipProps
  extends Omit<
    ComponentProps<typeof _Tooltip>,
    'trigger' | 'containerClassName'
  > {
  title: React.ReactNode;
  children?: React.ReactNode;
  triggerProps?: HTMLAttributes<HTMLElement>;
}

export const Tooltip: React.FC<TooltipProps> = ({
  title,
  children = null,
  positioning = {},
  open: _open,
  ...rest
}) => {
  const { placement = 'top' } = positioning;
  const [open, setOpen] = useState(!!_open);
  const onCloseRef = useRef<MouseEventHandler<HTMLElement>>();
  useEffect(() => {
    const callback = (e: MouseEvent) => {
      onCloseRef.current?.(
        e as unknown as React.MouseEvent<HTMLElement, MouseEvent>,
      );
    };
    if (open) {
      document.addEventListener('click', callback);
    }
    return () => document.removeEventListener('click', callback);
  }, [open]);
  return (
    <_Tooltip
      trigger={({ triggerProps }) => {
        // save onClick to hide tooltip while click outside
        onCloseRef.current = triggerProps.onClick;
        // override onClick with onPointerMove to prevent hide tooltip when click trigger and show tooltip in mobile
        triggerProps.onClick = e => {
          triggerProps.onPointerMove?.(e as React.PointerEvent<HTMLElement>);
          e.stopPropagation();
        };
        if (Children.count(children) === 1 && isValidElement(children)) {
          return cloneElement(children, {
            ...triggerProps,
            ...(children.props as {}),
          });
        } else {
          return <span {...triggerProps}>{children}</span>;
        }
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
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <div
        className="px-8px py-6px text-12px text-#fff text-left shadow break-words ws-normal bg-#333 min-w-30px min-h-32px decoration-none rounded-2px"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {title}
      </div>
    </_Tooltip>
  );
};
