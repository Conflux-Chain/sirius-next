import { useGlobalData } from 'src/store';
import { convertCheckSum } from 'src/utils/address';
import { useMemo } from 'react';
import { LOCALSTORAGE_KEYS_MAP } from 'src/utils/constants';

export const useAddressLabel = (address?: string, showAddressLabel = true) => {
  const { globalData } = useGlobalData();
  return useMemo(() => {
    if (!showAddressLabel || !address) return;
    const addressLabels = globalData?.[LOCALSTORAGE_KEYS_MAP.addressLabel];
    return (
      addressLabels?.[convertCheckSum(address)] ||
      addressLabels?.[address.toLowerCase()]
    );
  }, [showAddressLabel, globalData, address]);
};
