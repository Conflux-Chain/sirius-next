import { isZeroAddress } from 'src/utils/address';
import { Pocket } from 'src/utils/request.types';

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
