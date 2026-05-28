import { Tooltip } from '../Tooltip';
import { shortenAddress } from '@cfx-kit/dapp-utils/dist/address';
import { cn } from 'src/utils';
import { useAddressLabel } from 'src/utils/hooks/useAddressLabel';
import { useMemo } from 'react';
import { Link } from '../Link';
import { EVMAddressContainerProps } from '../AddressContainer/types';
import { getAddressNameInfo } from '../AddressContainer/utils';

export const SmartAccountAddress = (
  props: Pick<
    EVMAddressContainerProps,
    | 'value'
    | 'contractName'
    | 'tokenName'
    | 'showVerificationName'
    | 'verificationName'
    | 'isFull'
    | 'verify'
    | 'showAddressLabel'
    | 'showNametag'
    | 'nametag'
    | 'nameMap'
  > & {
    delegatedTo: string;
    style?: React.CSSProperties;
    className?: string;
  },
) => {
  const {
    showAddressLabel = true,
    showVerificationName = false,
    value,
    isFull = false,
    delegatedTo,
    className,
    style,
    showNametag = true,
    nameMap,
  } = props;

  const nameInfo = getAddressNameInfo(value, nameMap);

  const tokenName = props.tokenName ?? nameInfo?.tokenName;
  const contractName = props.contractName ?? nameInfo?.contractName;
  const verificationName = props.verificationName ?? nameInfo?.verificationName;

  const nametag = props.nametag ?? nameInfo?.nametag;

  const addressLabel = useAddressLabel(value, showAddressLabel);

  const text = useMemo(() => {
    // Private name tags > Official tag/name > contract token name > contract tag > contract name > CNS/ENS
    return (
      addressLabel ||
      (showNametag ? nametag : undefined) ||
      tokenName ||
      contractName ||
      (showVerificationName && verificationName) ||
      (isFull ? value : shortenAddress(value))
    );
  }, [
    nametag,
    value,
    showNametag,
    addressLabel,
    contractName,
    tokenName,
    showVerificationName,
    verificationName,
    isFull,
  ]);

  return (
    <div className="inline-flex">
      <Tooltip
        title={
          <div className="flex flex-col gap-5px">
            <div>{value}</div>
            <div>Delegated to: {delegatedTo}</div>
          </div>
        }
        containerClassName="max-w-unset"
      >
        <Link
          className={cn(
            'block relative align-bottom cursor-pointer truncate max-w-220px',
            className,
          )}
          href={`/address/${value}`}
          style={style}
        >
          {text} (Code)
        </Link>
      </Tooltip>
    </div>
  );
};
