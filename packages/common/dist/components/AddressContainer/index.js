import {
  sendRequestENSInfo
} from "../../chunk-G3LMW33D.js";
import {
  ContractAddress,
  ContractCreatedAddress,
  HexAddress,
  InvalidAddress,
  MyAddress,
  PosAddress
} from "../../chunk-MYDHLQC6.js";
import {
  getLabelInfo
} from "../../chunk-BK2A7KLR.js";
import {
  RenderAddress
} from "../../chunk-DUCZ3KRY.js";
import {
  formatAddress,
  isAddress,
  isBase32Address,
  isContractAddress,
  isInnerContractAddress,
  isZeroAddress
} from "../../chunk-HUAPBVSS.js";
import "../../chunk-GB4SIS35.js";
import "../../chunk-VTTJJHQ3.js";
import {
  apiPrefix
} from "../../chunk-RLZTFLPD.js";
import "../../chunk-UBCDOZDY.js";
import {
  getEnvConfig,
  getTranslations,
  useGlobalData
} from "../../chunk-WYPQ6ICJ.js";

// src/components/AddressContainer/index.tsx
import { memo, useCallback } from "react";
import { withTranslation } from "react-i18next";
import useSWR from "swr";
import _ from "lodash";
import { Fragment, jsx } from "react/jsx-runtime";
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
  const addressLabels = globalData?.["CONFLUX_SCAN_ADDRESS_LABELS" /* addressLabel */];
  const gAddressLabel = addressLabels?.[cfxAddress] || addressLabels?.[cfxAddress.toLocaleLowerCase()];
  if (showAddressLabel && gAddressLabel) {
    const { label } = getLabelInfo(gAddressLabel, "tag");
    addressLabel = label;
  }
  if (showNametag) {
    const addressLabels2 = nametagInfo?.[cfxAddress] || nametagInfo?.[cfxAddress.toLocaleLowerCase()];
    const nametag = addressLabels2?.nametag ?? "";
    const { label } = getLabelInfo(nametag, "nametag");
    officalNametag = label;
  }
  if (showENSLabel && gENSLabel) {
    const { label, icon } = getLabelInfo(gENSLabel, "ens");
    ENSLabel = label;
    prefixIcon = icon;
  }
  let link = props.isLink || props.link;
  return {
    alias: aliasLabel,
    prefix: prefixIcon,
    nametag: officalNametag,
    addressLabel,
    ENSLabel,
    cfxAddress,
    link
  };
};
var ensUrl = (value) => {
  let url = void 0;
  if (value && isBase32Address(value)) {
    url = apiPrefix + "/ens/reverse/match?address=" + value;
  }
  return url;
};
var AddressContainer = withTranslation()(
  memo((props) => {
    const { globalData } = useGlobalData();
    const url = ensUrl(props.value);
    const sendRequestCallback = useCallback(() => {
      return sendRequestENSInfo(url);
    }, [url]);
    const { data: ensData } = useSWR(url, sendRequestCallback, {
      revalidateOnFocus: false
    });
    if (!props.value && !props.contractCreated) {
      return /* @__PURE__ */ jsx(Fragment, {});
    }
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
      ensInfo: ensData
    };
    const mergeDefaultProps = _.assign({}, defaultProps, props);
    const mergeParseProps = _.merge(
      {},
      mergeDefaultProps,
      parseProps(mergeDefaultProps)
    );
    if (mergeParseProps.isPosAddress) {
      return PosAddress(mergeParseProps);
    }
    if (!mergeParseProps.value && mergeParseProps.contractCreated) {
      return ContractCreatedAddress(mergeParseProps);
    }
    if (mergeParseProps.isEspaceAddress) {
      return HexAddress(mergeParseProps);
    }
    if (!isAddress(mergeParseProps.value)) {
      return InvalidAddress(mergeParseProps);
    }
    if (mergeParseProps.isContract || isContractAddress(mergeParseProps.cfxAddress) || isInnerContractAddress(mergeParseProps.cfxAddress)) {
      return ContractAddress(mergeParseProps);
    }
    if (mergeParseProps.isMe) {
      return MyAddress(mergeParseProps);
    }
    return RenderAddress(mergeParseProps);
  })
);
export {
  AddressContainer
};
//# sourceMappingURL=index.js.map