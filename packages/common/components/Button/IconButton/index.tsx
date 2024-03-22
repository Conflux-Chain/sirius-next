import { forwardRef } from "react";
import clsx from "clsx";
import { BaseButton, BaseButtonProps } from "../BaseButton";

export const IconButton = forwardRef<unknown, BaseButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseButton
        ref={ref}
        className={clsx(
          "min-w-2.2857rem h-2.2857rem rounded-0.2857rem px-0.4286rem text-#b1b3b9 bg-#0054fe0a hover:bg-#0054fe19",
          className
        )}
        {...props}
      />
    );
  }
);
