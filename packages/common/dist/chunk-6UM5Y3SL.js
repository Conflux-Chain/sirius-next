import {
  BaseButton
} from "./chunk-3GGF3ULC.js";

// src/components/Button/ActionButton/index.tsx
import { forwardRef } from "react";
import clsx from "clsx";
import { jsx, jsxs } from "react/jsx-runtime";
var ActionButton = forwardRef(
  ({
    className,
    color = "default",
    size = "default",
    disabled,
    loading,
    children,
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsxs(
      BaseButton,
      {
        ref,
        className: clsx(
          "relative lh-[1.5715] ws-nowrap transition-all-300 select-none min-w-124px rounded-2px text-center font-normal",
          {
            "bg-[var(--theme-color-gray3)] text-[var(--theme-color-gray2)] hover:bg-[var(--theme-color-gray0)] hover-text-[var(--theme-color-gray2)]": disabled,
            "hover:bg-[var(--theme-color-button-bg)] hover:text-#fff": !disabled,
            "text-#424A71 bg-#0054fe0a": !disabled && color === "default",
            "text-#fff bg-[var(--theme-color-primary-button-bg)]": !disabled && color === "primary",
            "p-x-15px p-y-4px h-32px": size === "default",
            "p-x-7px h-24px": size === "small"
          },
          className
        ),
        disabled,
        loading,
        ...props,
        children: [
          loading && /* @__PURE__ */ jsx("span", { className: "i-line-md:loading-loop mr-4px" }),
          children
        ]
      }
    );
  }
);

export {
  ActionButton
};
//# sourceMappingURL=chunk-6UM5Y3SL.js.map