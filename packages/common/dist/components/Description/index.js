// src/components/Description/index.tsx
import clsx from "clsx";
import { jsx, jsxs } from "react/jsx-runtime";
var Description = ({
  title,
  style,
  className,
  children,
  noBorder,
  vertical = false,
  size = "medium",
  ...others
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style,
      className: clsx(
        "description",
        "flex min-h-3.2857rem lh-3.2857rem lt-sm:flex-col",
        !noBorder && "border-b-(1px solid #e8e9ea)",
        vertical && "flex-col",
        className,
        size
      ),
      ...others,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: clsx(
              "left",
              "px-0 lh-1.5714rem min-w-160px max-w-260px text-#74798c flex-shrink-0",
              size === "tiny" ? "py-0.5rem" : "py-0.8571rem",
              size === "small" ? "w-10rem " : vertical ? "w-full" : "w-25%"
            ),
            children: title
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: clsx(
              "right",
              "py-0.8571rem px-0 lh-1.5714rem text-#282d30 flex-grow-1 lt-sm:pt-0",
              size === "tiny" ? "py-0.5rem" : "py-0.8571rem",
              vertical && "pt-0"
            ),
            children
          }
        )
      ]
    }
  );
};
export {
  Description
};
//# sourceMappingURL=index.js.map