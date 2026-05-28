import React from 'react';
import { formatAddress } from '../../utils/address';
import { Link } from '../Link';
import { DefaultTokenIcon } from '../Icons';
import clsx from 'clsx';
import { useAddressNameMap } from 'src/utils/hooks/useAddressNameMap';
import { getAddressNameInfo } from '../AddressContainer/utils';

const Icon = ({ icon, className }: { icon?: string; className?: string }) => {
  return icon ? (
    <img
      src={icon}
      alt="icon"
      className={clsx('w-1.1429rem mr-2px mb-3px', className)}
    />
  ) : (
    <DefaultTokenIcon
      className={clsx('w-1.1429rem mr-2px mb-3px', className)}
    />
  );
};

interface Props {
  address: string;
  addressType: 'hex' | 'base32';
}

export const ContractDetail = ({ address, addressType }: Props) => {
  const { data: nameMap } = useAddressNameMap([address]);
  const nameInfo = getAddressNameInfo(address, nameMap);
  if (nameInfo) {
    const {
      tokenName,
      tokenSymbol,
      tokenIconUrl,
      contractName,
      verificationName,
    } = nameInfo;
    let child: React.ReactNode = null;

    if (tokenName || tokenSymbol) {
      const name = tokenName || '--';
      const symbol = `(${tokenSymbol ? tokenSymbol : '--'})`;
      const icon = tokenIconUrl;

      child = (
        <>
          <Icon icon={icon} />
          <Link href={`/token/${formatAddress(address, addressType)}`}>
            {name} {symbol}
          </Link>{' '}
        </>
      );
    } else if (contractName || verificationName) {
      const name = contractName || verificationName;
      const icon = tokenIconUrl;

      child = (
        <>
          <Icon icon={icon} />
          <Link href={`/address/${formatAddress(address, addressType)}`}>
            {name}
          </Link>{' '}
        </>
      );
    }

    return <> {child}</>;
  }
  return null;
};
