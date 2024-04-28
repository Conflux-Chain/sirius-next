import {
  abbreviateString,
  formatAddress,
  isAddress,
  isCfxHexAddress,
  isContractAddress,
  isInnerContractAddress,
  isZeroAddress
} from "../../chunk-OAMWKZUY.js";
import "../../chunk-GB4SIS35.js";
import {
  sendRequestENSInfo
} from "../../chunk-UGVL6AJN.js";
import {
  formatString,
  getNetwork
} from "../../chunk-VTTJJHQ3.js";
import "../../chunk-KRQR6UDQ.js";
import {
  getLabelInfo
} from "../../chunk-HEG3T5QD.js";
import {
  Tooltip
} from "../../chunk-UBCDOZDY.js";
import {
  getEnvConfig,
  getTranslations,
  useGlobalData
} from "../../chunk-WYPQ6ICJ.js";

// src/components/AddressContainer/index.tsx
import { memo, useCallback } from "react";
import { withTranslation } from "react-i18next";
import SDK from "js-conflux-sdk";
import useSWR from "swr";
import { Translation } from "react-i18next";
import { AlertTriangle, File } from "@zeit-ui/react-icons";
import InternalContractIcon from "../../internal-contract-icon-ZH2RG3CU.png";
import ContractIcon from "../../contract-icon-P3W2HUAA.png";
import VerifiedIcon from "../../verified-VJRHZNN7.png";
import isMeIcon from "../../me-SIV36SR7.png";
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
  let href = typeof link === "string" ? link : `/${type === "pow" ? "address" : "pos/accounts"}/${hrefAddress || cfxAddress}`;
  const name = content || ENSLabel || nametag || addressLabel || alias;
  const calculatedMaxWidth = name && isFullNameTag ? 1e3 : isFull ? 430 : maxWidth || defaultPCMaxWidth;
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
  return /* @__PURE__ */ jsxs("div", { className: "inline-flex", children: [
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
var ContractCreatedAddress = (props) => {
  const {
    globalData,
    contractCreated = "",
    showAddressLabel,
    showNametag,
    nametagInfo,
    showENSLabel,
    t,
    ensInfo
  } = props;
  const isCore = isCfxHexAddress(contractCreated);
  const translations = getTranslations();
  const fContractCreated = formatAddress(contractCreated);
  let officalNametag = null;
  let addressLabel = null;
  const gAddressLabel = globalData?.["CONFLUX_SCAN_ADDRESS_LABELS" /* addressLabel */]?.[fContractCreated];
  if (showAddressLabel && gAddressLabel) {
    const { label } = getLabelInfo(gAddressLabel, "tag");
    addressLabel = label;
  }
  if (showNametag) {
    const _label = nametagInfo?.[fContractCreated]?.nametag ?? "";
    const { label } = getLabelInfo(_label, "nametag");
    officalNametag = label;
  }
  let ENSLabel = null;
  if (isCore && showENSLabel) {
    let ENSMap = ensInfo || {};
    const gENSLabel = ENSMap[fContractCreated]?.name;
    if (gENSLabel) {
      const { label } = getLabelInfo(gENSLabel, "ens");
      ENSLabel = label;
    }
  }
  const customProps = {
    content: t(translations.transaction.contractCreation),
    nametag: officalNametag,
    hoverValue: fContractCreated,
    hrefAddress: fContractCreated,
    maxWidth: 160,
    ENSLabel,
    addressLabel
  };
  const mergedProps = { ...customProps, ...props };
  return RenderAddress(mergedProps);
};
var HexAddress = (props) => {
  const { globalData, value, t, isFull, maxWidth } = props;
  const ENV_CONFIG = getEnvConfig();
  const translations = getTranslations();
  const hexAddress = SDK.format.hexAddress(value);
  const network = getNetwork(globalData.networks["testnet"], ENV_CONFIG.ENV_NETWORK_ID);
  const url = `${window.location.protocol}${network.url}/address/${hexAddress}`;
  return RenderAddress({
    cfxAddress: hexAddress,
    alias: formatString(hexAddress, "hexAddress"),
    hoverValue: hexAddress,
    link: url,
    isFull,
    maxWidth,
    suffixSize: 0,
    prefix: /* @__PURE__ */ jsx("div", { className: "mr-[2px] flex-shrink-0", children: /* @__PURE__ */ jsx(Tooltip, { title: t(translations.general.eSpaceAddress), children: /* @__PURE__ */ jsx(File, { size: 16, color: "#17B38A" }) }) })
  });
};
var InvalidAddress = (props) => {
  const { value, alias, t, isFull, maxWidth, isFullNameTag } = props;
  const translations = getTranslations();
  const tip = t(translations.general.invalidAddress);
  return RenderAddress({
    cfxAddress: value,
    alias,
    hoverValue: `${tip}: ${value}`,
    content: alias ? formatString(alias, "tag") : value,
    link: false,
    isFull,
    isFullNameTag,
    maxWidth,
    style: { color: "#e00909" },
    prefix: /* @__PURE__ */ jsx("div", { className: "mr-[2px] flex-shrink-0", children: /* @__PURE__ */ jsx(Tooltip, { title: tip, children: /* @__PURE__ */ jsx(AlertTriangle, { size: 16, color: "#e00909" }) }) })
  });
};
var ContractAddress = (props) => {
  const { showIcon, verify, t, cfxAddress, isFull } = props;
  const translations = getTranslations();
  const isInnerContract = cfxAddress && isInnerContractAddress(cfxAddress);
  const typeText = t(
    isInnerContract ? translations.general.internalContract : verify ? translations.general.verifiedContract : translations.general.unverifiedContract
  );
  return RenderAddress({
    ...props,
    prefix: showIcon ? /* @__PURE__ */ jsx("div", { className: `mr-[2px] flex-shrink-0 ${isFull ? "icon" : ""}`, children: /* @__PURE__ */ jsx(Tooltip, { title: typeText, children: /* @__PURE__ */ jsx("div", { className: "relative w-[16px] h-[16px]", children: isInnerContract ? /* @__PURE__ */ jsx(
      "img",
      {
        className: "w-[16px] h-[16px] align-bottom mb-[5px]",
        src: InternalContractIcon,
        alt: typeText
      }
    ) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          className: "w-[16px] h-[16px] align-bottom mb-[5px]",
          src: ContractIcon,
          alt: typeText
        }
      ),
      verify ? /* @__PURE__ */ jsx(
        "img",
        {
          className: "w-[8px] h-[8px] absolute bottom-[-1px] right-[1px]",
          src: VerifiedIcon,
          alt: ""
        }
      ) : /* @__PURE__ */ jsx(Fragment, {})
    ] }) }) }) }) : /* @__PURE__ */ jsx(Fragment, {})
  });
};
var MyAddress = (props) => {
  const { isFull } = props;
  return RenderAddress({
    ...props,
    suffix: /* @__PURE__ */ jsx("div", { className: "mr-[2px] flex-shrink-0", children: /* @__PURE__ */ jsx(
      "img",
      {
        className: `w-[38.5px] h-[16px] mr-[3px] align-bottom mb-[${isFull ? 6 : 4}px]`,
        src: isMeIcon,
        alt: "is me"
      }
    ) })
  });
};
var parseProps = (props) => {
  const {
    globalData,
    alias,
    ensInfo,
    t,
    showAddressLabel,
    showNametag,
    nametagInfo,
    showENSLabel
  } = props;
  const ENV_CONFIG = getEnvConfig();
  const outputType = ENV_CONFIG.ENV_ADDRESS || "base32";
  const cfxAddress = formatAddress(props.value, outputType);
  let ENSMap = ensInfo || {};
  const translations = getTranslations();
  let aliasLabel = alias;
  if (!alias && isZeroAddress(cfxAddress)) {
    aliasLabel = t(translations.general.zeroAddress);
  }
  let prefixIcon = null;
  let officalNametag = null;
  let addressLabel = null;
  let ENSLabel = null;
  const gENSLabel = cfxAddress && ENSMap[cfxAddress]?.name;
  const gAddressLabel = globalData?.["CONFLUX_SCAN_ADDRESS_LABELS" /* addressLabel */]?.[cfxAddress];
  if (showAddressLabel && gAddressLabel) {
    const { label } = getLabelInfo(gAddressLabel, "tag");
    addressLabel = label;
  }
  if (showNametag) {
    const nametag = nametagInfo?.[cfxAddress]?.nametag ?? "";
    const { label } = getLabelInfo(nametag, "nametag");
    officalNametag = label;
  }
  if (showENSLabel && gENSLabel) {
    const { label, icon } = getLabelInfo(gENSLabel, "ens");
    ENSLabel = label;
    prefixIcon = icon;
  }
  return {
    alias: aliasLabel,
    prefix: prefixIcon,
    nametag: officalNametag,
    addressLabel,
    ENSLabel,
    cfxAddress
  };
};
var AddressContainer = withTranslation()(
  memo((props) => {
    const { globalData } = useGlobalData();
    const sendRequestCallback = useCallback(() => {
      return sendRequestENSInfo({
        url: "/v1/ens/reverse/match",
        query: { address: props.value }
      });
    }, [props.value]);
    const { data, isLoading } = useSWR(
      "/v1/ens/reverse/match?address=" + props.value,
      sendRequestCallback,
      {
        revalidateOnFocus: false
      }
    );
    console.log(data, isLoading);
    const defaultProps = {
      globalData,
      isFull: false,
      isFullNameTag: false,
      link: true,
      isMe: false,
      showIcon: true,
      verify: false,
      showAddressLabel: true,
      showENSLabel: true,
      showNametag: true,
      ensInfo: data
    };
    const mergedProps = { ...defaultProps, ...props };
    if (mergedProps.isLink) {
      mergedProps.link = mergedProps.isLink;
    }
    if (!mergedProps.value && mergedProps.contractCreated) {
      return ContractCreatedAddress(mergedProps);
    }
    if (!mergedProps.value && !mergedProps.contractCreated) {
      return /* @__PURE__ */ jsx(Fragment, {});
    }
    if (mergedProps.isEspaceAddress) {
      return HexAddress(mergedProps);
    }
    if (!isAddress(mergedProps.value)) {
      return InvalidAddress(mergedProps);
    }
    const _props = { ...mergedProps, ...parseProps(mergedProps) };
    if (!props.ensInfo) {
      console.log(1);
    }
    if (_props.isContract || isContractAddress(_props.cfxAddress) || isInnerContractAddress(_props.cfxAddress)) {
      return ContractAddress(_props);
    }
    if (mergedProps.isMe) {
      return MyAddress(_props);
    }
    return RenderAddress(_props);
  })
);
export {
  AddressContainer,
  RenderAddress
};
//# sourceMappingURL=index.js.map