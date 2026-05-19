import { Translation } from 'react-i18next';
import { Text } from '../Text';
import { convertCheckSum } from '../../utils/address';
import { getTranslations } from '../../store';
import { TooltipContent, RenderAddressProps } from './types';
import { shortenAddress } from '@cfx-kit/dapp-utils/dist/address';

const defaultPCMaxWidth = 138;

// common
const renderTooltipContent = (tooltipContent: TooltipContent) => {
  return Object.entries(tooltipContent)
    .map(([key, { label, value, hideLabel }]) => {
      if (value) {
        return (
          <div key={key}>
            {!hideLabel && (
              <span>
                <Translation>{t => t(label)}</Translation>
              </span>
            )}
            {value}
          </div>
        );
      }
      return null;
    })
    .filter(Boolean);
};

// common
const convertLink = ({
  link,
  type,
  hrefAddress,
  cfxAddress,
}: RenderAddressProps) => {
  if (typeof link === 'string') {
    return link;
  }
  if (link === false) {
    return false;
  }

  const address = hrefAddress || cfxAddress;

  if (address && typeof address === 'string') {
    const pathname = window.location.pathname.toLowerCase();
    const addressLower = address.toLowerCase();
    if (pathname.includes('/address/' + addressLower)) {
      return false;
    }

    if (type === 'pow') {
      return `/address/${address}`;
    }

    if (type === 'pos') {
      return `/pos/accounts/${address}`;
    }
  }

  return false;
};

// common
export const RenderAddress = ({
  cfxAddress,
  tokenName,
  contractName,
  verificationName,
  hoverValue,
  hrefAddress,
  link = '',
  isFull = false,
  isFullNameTag = false,
  style = {},
  maxWidth,
  prefix = null,
  ENSIcon = null,
  suffix = null,
  type = 'pow',
  addressLabel = '',
  ENSLabel = '',
  nametag = '',
  innerName = '',
  hideAliasPrefixInHover = false,
}: RenderAddressProps) => {
  const translations = getTranslations();

  // Private name tags > Official tag/name > contract token name > contract name tag > contract verification name > CNS/ENS
  const name =
    // Private name tags
    addressLabel ||
    // Official tag/name
    nametag ||
    // contract token name
    tokenName ||
    // contract name tag
    contractName ||
    // contract verification name
    verificationName ||
    // CNS/ENS
    ENSLabel ||
    // inner name is used for some special address, like the zero address
    innerName;
  const isShowEns = !!ENSLabel && name === ENSLabel;

  const defaultStyle = {
    maxWidth: `${(name && isFullNameTag) || isFull ? 'unset' : (maxWidth || defaultPCMaxWidth) + 'px'}`,
  };

  const href = convertLink({ link, type, hrefAddress, cfxAddress });

  const Wrapper = href ? 'a' : 'div';

  const tooltipContent: TooltipContent = {
    addressLabel: {
      label: translations?.profile.address.myNameTag,
      value: addressLabel,
    },
    nametag: {
      label: translations?.nametag?.tip,
      value: nametag,
    },
    alias: {
      label: translations?.profile.address.publicNameTag,
      value: tokenName || contractName || verificationName,
      hideLabel: hideAliasPrefixInHover,
    },
    ENSLabel: {
      label: (translations as any)?.ens?.tip,
      value: ENSLabel,
    },
  };

  const checksumAddress = convertCheckSum(cfxAddress);

  const cfxAddressLabel =
    typeof checksumAddress === 'string' && !isFull
      ? type === 'pos'
        ? shortenAddress(checksumAddress!, {
            prefixLength: 10,
            suffixLength: 0,
          })
        : shortenAddress(checksumAddress!)
      : checksumAddress;

  return (
    <div className="inline-flex">
      {prefix || (isShowEns ? ENSIcon : null)}
      <Text
        tag="span"
        hoverValue={
          <>
            {renderTooltipContent(tooltipContent)}
            <div>{hoverValue || checksumAddress}</div>
          </>
        }
      >
        <Wrapper
          className="block relative align-bottom cursor-default truncate"
          style={{ ...defaultStyle, ...style }}
          {...(href ? { href: String(href) } : {})}
        >
          {name || cfxAddressLabel}
        </Wrapper>
      </Text>
      {suffix}
    </div>
  );
};
