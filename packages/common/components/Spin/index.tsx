import clsx from "clsx";
import { FC, ComponentProps } from "react";

interface SpinProps extends ComponentProps<"div"> {
  size?: "default" | "small";
  spinning?: boolean;
}

export const Spin: FC<SpinProps> = ({
  children,
  spinning = true,
  size = "default",
  ...rest
}) => {
  const fontSize = size === "small" ? "text-20px" : "text-40px";
  if (!children) {
    return (
      <div
        className="opacity-100 inline-block static text-center align-middle"
        {...rest}
      >
        {spinning && (
          <div
            className={clsx(
              "relative w-1em h-1em flex-center text-[var(--theme-color-primary)]",
              fontSize
            )}
          >
            <span className="i-line-md:loading-loop"></span>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="relative" {...rest}>
      {spinning && (
        <div
          className={clsx(
            "absolute top-0 left-0 z-4 w-full h-full opacity-100 flex-center text-[var(--theme-color-primary)]",
            fontSize
          )}
        >
          <span className="i-line-md:loading-loop"></span>
        </div>
      )}
      <div
        className={clsx(
          "relative transition-opacity-300",
          spinning &&
            "clear-both overflow-hidden opacity-50 pointer-events-none select-none"
        )}
      >
        {children}
      </div>
    </div>
  );
};
