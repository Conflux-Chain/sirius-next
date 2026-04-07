import React from 'react';
import { formatAddress } from '../../utils/address';
import { Link } from '../Link';
import { DefaultTokenIcon } from '../Icons';
import clsx from 'clsx';

export const formatContractAndTokenInfoMap = (
  m: any,
  addressType: 'hex' | 'base32',
): Record<string, ContractAndTokenInfo> => {
  try {
    return Object.entries<ContractAndTokenInfo>(m)
      .map(a => ({
        [formatAddress(a[0], addressType)]: a[1],
        [a[0]]: a[1],
      }))
      .reduce((prev, curr) => Object.assign(prev, curr), {});
  } catch (error) {
    return {};
  }
};

export interface ContractAndTokenInfo {
  contract: {
    name?: string;
    address: string;
  };
  token: {
    name?: string;
    symbol?: string;
    iconUrl?: string;
    address: string;
  };
}

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
  info?: ContractAndTokenInfo;
  addressType: 'hex' | 'base32';
}

export const ContractDetail = ({ info, addressType }: Props) => {
  if (info) {
    const { contract, token } = info;
    let child: React.ReactNode = null;

    if (token && (token.name || token.symbol)) {
      const name = token['name'] || '--';
      let symbol = token['symbol'];
      symbol = `(${symbol ? symbol : '--'})`;
      const icon = token['iconUrl'];

      child = (
        <>
          <Icon icon={icon} />
          <Link href={`/token/${formatAddress(token.address, addressType)}`}>
            {name} {symbol}
          </Link>{' '}
        </>
      );
    } else if (contract && contract.name) {
      const name = contract['name'];
      const icon = token && token['iconUrl'];

      child = (
        <>
          <Icon icon={icon} />
          <Link
            href={`/address/${formatAddress(contract.address, addressType)}`}
          >
            {name}
          </Link>{' '}
        </>
      );
    }

    return <> {child}</>;
  }
  return null;
};
