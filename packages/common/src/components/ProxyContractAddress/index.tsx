import { useTranslation } from 'react-i18next';
import { getTranslations } from 'src/store';
import { isInnerContractAddress } from 'src/utils/address';
import { Tooltip } from '../Tooltip';
import InternalContractIcon from '../../images/internal-contract-icon.png';
import ContractIcon from '../../images/contract-icon.png';
import VerifiedIcon from '../../images/verified.png';
import { shortenAddress } from '@cfx-kit/dapp-utils/dist/address';
import { cn } from 'src/utils';
import { ProxyType } from 'src/utils/hooks/useTxTrace';
import { useAddressLabel } from 'src/utils/hooks/useAddressLabel';
import { useMemo } from 'react';
import { Link } from '../Link';
import { CoreAddressContainerProps } from '../AddressContainer/types';
import { getAddressNameInfo } from '../AddressContainer/utils';

export const ProxyContractAddress = (
  props: Pick<
    CoreAddressContainerProps,
    | 'value'
    | 'contractName'
    | 'tokenName'
    | 'verificationName'
    | 'isFull'
    | 'verify'
    | 'showIcon'
    | 'showAddressLabel'
    | 'showENSLabel'
    | 'ensName'
    | 'showNametag'
    | 'nametag'
    | 'nameMap'
  > & {
    proxy: {
      type: ProxyType;
      implAddress: string;
      beaconAddress?: string;
    };
    style?: React.CSSProperties;
    className?: string;
  },
) => {
  const {
    showIcon = true,
    showAddressLabel = true,
    value,
    isFull = false,
    proxy,
    className,
    style,
    showENSLabel = true,
    showNametag = true,
    nameMap,
  } = props;

  const nameInfo = getAddressNameInfo(value, nameMap);

  const tokenName = props.tokenName ?? nameInfo?.tokenName;
  const contractName = props.contractName ?? nameInfo?.contractName;
  const verificationName = props.verificationName ?? nameInfo?.verificationName;
  const verify = props.verify ?? nameInfo?.verify;

  const nametag = props.nametag ?? nameInfo?.nametag;
  const ensName = props.ensName ?? nameInfo?.ensName;

  const { t } = useTranslation();
  const translations = getTranslations();
  const addressLabel = useAddressLabel(value, showAddressLabel);

  const text = useMemo(() => {
    // Private name tags > Official tag/name > contract token name > contract tag > contract name > CNS/ENS
    return (
      addressLabel ||
      (showNametag ? nametag : undefined) ||
      tokenName ||
      contractName ||
      verificationName ||
      (showENSLabel ? ensName : undefined) ||
      (isFull ? value : shortenAddress(value))
    );
  }, [
    nametag,
    value,
    showNametag,
    addressLabel,
    contractName,
    tokenName,
    verificationName,
    isFull,
    showENSLabel,
    ensName,
  ]);

  const isInnerContract = value && isInnerContractAddress(value);

  const typeText = t(
    isInnerContract
      ? translations.general.internalContract
      : verify
        ? translations.general.verifiedContract
        : translations.general.unverifiedContract,
  );

  return (
    <div className="inline-flex">
      {showIcon && (
        <div className={`mr-[2px] flex-shrink-0`}>
          <Tooltip title={typeText}>
            <div className="relative w-[16px] h-[16px]">
              {isInnerContract ? (
                <img
                  className="w-[16px] h-[16px] align-bottom mb-[5px]"
                  src={InternalContractIcon}
                  alt={typeText}
                />
              ) : (
                <>
                  <img
                    className="w-[16px] h-[16px] align-bottom mb-[5px]"
                    src={ContractIcon}
                    alt={typeText}
                  />
                  {verify ? (
                    <img
                      className="w-[8px] h-[8px] absolute bottom-[-1px] right-[1px]"
                      src={VerifiedIcon}
                      alt={''}
                    />
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </Tooltip>
        </div>
      )}
      <Tooltip
        title={
          <div className="flex flex-col gap-5px">
            <div>
              {proxy.type}: {value}
            </div>
            {proxy.beaconAddress && <div>Beacon: {proxy.beaconAddress}</div>}
            <div>Impl: {proxy.implAddress}</div>
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
          {text}({proxy.type})
        </Link>
      </Tooltip>
    </div>
  );
};
