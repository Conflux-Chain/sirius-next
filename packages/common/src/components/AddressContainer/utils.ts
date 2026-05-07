import { isZeroAddress } from 'src/utils/address';
import { AddressNameMap, Pocket } from 'src/utils/request.types';

// https://app.clickup.com/3719212/v/dc/3hg1c-23878/3hg1c-21778?block=block-vVZ_AG9Btz
export const getPocketAlias = ({
  type,
  address,
  pocket,
}: {
  type: 'from' | 'to';
  address: string;
  pocket?: Pocket;
}): string | null => {
  // only show pocket info when address is zero address
  if (!isZeroAddress(address)) return null;

  if (pocket === 'mint_or_burn') {
    return type === 'from' ? 'System mint' : 'System burn';
  }
  if (pocket === 'gas_payment') {
    return 'System gas_payment';
  }
  return null;
};

export const getAddressNameInfo = (
  address?: string,
  nameMap?: Record<string, AddressNameMap>,
) => {
  if (!nameMap || !address) return null;
  const info = nameMap[address] || nameMap[address.toLowerCase()];
  if (!info) return null;
  return {
    tokenName: info.token?.name,
    tokenSymbol: info.token?.symbol,
    tokenDecimals: info.token?.decimals,
    tokenIconUrl: info.token?.iconUrl,
    contractTag: info.contract?.name,
    isContract: !!info.contract,
    verify: !!info.verification?.name,
    contractName: info.verification?.name,
    nametag: info.nameTag?.nameTag,
    ensName: info.ens?.name,
    // only for core space
    isEspaceAddress: !!info.eSpace?.address,
    // contract token name > contract tag > contract name
    // TODO: info.verification?.name
    alias: info.token?.name || info.contract?.name || info.verification?.name,
    // alias: info.token?.name || info.contract?.name,
    originInfo: info,
  };
};
