import { memo } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import SDK from 'js-conflux-sdk';
import { Translation } from 'react-i18next';
import { AlertTriangle, File } from '@zeit-ui/react-icons';
import InternalContractIcon from '../../images/internal-contract-icon.png';
import ContractIcon from '../../images/contract-icon.png';
import VerifiedIcon from '../../images/verified.png';
import isMeIcon from '../../images/me.png';
import { Tooltip } from '../Tooltip';
import {
  abbreviateString,
  formatAddress,
  isCfxHexAddress,
  isAddress,
  isContractAddress,
  isInnerContractAddress,
  isZeroAddress,
} from '../../utils/address';
import { useGlobalData, getTranslations, getEnvConfig } from '../../store';
import { LOCALSTORAGE_KEYS_MAP } from '../../utils/constants';
import { getLabelInfo } from './label';
import { getNetwork, formatString } from 'src/utils';
const defaultPCMaxWidth = 138;

interface RenderAddressProps {
  cfxAddress?: string;
  alias?: string;
  hoverValue?: string;
  hrefAddress?: string;
  content?: string;
  link?: string | boolean;
  isFull?: boolean;
  isFullNameTag?: boolean;
  style?: React.CSSProperties;
  maxWidth?: number;
  suffixSize?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  type?: 'pow' | 'pos';
  addressLabel?: string | Iterable<React.ReactNode> | null;
  ENSLabel?: string | Iterable<React.ReactNode> | null;
  nametag?: string | Iterable<React.ReactNode> | null;
}
interface TooltipContent {
  [key: string]: {
    label: string;
    value: string | Iterable<React.ReactNode> | null | undefined;
  };
}
const renderTooltipContent = (tooltipContent: TooltipContent) => {
  return Object.entries(tooltipContent)
    .map(([key, { label, value }]) => {
      if (value) {
        return (
          <div key={key}>
            <span>
              <Translation>{t => t(label)}</Translation>
            </span>
            {value}
          </div>
        );
      }
      return null;
    })
    .filter(Boolean);
};

export const RenderAddress = ({
  cfxAddress,
  alias,
  hoverValue,
  hrefAddress,
  content,
  link = '',
  isFull = false,
  isFullNameTag = false,
  style = {},
  maxWidth,
  prefix = null,
  suffix = null,
  type = 'pow',
  addressLabel = '',
  ENSLabel = '',
  nametag = '',
}: RenderAddressProps) => {
  const translations = getTranslations();

  let href =
    typeof link === 'string'
      ? link
      : `/${type === 'pow' ? 'address' : 'pos/accounts'}/${hrefAddress || cfxAddress}`;

  const name = content || ENSLabel || nametag || addressLabel || alias;

  const calculatedMaxWidth =
    name && isFullNameTag ? 1000 : isFull ? 430 : maxWidth || defaultPCMaxWidth;
  const baseClassName = `w-[${calculatedMaxWidth}px] relative inline-flex flex-nowrap align-bottom cursor-default whitespace-nowrap overflow-hidden`;

  const Wrapper = href ? 'a' : 'div';

  const tooltipContent = {
    ENSLabel: {
      label: (translations as any)?.ens?.tip,
      value: ENSLabel,
    },
    nametag: {
      label: translations?.nametag?.tip,
      value: nametag,
    },
    addressLabel: {
      label: translations?.profile.address.myNameTag,
      value: addressLabel,
    },
    alias: {
      label: translations?.profile.address.publicNameTag,
      value: alias,
    },
  };
  const cfxAddressLabel =
    typeof cfxAddress === 'string' && !isFull
      ? abbreviateString(cfxAddress)
      : cfxAddress;

  return (
    <div className="inline-flex">
      {prefix}
      <Tooltip
        title={
          <>
            {renderTooltipContent(tooltipContent)}
            <div>{hoverValue || cfxAddress}</div>
          </>
        }
      >
        <Wrapper
          className={baseClassName}
          style={style}
          {...(href ? { href: String(href) } : {})}
        >
          {name || cfxAddressLabel}
        </Wrapper>
      </Tooltip>
      {suffix}
    </div>
  );
};

interface Props {
  globalData?: any;
  value: string; // address value
  alias?: string; // address alias, such as contract name, miner name, default null
  contractCreated?: string; // contract creation address
  maxWidth?: number; // address max width for view, default 200/170 for default, 400 for full
  isFull?: boolean; // show full address, default false
  isFullNameTag?: boolean; // show full nametag
  link?: boolean; // add link to address, default true
  isMe?: boolean; // when `address === portal selected address`, set isMe to true to add special tag, default false
  suffixAddressSize?: number; // suffix address size, default is 8
  showIcon?: boolean; // whether show contract icon, default true
  verify?: boolean; // show verified contract icon or unverified contract icon
  isEspaceAddress?: boolean; // check the address if is a eSpace hex address, if yes, link to https://evm.confluxscan.net/address/{hex_address}
  showAddressLabel?: boolean;
  showENSLabel?: boolean;
  ensInfo?: {
    [k: string]: {
      address: string;
      name: string;
      expired?: number;
    };
  };
  showNametag?: boolean;
  nametag?: string | Iterable<React.ReactNode> | null;
  nametagInfo?: {
    [k: string]: {
      address: string;
      nametag: string;
    };
  };
  cfxAddress?: string;
}

const ContractCreatedAddress = (props: Props & WithTranslation) => {
  const {
    globalData,
    contractCreated = '',
    showAddressLabel,
    showNametag,
    nametagInfo,
    showENSLabel,
    t,
    ensInfo,
  } = props;

  const isCore = isCfxHexAddress(contractCreated);

  const translations = getTranslations();

  const fContractCreated = formatAddress(contractCreated);

  // official name tag
  let officalNametag: React.ReactNode = null;
  // private name tag
  let addressLabel: React.ReactNode = null;

  // global private name tag
  const gAddressLabel =
    globalData?.[LOCALSTORAGE_KEYS_MAP.addressLabel]?.[fContractCreated];

  if (showAddressLabel && gAddressLabel) {
    const { label } = getLabelInfo(gAddressLabel, 'tag');

    addressLabel = label;
  }

  if (showNametag) {
    const _label = nametagInfo?.[fContractCreated]?.nametag ?? '';
    const { label } = getLabelInfo(_label, 'nametag');

    officalNametag = label;
  }

  // ens name tag
  let ENSLabel: React.ReactNode = null;
  if (isCore && showENSLabel) {
    let ENSMap = ensInfo || {};

    // global ens name tag
    const gENSLabel = ENSMap[fContractCreated]?.name;
    if (gENSLabel) {
      const { label } = getLabelInfo(gENSLabel, 'ens');
      ENSLabel = label;
    }
  }

  const customProps = {
    content: t(translations.transaction.contractCreation),
    nametag: officalNametag,
    hoverValue: fContractCreated,
    hrefAddress: fContractCreated,
    maxWidth: 160,
    ENSLabel,
    addressLabel,
  };

  const mergedProps = { ...customProps, ...props };
  return RenderAddress(mergedProps);
};

const HexAddress = (props: Props & WithTranslation) => {
  const { globalData, value, isEspaceAddress, t, isFull, maxWidth } = props;

  if (isEspaceAddress) {
    const ENV_CONFIG = getEnvConfig();
    const translations = getTranslations();
    const hexAddress = SDK.format.hexAddress(value);
    const network = getNetwork(globalData.networks, ENV_CONFIG.ENV_NETWORK_ID);
    const url = `${window.location.protocol}${network.url}/address/${hexAddress}`;

    return RenderAddress({
      cfxAddress: hexAddress,
      alias: formatString(hexAddress, 'hexAddress'),
      hoverValue: hexAddress,
      link: url,
      isFull,
      maxWidth,
      suffixSize: 0,
      prefix: (
        <div className="mr-[2px] flex-shrink-0">
          <Tooltip title={t((translations as any).general.eSpaceAddress)}>
            <File size={16} color="#17B38A" />
          </Tooltip>
        </div>
      ),
    });
  }
};

const InvalidAddress = (props: Props & WithTranslation) => {
  const { value, alias, t, isFull, maxWidth, isFullNameTag } = props;

  const translations = getTranslations();

  const tip = t(translations.general.invalidAddress);

  return RenderAddress({
    cfxAddress: value,
    alias,
    hoverValue: `${tip}: ${value}`,
    content: alias ? formatString(alias, 'tag') : value,
    link: false,
    isFull,
    isFullNameTag,
    maxWidth,
    style: { color: '#e00909' },
    prefix: (
      <div className="mr-[2px] flex-shrink-0">
        <Tooltip title={tip}>
          <AlertTriangle size={16} color="#e00909" />
        </Tooltip>
      </div>
    ),
  });
};

const ContractAddress = (props: Props & WithTranslation) => {
  const { showIcon, verify, t, cfxAddress, isFull } = props;

  const translations = getTranslations();

  const isInnerContract = cfxAddress && isInnerContractAddress(cfxAddress);

  const typeText = t(
    isInnerContract
      ? translations.general.internalContract
      : verify
        ? translations.general.verifiedContract
        : translations.general.unverifiedContract,
  );

  return RenderAddress({
    ...props,
    prefix: showIcon ? (
      <div className={`mr-[2px] flex-shrink-0 ${isFull ? 'icon' : ''}`}>
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
    ) : (
      <></>
    ),
  });
};

const MyAddress = (props: Props & WithTranslation) => {
  const { isFull } = props;
  return RenderAddress({
    ...props,
    suffix: (
      <div className="mr-[2px] flex-shrink-0">
        <img
          className={`w-[38.5px] h-[16px] mr-[3px] align-bottom mb-[${isFull ? 6 : 4}px]`}
          src={isMeIcon}
          alt="is me"
        />
      </div>
    ),
  });
};

const parseProps = (props: Props & WithTranslation) => {
  const {
    globalData,
    alias,
    ensInfo,
    t,
    showAddressLabel,
    showNametag,
    nametagInfo,
    showENSLabel,
  } = props;
  const cfxAddress = formatAddress(props.value);

  let ENSMap = ensInfo || {};

  const translations = getTranslations();

  let aliasLabel = alias;
  if (!alias && isZeroAddress(cfxAddress)) {
    aliasLabel = t(translations.general.zeroAddress);
  }

  let prefixIcon: React.ReactNode = null;
  // official name tag
  let officalNametag: React.ReactNode = null;
  // private name tag
  let addressLabel: React.ReactNode = null;
  // ens name tag
  let ENSLabel: React.ReactNode = null;
  // global ens name tag
  const gENSLabel = cfxAddress && ENSMap[cfxAddress]?.name;
  // global private name tag
  const gAddressLabel =
    globalData?.[LOCALSTORAGE_KEYS_MAP.addressLabel]?.[cfxAddress];

  if (showAddressLabel && gAddressLabel) {
    const { label } = getLabelInfo(gAddressLabel, 'tag');

    addressLabel = label;
  }

  if (showNametag) {
    const nametag = nametagInfo?.[cfxAddress]?.nametag ?? '';
    const { label } = getLabelInfo(nametag, 'nametag');

    officalNametag = label;
  }

  if (showENSLabel && gENSLabel) {
    const { label, icon } = getLabelInfo(gENSLabel, 'ens');

    ENSLabel = label;
    prefixIcon = icon;
  }

  return {
    alias: aliasLabel,
    prefix: prefixIcon,
    nametag: officalNametag,
    addressLabel,
    ENSLabel,
    cfxAddress,
  };
};
export const AddressContainer = withTranslation()(
  memo((props: Props & WithTranslation) => {
    const { globalData } = useGlobalData();
    const defaultProps = {
      globalData,
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

    const mergedProps = { ...defaultProps, ...props };

    if (!props.value && props.contractCreated) {
      return ContractCreatedAddress(mergedProps);
    }

    // If a txn receipt has no 'to' address or 'contractCreated', show -- for temp
    if (!props.value && !props.contractCreated) {
      return <></>;
    }

    if (props.isEspaceAddress) {
      return HexAddress(mergedProps);
    }

    if (!isAddress(props.value)) {
      return InvalidAddress(mergedProps);
    }

    const _props = { ...mergedProps, ...parseProps(props) };

    if (
      isContractAddress(_props.cfxAddress) ||
      isInnerContractAddress(_props.cfxAddress)
    ) {
      return ContractAddress(_props);
    }

    if (props.isMe) {
      return MyAddress(_props);
    }

    return RenderAddress(_props);
  }),
);
