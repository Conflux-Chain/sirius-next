import {
  Tooltip
} from "../../chunk-UBCDOZDY.js";
import {
  abbreviateString
} from "../../chunk-57ZOD4EO.js";
import "../../chunk-PIWYBVLY.js";
import "../../chunk-NENWU3JC.js";
import "../../chunk-4LQWWDGW.js";
import "../../chunk-ADTPJ4V5.js";

// src/components/AddressContainer/index.tsx
import { memo } from "react";
import { withTranslation } from "react-i18next";
import { Translation } from "react-i18next";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var defaultPCMaxWidth = 138;
var RenderAddress = ({
  translations,
  cfxAddress,
  alias,
  hoverValue,
  hrefAddress,
  content,
  link = "",
  isFull = false,
  isFullNameTag = false,
  style = {},
  maxWidth,
  prefix = null,
  suffix = null,
  type = "pow",
  addressLabel = "",
  ENSLabel = "",
  nametag = ""
}) => {
  let href;
  const string = content || ENSLabel || nametag || addressLabel || alias || cfxAddress;
  const calculatedMaxWidth = (content || ENSLabel || nametag || addressLabel || alias) && isFullNameTag ? 1e3 : isFull ? 430 : maxWidth || (alias ? 160 : defaultPCMaxWidth);
  if (link) {
    if (typeof link === "string") {
      href = link;
    } else {
      href = `/${type === "pow" ? "address" : "pos/accounts"}/${hrefAddress || cfxAddress}`;
    }
  }
  const baseClassName = `relative inline-flex flex-nowrap align-bottom cursor-default whitespace-nowrap overflow-hidden`;
  const Wrapper = href ? "a" : "div";
  const tooltipContent = {
    ENSLabel: {
      label: translations?.ens?.tip,
      value: ENSLabel
    },
    nametag: {
      label: translations?.nametag?.tip,
      value: nametag
    },
    addressLabel: {
      label: translations?.profile.address.myNameTag,
      value: addressLabel
    },
    alias: {
      label: translations?.profile.address.publicNameTag,
      value: alias
    }
  };
  const renderTooltipContent = () => {
    return Object.entries(tooltipContent).map(([key, { label, value }]) => {
      if (value) {
        return /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(Translation, { children: (t) => t(label) }) }),
          value
        ] }, key);
      }
      return null;
    }).filter(Boolean);
  };
  return /* @__PURE__ */ jsxs("div", { className: "inline", children: [
    prefix,
    /* @__PURE__ */ jsx(Tooltip, { title: /* @__PURE__ */ jsxs(Fragment, { children: [
      renderTooltipContent(),
      /* @__PURE__ */ jsx("div", { children: hoverValue || cfxAddress })
    ] }), children: /* @__PURE__ */ jsx(
      Wrapper,
      {
        className: baseClassName,
        style: {
          ...style,
          maxWidth: `${calculatedMaxWidth}px`
        },
        ...href ? { href: String(href) } : {},
        children: typeof string === "string" && !isFull ? abbreviateString(string) : string
      }
    ) }),
    suffix
  ] });
};
var AddressContainer = withTranslation()(
  memo(({}) => {
    return /* @__PURE__ */ jsx(Fragment, {});
  })
);
export {
  AddressContainer,
  RenderAddress
};
//# sourceMappingURL=index.js.map