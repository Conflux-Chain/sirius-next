// src/components/Button/BaseButton/index.tsx
import {
  forwardRef
} from "react";
import clsx from "clsx";
import { jsx } from "react/jsx-runtime";
var BaseButton = forwardRef(
  ({ children, className, loading, disabled, onClick, ...props }, ref) => {
    const handleClick = (e) => {
      if (loading || disabled)
        return;
      onClick?.(e);
    };
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: clsx(
          "flex-center cursor-pointer",
          disabled && "cursor-not-allowed",
          loading && "pointer-events-none",
          className
        ),
        onClick: handleClick,
        ...props,
        children
      }
    );
  }
);

export {
  BaseButton
};
//# sourceMappingURL=chunk-3GGF3ULC.js.map