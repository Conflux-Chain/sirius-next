import {
  abbreviateString
} from "../../chunk-DJPIYD4B.js";
import "../../chunk-4M4NHTZH.js";
import {
  Tooltip
} from "../../chunk-UBCDOZDY.js";
import "../../chunk-ELZCOMBE.js";
import "../../chunk-ADTPJ4V5.js";
import {
  getTranslations
} from "../../chunk-DE2BHFIR.js";

// src/components/AddressContainer/index.tsx
import { memo } from "react";
import { withTranslation } from "react-i18next";
import { Translation } from "react-i18next";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var defaultPCMaxWidth = 138;
var renderTooltipContent = (tooltipContent) => {
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
var RenderAddress = ({
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
  const translations = getTranslations();
  let href;
  const name = content || ENSLabel || nametag || addressLabel || alias;
  const calculatedMaxWidth = name && isFullNameTag ? 1e3 : isFull ? 430 : maxWidth || defaultPCMaxWidth;
  if (link) {
    if (typeof link === "string") {
      href = link;
    } else {
      href = `/${type === "pow" ? "address" : "pos/accounts"}/${hrefAddress || cfxAddress}`;
    }
  }
  const baseClassName = `w-[${calculatedMaxWidth}px] relative inline-flex flex-nowrap align-bottom cursor-default whitespace-nowrap overflow-hidden`;
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
  const cfxAddressLabel = typeof cfxAddress === "string" && !isFull ? abbreviateString(cfxAddress) : cfxAddress;
  return /* @__PURE__ */ jsxs("div", { className: "inline", children: [
    prefix,
    /* @__PURE__ */ jsx(
      Tooltip,
      {
        title: /* @__PURE__ */ jsxs(Fragment, { children: [
          renderTooltipContent(tooltipContent),
          /* @__PURE__ */ jsx("div", { children: hoverValue || cfxAddress })
        ] }),
        children: /* @__PURE__ */ jsx(
          Wrapper,
          {
            className: baseClassName,
            style,
            ...href ? { href: String(href) } : {},
            children: name || cfxAddressLabel
          }
        )
      }
    ),
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