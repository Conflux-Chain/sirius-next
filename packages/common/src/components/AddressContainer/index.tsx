import { memo, useCallback } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import useSWR from 'swr';
import _ from 'lodash';
import {
  formatAddress,
  isAddress,
  isContractAddress,
  isInnerContractAddress,
  isZeroAddress,
  isBase32Address,
} from '../../utils/address';
import { useGlobalData, getTranslations, getEnvConfig } from '../../store';
import { LOCALSTORAGE_KEYS_MAP, apiPrefix } from '../../utils/constants';
import { getLabelInfo } from './label';
import { sendRequestENSInfo } from 'src/utils/request';
import { Props } from './types';
import { RenderAddress } from './addressView';
import {
  ContractCreatedAddress,
  HexAddress,
  InvalidAddress,
  ContractAddress,
  MyAddress,
  PosAddress,
} from './assembleAddress';

const parseProps = (props: Props & WithTranslation) => {
  const {
    globalData,
    alias,
    ensInfo,
    t,
    showAddressLabel,
    showNametag,
    nametagInfo,
    showENSLabel,
  } = props;
  const ENV_CONFIG = getEnvConfig();
  const outputType = ENV_CONFIG.ENV_ADDRESS || 'base32';
  const cfxAddress = formatAddress(props.value, outputType);

  let ENSMap = ensInfo || {};

  const translations = getTranslations();

  let aliasLabel = alias;
  if (!alias && isZeroAddress(cfxAddress)) {
    aliasLabel = t(translations.general.zeroAddress);
  }

  let prefixIcon: React.ReactNode = null;
  // official name tag
  let officalNametag: React.ReactNode = null;
  // private name tag
  let addressLabel: React.ReactNode = null;
  // ens name tag
  let ENSLabel: React.ReactNode = null;
  // global ens name tag
  const gENSLabel = cfxAddress && ENSMap[cfxAddress]?.name;
  // global private name tag
  const addressLabels = globalData?.[LOCALSTORAGE_KEYS_MAP.addressLabel];
  const gAddressLabel =
    addressLabels?.[cfxAddress] ||
    addressLabels?.[cfxAddress.toLocaleLowerCase()];

  if (showAddressLabel && gAddressLabel) {
    const { label } = getLabelInfo(gAddressLabel, 'tag');

    addressLabel = label;
  }

  if (showNametag) {
    const addressLabels =
      nametagInfo?.[cfxAddress] ||
      nametagInfo?.[cfxAddress.toLocaleLowerCase()];
    const nametag = addressLabels?.nametag ?? '';
    const { label } = getLabelInfo(nametag, 'nametag');

    officalNametag = label;
  }

  if (showENSLabel && gENSLabel) {
    const { label, icon } = getLabelInfo(gENSLabel, 'ens');

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
    link,
  };
};

const ensUrl = (value: string) => {
  let url = undefined;
  if (value && isBase32Address(value)) {
    url = apiPrefix + '/ens/reverse/match?address=' + value;
  }
  return url;
};
export const AddressContainer = withTranslation()(
  memo((props: Props & WithTranslation) => {
    const { globalData } = useGlobalData();

    const url = ensUrl(props.value);
    const sendRequestCallback = useCallback(() => {
      return sendRequestENSInfo(url);
    }, [url]);
    const { data: ensData } = useSWR(url, sendRequestCallback, {
      revalidateOnFocus: false,
    });

    // If a txn receipt has no 'to' address or 'contractCreated', show -- for temp
    if (!props.value && !props.contractCreated) {
      return <></>;
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
      ensInfo: ensData,
    };

    const mergeDefaultProps = _.assign({}, defaultProps, props);

    const mergeParseProps = _.merge(
      {},
      mergeDefaultProps,
      parseProps(mergeDefaultProps),
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

    if (
      mergeParseProps.isContract ||
      isContractAddress(mergeParseProps.cfxAddress) ||
      isInnerContractAddress(mergeParseProps.cfxAddress)
    ) {
      return ContractAddress(mergeParseProps);
    }

    if (mergeParseProps.isMe) {
      return MyAddress(mergeParseProps);
    }

    return RenderAddress(mergeParseProps);
  }),
);
