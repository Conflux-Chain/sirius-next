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

export const ProxyContractAddress = (props: {
  address: string;
  alias?: string;
  isFull?: boolean;
  verify?: boolean;
  showIcon?: boolean;
  showAddressLabel?: boolean;
  proxy: {
    type: ProxyType;
    implAddress: string;
    beaconAddress?: string;
  };
  style?: React.CSSProperties;
  className?: string;
}) => {
  const {
    showIcon = true,
    showAddressLabel = true,
    verify,
    address,
    alias,
    isFull = false,
    proxy,
    className,
    style,
  } = props;

  const { t } = useTranslation();
  const translations = getTranslations();
  const addressLabel = useAddressLabel(address, showAddressLabel);
  const text =
    addressLabel || alias || (isFull ? address : shortenAddress(address));

  const isInnerContract = address && isInnerContractAddress(address);

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
              {proxy.type}: {address}
            </div>
            {proxy.beaconAddress && <div>Beacon: {proxy.beaconAddress}</div>}
            <div>Impl: {proxy.implAddress}</div>
          </div>
        }
        containerClassName="max-w-unset"
      >
        <a
          className={cn(
            'block relative align-bottom cursor-pointer truncate max-w-190px',
            className,
          )}
          href={`/address/${address}`}
          style={style}
        >
          {text}({proxy.type})
        </a>
      </Tooltip>
    </div>
  );
};
