// src/components/Charts/StockTitle.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var Title = ({ header }) => {
  return /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs("div", { className: "text-[1rem] text-[#050505] font-medium leading-[1.8571rem] mb-[1.1429rem] mt-[2.2857rem] sm:text-[1.7143rem] sm:text-[#1a1a1a] sm:leading-[2.2857rem]", children: [
    header.title.text,
    /* @__PURE__ */ jsx("div", { className: "text-[1rem] text-[#74798c] leading-[1.2857rem] mt-[0.8571rem]", children: header.subtitle.text })
  ] }) });
};
var StockTitle_default = Title;

export {
  StockTitle_default
};
//# sourceMappingURL=chunk-PTT2OZV4.js.map