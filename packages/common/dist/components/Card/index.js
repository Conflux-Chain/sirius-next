import {
  Spin
} from "../../chunk-XCKMXAL2.js";

// src/components/Card/index.tsx
import clsx from "clsx";
import { jsx } from "react/jsx-runtime";
var Card = ({
  children,
  className,
  loading = false,
  ...rest
}) => {
  return /* @__PURE__ */ jsx(Spin, { spinning: loading, children: /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(
        "card sirius-card",
        "px-1.2857rem py-0 m-0 bg-#fff w-full rounded-4px transition-all-200 box-border text-#333 border-2px border-solid border-transparent shadow-card",
        className
      ),
      ...rest,
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: clsx(
            "content",
            "[&>:first-child]:mt-0! [&>:last-child]:mb-0!",
            "w-full p-0"
          ),
          children
        }
      )
    }
  ) });
};
export {
  Card
};
//# sourceMappingURL=index.js.map