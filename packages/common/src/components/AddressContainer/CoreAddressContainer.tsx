import { memo } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import _ from 'lodash';
import {
  formatAddress,
  isCoreAddress,
  isCoreContractAddress,
  isZeroAddress,
  convertCheckSum,
} from '../../utils/address';
import { useGlobalData, getTranslations } from '../../store';
import { LOCALSTORAGE_KEYS_MAP } from '../../utils/constants';
import { getLabelInfo } from './label';
import { useENS } from '../../utils/hooks/useENS';

import { RenderAddress } from './addressView';
import {
  ContractCreatedAddress,
  CoreHexAddress,
  InvalidAddress,
  ContractAddress,
  MyAddress,
  PosAddress,
} from './addressSwitcher';
import { GlobalDataType } from 'src/store/types';
import { CoreAddressContainerProps } from './types';

const parseProps = (
  props: CoreAddressContainerProps & WithTranslation,
  globalData: GlobalDataType,
) => {
  const {
    alias,
    ensInfo,
    t,
    showAddressLabel,
    showNametag,
    nametagInfo,
    showENSLabel,
  } = props;
  const value: string = props.value || '';
  const cfxAddress = formatAddress(value, 'base32');

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

  if (cfxAddress && showAddressLabel) {
    const gAddressLabel =
      addressLabels?.[convertCheckSum(cfxAddress)] ||
      addressLabels?.[cfxAddress.toLocaleLowerCase()];

    if (gAddressLabel) {
      const { label } = getLabelInfo(gAddressLabel, 'tag');
      addressLabel = label;
    }
  }

  if (cfxAddress && showNametag) {
    const addressLabels =
      nametagInfo?.[cfxAddress] ||
      nametagInfo?.[cfxAddress.toLocaleLowerCase()];

    if (addressLabels) {
      const nametag = addressLabels?.nametag ?? '';
      const { label } = getLabelInfo(nametag, 'nametag');
      officalNametag = label;
    }
  }

  if (showENSLabel && gENSLabel) {
    const { label, icon } = getLabelInfo(gENSLabel, 'ens');
    ENSLabel = label;
    prefixIcon = icon;
  }

  return {
    alias: aliasLabel,
    prefix: prefixIcon,
    nametag: officalNametag,
    addressLabel,
    ENSLabel,
    cfxAddress,
  };
};

export const CoreAddressContainer = withTranslation()(
  memo((props: CoreAddressContainerProps & WithTranslation) => {
    const { globalData } = useGlobalData();

    // If the interface returns Ens content, there is no need to obtain it separately, or disable the display of Ens content (in most cases on the list page).
    const unnecessaryEns = props.ensInfo || props.showENSLabel === false;
    const { ens } = useENS(unnecessaryEns ? null : props.value);

    // If a txn receipt has no 'to' address or 'contractCreated', show -- for temp
    if (!props.value && !props.contractCreated) {
      return <>--</>;
    }

    const defaultProps = {
      isFull: false,
      isFullNameTag: false,
      link: true,
      isMe: false,
      showIcon: true,
      verify: false,
      showAddressLabel: true,
      showENSLabel: true,
      showNametag: true,
      ensInfo: ens,
    };

    const mergeDefaultProps = _.assign({}, defaultProps, props);

    const mergeParseProps = _.merge(
      {},
      mergeDefaultProps,
      parseProps(mergeDefaultProps, globalData),
    );

    if (mergeParseProps.isPosAddress) {
      return PosAddress(mergeParseProps);
    }

    if (!mergeParseProps.value && mergeParseProps.contractCreated) {
      return ContractCreatedAddress({
        ...mergeParseProps,
        outputType: 'base32',
      });
    }

    if (mergeParseProps.isEspaceAddress) {
      return CoreHexAddress(mergeParseProps);
    }

    if (!isCoreAddress(mergeParseProps.value)) {
      return InvalidAddress(mergeParseProps);
    }

    if (isCoreContractAddress(mergeParseProps.cfxAddress)) {
      return ContractAddress(mergeParseProps);
    }

    if (mergeParseProps.isMe) {
      return MyAddress(mergeParseProps);
    }

    return RenderAddress(mergeParseProps);
  }),
);
