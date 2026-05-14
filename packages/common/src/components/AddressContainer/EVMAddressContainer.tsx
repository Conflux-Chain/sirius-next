import { memo } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import _ from 'lodash';
import {
  formatAddress,
  isEvmAddress,
  isZeroAddress,
  convertCheckSum,
} from '../../utils/address';
import { useGlobalData, getTranslations } from '../../store';
import { LOCALSTORAGE_KEYS_MAP } from '../../utils/constants';

import { RenderAddress } from './addressView';
import {
  ContractCreatedAddress,
  InvalidAddress,
  ContractAddress,
  MyAddress,
} from './addressSwitcher';
import { GlobalDataType } from 'src/store/types';
import { EVMAddressContainerProps } from './types';
import { getAddressNameInfo } from './utils';

const parseProps = (
  props: EVMAddressContainerProps & WithTranslation,
  globalData: GlobalDataType,
) => {
  const {
    t,
    showAddressLabel,
    showNametag,
    nametag,
    nameMap,
    showVerificationName,
  } = props;
  const value: string = props.value || '';
  const cfxAddress = formatAddress(value, 'hex');

  const nameInfo = getAddressNameInfo(cfxAddress, nameMap);

  const translations = getTranslations();

  let innerName = props.innerName;
  if (!innerName && isZeroAddress(cfxAddress)) {
    innerName = t(translations.general.zeroAddress);
  }

  // official name tag
  let officalNametag: React.ReactNode = null;
  // private name tag
  let addressLabel: React.ReactNode = null;

  if (cfxAddress && showAddressLabel) {
    // global private name tag
    const addressLabels = globalData?.[LOCALSTORAGE_KEYS_MAP.addressLabel];
    addressLabel =
      addressLabels?.[convertCheckSum(cfxAddress)] ||
      addressLabels?.[cfxAddress.toLowerCase()];
  }

  if (cfxAddress && showNametag) {
    officalNametag = nametag || nameInfo?.nametag;
  }

  return {
    innerName,
    nametag: officalNametag,
    addressLabel,
    cfxAddress,
    tokenName: props.tokenName || nameInfo?.tokenName,
    contractName: props.contractName || nameInfo?.contractName,
    verificationName: showVerificationName
      ? props.verificationName || nameInfo?.verificationName
      : undefined,
    verify: props.verify || nameInfo?.verify,
    isContract: props.isContract || nameInfo?.isContract,
  };
};

export const EVMAddressContainer = withTranslation()(
  memo((props: EVMAddressContainerProps & WithTranslation) => {
    const { globalData } = useGlobalData();

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
    };

    const mergeDefaultProps = _.assign({}, defaultProps, props);

    const mergeParseProps = _.merge(
      {},
      mergeDefaultProps,
      parseProps(mergeDefaultProps, globalData),
    );

    if (!mergeParseProps.value && mergeParseProps.contractCreated) {
      return ContractCreatedAddress({
        ...mergeParseProps,
        outputType: 'hex',
      });
    }

    if (!isEvmAddress(mergeParseProps.value)) {
      return InvalidAddress(mergeParseProps);
    }

    if (mergeParseProps.isContract) {
      return ContractAddress(mergeParseProps);
    }

    if (mergeParseProps.isMe) {
      return MyAddress(mergeParseProps);
    }

    return RenderAddress(mergeParseProps);
  }),
);
