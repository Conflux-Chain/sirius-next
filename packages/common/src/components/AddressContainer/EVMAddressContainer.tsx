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
import { getLabelInfo } from './label';

import { RenderAddress } from './addressView';
import {
  ContractCreatedAddress,
  InvalidAddress,
  ContractAddress,
  MyAddress,
} from './addressSwitcher';
import { GlobalDataType } from 'src/store/types';
import { EVMAddressContainerProps } from './types';

const parseProps = (
  props: EVMAddressContainerProps & WithTranslation,
  globalData: GlobalDataType,
) => {
  const { alias, t, showAddressLabel, showNametag, nametagInfo } = props;
  const value: string = props.value || '';
  const cfxAddress = formatAddress(value, 'hex');

  const translations = getTranslations();

  let aliasLabel = alias;
  if (!alias && isZeroAddress(cfxAddress)) {
    aliasLabel = t(translations.general.zeroAddress);
  }

  // official name tag
  let officalNametag: React.ReactNode = null;
  // private name tag
  let addressLabel: React.ReactNode = null;

  if (cfxAddress && showAddressLabel) {
    // global private name tag
    const addressLabels = globalData?.[LOCALSTORAGE_KEYS_MAP.addressLabel];
    const gAddressLabel =
      addressLabels?.[convertCheckSum(cfxAddress)] ||
      addressLabels?.[cfxAddress.toLocaleLowerCase()];

    if (gAddressLabel) {
      const { label } = getLabelInfo(gAddressLabel, 'tag');
      addressLabel = label;
    }
  }

  if (cfxAddress && showNametag) {
    const nametags =
      nametagInfo?.[convertCheckSum(cfxAddress)] ||
      nametagInfo?.[cfxAddress.toLocaleLowerCase()];

    if (nametags) {
      const nametag = nametags?.nametag ?? '';
      const { label } = getLabelInfo(nametag, 'nametag');
      officalNametag = label;
    }
  }

  return {
    alias: aliasLabel,
    nametag: officalNametag,
    addressLabel,
    cfxAddress,
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
