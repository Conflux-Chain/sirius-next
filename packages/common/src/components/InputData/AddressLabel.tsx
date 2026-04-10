import { Bookmark } from '@zeit-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../Text';
import { getTranslations } from 'src/store';
import { useENS } from 'src/utils/hooks/useENS';
import { useMemo } from 'react';
import { getLabelInfo } from '../AddressContainer/label';
import { useAddressLabel } from 'src/utils/hooks/useAddressLabel';

export const AddressLabel = ({
  address,
  space,
}: {
  address: string;
  space: 'evm' | 'core';
}) => {
  const translations = getTranslations();
  // ENS is only for core space, and we don't want to request ENS info for evm space to avoid unnecessary requests
  const { ens } = useENS(space === 'core' ? address : null);
  const { t } = useTranslation();

  const addressLabel = useAddressLabel(address);

  const { label, icon } = useMemo(
    () => getLabelInfo(ens[address]?.name ?? '', 'ens'),
    [address, ens],
  );

  const addressLabelIcon = (
    <Text tag="span" hoverValue={t(translations.profile.tip.label)}>
      <Bookmark color="var(--theme-color-gray2)" size={16} />
    </Text>
  );

  return (
    <>
      {label && (
        <>
          {' '}
          ({icon}
          {label})
        </>
      )}
      {addressLabel && (
        <>
          {' '}
          ({addressLabelIcon}
          {addressLabel})
        </>
      )}
    </>
  );
};
