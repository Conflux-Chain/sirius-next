// src/components/Spin/index.tsx
import clsx from "clsx";
import { jsx, jsxs } from "react/jsx-runtime";
var Spin = ({
  children,
  spinning = true,
  size = "default",
  ...rest
}) => {
  const fontSize = size === "small" ? "text-20px" : "text-40px";
  if (!children) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: "opacity-100 inline-block static text-center align-middle",
        ...rest,
        children: spinning && /* @__PURE__ */ jsx(
          "div",
          {
            className: clsx(
              "relative w-1em h-1em flex-center text-[var(--theme-color-primary)]",
              fontSize
            ),
            children: /* @__PURE__ */ jsx("span", { className: "i-line-md:loading-loop" })
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative", ...rest, children: [
    spinning && /* @__PURE__ */ jsx(
      "div",
      {
        className: clsx(
          "absolute top-0 left-0 z-4 w-full h-full opacity-100 flex-center text-[var(--theme-color-primary)]",
          fontSize
        ),
        children: /* @__PURE__ */ jsx("span", { className: "i-line-md:loading-loop" })
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: clsx(
          "relative transition-opacity-300",
          spinning && "clear-both overflow-hidden opacity-50 pointer-events-none select-none"
        ),
        children
      }
    )
  ] });
};

export {
  Spin
};
//# sourceMappingURL=chunk-XCKMXAL2.js.map