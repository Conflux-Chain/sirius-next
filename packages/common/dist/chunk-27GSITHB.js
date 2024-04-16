import {
  BaseButton
} from "./chunk-3GGF3ULC.js";

// src/components/Button/IconButton/index.tsx
import { forwardRef } from "react";
import clsx from "clsx";
import { jsx } from "react/jsx-runtime";
var IconButton = forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      BaseButton,
      {
        ref,
        className: clsx(
          "min-w-2.2857rem h-2.2857rem rounded-0.2857rem px-0.4286rem text-#b1b3b9 bg-#0054fe0a hover:bg-#0054fe19",
          className
        ),
        ...props
      }
    );
  }
);

export {
  IconButton
};
//# sourceMappingURL=chunk-27GSITHB.js.map