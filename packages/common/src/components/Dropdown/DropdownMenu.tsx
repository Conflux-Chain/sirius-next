import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import React, { ComponentProps } from 'react';

export const DropdownMenu: React.FC<{
  children: React.ReactNode;
  overlay: React.ReactNode;
  className?: string;
}> = ({ children, overlay, className }) => {
  return (
    <DropdownMenuPrimitive.Root modal={false}>
      <DropdownMenuPrimitive.Trigger asChild className={className}>
        {children}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>{overlay}</DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};

export const MenuItem: React.FC<
  ComponentProps<typeof DropdownMenuPrimitive.Item>
> = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={clsx(
      'sirius-dropdown-menu-item',
      'data-[highlighted]:outline-0 hover-bg-#f5f5f5',
      'all-[a::after]:content-[""] all-[a::after]:absolute all-[a::after]:inset-0',
      'relative flex-vertical-center px-12px py-5px text-#333 font-400 lh-22px ws-nowrap cursor-pointer transition-all duration-300',
      className,
    )}
    {...props}
  />
));

export const MenuContainer: React.FC<
  ComponentProps<typeof DropdownMenuPrimitive.Content>
> = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Content
    ref={ref}
    sideOffset={5}
    className={clsx(
      'sirius-dropdown-menu-group',
      'z-900 py-4px text-left bg-#fff bg-clip-padding rounded-2px outline-0 shadow-[0_3px_6px_-4px_rgba(0,0,0,.12),0_6px_16px_0_rgba(0,0,0,.08),0_9px_28px_8px_rgba(0,0,0,.05)]',
      className,
    )}
    {...props}
  />
));
