import {
  scope
} from "./chunk-P5STBOCR.js";
import {
  useI18n
} from "./chunk-W4ZISPJS.js";

// src/components/Charts/ChartOptions.tsx
import { useTranslation } from "react-i18next";
import { jsx, jsxs } from "react/jsx-runtime";
var ChartOptions = ({
  intervalScope,
  intervalType,
  limit,
  onCombination
}) => {
  const { t } = useTranslation();
  const { translations } = useI18n();
  const intervalScopeDefault = intervalScope || { day: scope.day };
  return /* @__PURE__ */ jsxs("div", { className: "flex relative z-2 top-[10px] mb-[20px] left-[40px] gap-[10px] flex-col chartsFilter:flex-row chartsFilter:gap-0", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-[3px] mr-[20px]", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        t(translations.highcharts.options.time),
        ":"
      ] }),
      Object.keys(intervalScopeDefault).map((e, i) => {
        const scopeItemArray = intervalScopeDefault[e];
        const lastScopeItem = scopeItemArray?.[scopeItemArray.length - 1];
        const lastItemLimit = lastScopeItem?.limit;
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: `${intervalType === e ? "bg-[#E6EBF5]" : "bg-[#F7F7F7]"} w-fit px-[7px] py-[2px] rounded-[5px] text-[12px] cursor-pointer hover:bg-[#eee]`,
            onClick: () => onCombination(e, lastItemLimit + ""),
            children: e
          },
          "scopeKey" + i
        );
      })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-[3px]", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        t(translations.highcharts.options.range),
        ":"
      ] }),
      intervalScopeDefault[intervalType]?.map(
        (e, i) => /* @__PURE__ */ jsx(
          "div",
          {
            onClick: () => onCombination(intervalType, e.limit + ""),
            className: `${limit === e.limit + "" ? "bg-[#E6EBF5]" : "bg-[#F7F7F7]"} w-fit px-[7px] py-[2px] rounded-[5px] text-[12px] cursor-pointer hover:bg-[#eee]`,
            children: e.label
          },
          "scopeLimit" + i
        )
      )
    ] })
  ] });
};
var ChartOptions_default = ChartOptions;

export {
  ChartOptions_default
};
//# sourceMappingURL=chunk-PBOTSFAO.js.map