import {
  Divider
} from "../../chunk-546TZBBU.js";

// src/components/Footer/index.tsx
import { memo } from "react";
import clsx from "clsx";
import { jsx, jsxs } from "react/jsx-runtime";
var Footer = memo(({ rightBottom, rightTop, left }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(
        "bg-[var(--theme-color-foot-bg)] w-100vw max-w-100% flex items-start p-2.2857rem box-border",
        "lt-sm:py-1.14rem lt-sm:px-0.93rem"
      ),
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-stretch grow-1 mx-auto max-w-1368px box-border", children: [
        /* @__PURE__ */ jsx("div", { className: "mr-2.93rem flex flex-col lt-md:hidden", children: left }, "left"),
        /* @__PURE__ */ jsxs("div", { className: "grow-2 lt-sm:p-0", children: [
          /* @__PURE__ */ jsx("div", { className: "lt-sm:px-0.21rem", children: rightTop }, "right-top"),
          /* @__PURE__ */ jsx(
            Divider,
            {
              className: clsx(
                "footer-bottom-divider",
                "bg-#d1d5ea! mt-1.07rem mb-0.57rem lt-sm:mt-0.79rem lt-sm:mb-0.29rem"
              )
            },
            "divider"
          ),
          /* @__PURE__ */ jsx("div", { className: "flex lt-sm:px-0.21rem", children: rightBottom }, "right-bottom")
        ] }, "right")
      ] })
    }
  );
});
export {
  Footer
};
//# sourceMappingURL=index.js.map