import {
  Link
} from "./chunk-EXW5F6NL.js";
import {
  useI18n
} from "./chunk-W4ZISPJS.js";

// src/components/Charts/PreviewTitle.tsx
import { useTranslation } from "react-i18next";
import { jsx, jsxs } from "react/jsx-runtime";
var Title = ({ header }) => {
  const { t } = useTranslation();
  const { translations } = useI18n();
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between pt-4 pr-5 pb-0 pl-5", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-[16px] text-[#26244B] ", children: header.title.text }),
      /* @__PURE__ */ jsx("div", { className: "text-[14px] text-[#74798C]", children: header.subtitle.text })
    ] }),
    /* @__PURE__ */ jsx(Link, { className: "shrink-0", href: header?.breadcrumb?.[1]?.path || "/", children: t(translations.highcharts.preview.viewDetail) })
  ] });
};
var PreviewTitle_default = Title;

export {
  PreviewTitle_default
};
//# sourceMappingURL=chunk-OVQQRURX.js.map