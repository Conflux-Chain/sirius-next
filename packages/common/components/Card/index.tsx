import clsx from "clsx";
import { FC, ComponentProps } from "react";
import { Spin } from "../Spin";

interface CardProps extends ComponentProps<"div"> {
  loading?: boolean;
}

export const Card: FC<CardProps> = ({
  children,
  className,
  loading = false,
  ...rest
}) => {
  return (
    <Spin spinning={loading}>
      <div
        className={clsx(
          "card sirius-card",
          "px-1.2857rem py-0 m-0 bg-#fff w-full rounded-4px transition-all-200 box-border text-#333 border-2px border-solid border-transparent shadow-card",
          className
        )}
        {...rest}
      >
        <div
          className={clsx(
            "content",
            "[&>:first-child]:mt-0! [&>:last-child]:mb-0!",
            "w-full p-0"
          )}
        >
          {children}
        </div>
      </div>
    </Spin>
  );
};
