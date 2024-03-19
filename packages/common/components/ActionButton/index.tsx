import { forwardRef, ComponentProps } from "react";
import clsx from "clsx";

interface ButtonProps extends ComponentProps<"div"> {
  disabled?: boolean;
  loading?: boolean;
  onClick?: VoidFunction;
}

export const ActionButton = forwardRef<HTMLDivElement, ButtonProps>(
  ({ children, className, loading, disabled, onClick, ...props }, ref) => {
    const handleClick = () => {
      if (loading || disabled) return;
      onClick?.();
    };
    return (
      <div
        ref={ref}
        className={clsx(
          "min-w-2.2857rem h-2.2857rem rounded-0.2857rem px-0.4286rem flex-center text-#b1b3b9 font-normal bg-#0054fe0a cursor-pointer hover:bg-#0054fe19",
          disabled && "cursor-not-allowed",
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
