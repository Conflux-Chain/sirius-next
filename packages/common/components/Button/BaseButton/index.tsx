import {
  forwardRef,
  ComponentProps,
  ForwardedRef,
  MouseEvent,
  MouseEventHandler,
} from "react";
import clsx from "clsx";

export interface BaseButtonProps extends ComponentProps<"div"> {
  disabled?: boolean;
  loading?: boolean;
}

export const BaseButton = forwardRef<unknown, BaseButtonProps>(
  ({ children, className, loading, disabled, onClick, ...props }, ref) => {
    const handleClick: MouseEventHandler<HTMLElement> = (e) => {
      if (loading || disabled) return;
      onClick?.(e as MouseEvent<HTMLDivElement>);
    };
    return (
      <div
        ref={ref as ForwardedRef<HTMLDivElement>}
        className={clsx(
          "flex-center cursor-pointer",
          disabled && "cursor-not-allowed",
          loading && "pointer-events-none",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);
