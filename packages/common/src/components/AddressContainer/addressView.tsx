import SDK from 'js-conflux-sdk';
import { Translation } from 'react-i18next';
import { Tooltip } from '../Tooltip';
import {
  abbreviateString,
  isBase32Address,
  isPosAddress,
} from '../../utils/address';
import { getTranslations } from '../../store';
import { TooltipContent, RenderAddressProps } from './types';

const defaultPCMaxWidth = 138;

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
  hideAliasPrefixInHover = false,
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

  const tooltipContent: TooltipContent = {
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
      hideLabel: hideAliasPrefixInHover,
    },
  };

  const checksumAddress =
    cfxAddress && isBase32Address(cfxAddress)
      ? cfxAddress
      : cfxAddress && isPosAddress(cfxAddress)
        ? cfxAddress
        : SDK.format.checksumAddress(cfxAddress);

  const cfxAddressLabel =
    typeof cfxAddress === 'string' && !isFull
      ? abbreviateString(cfxAddress)
      : checksumAddress;

  return (
    <div className="inline-flex">
      {prefix}
      <Tooltip
        title={
          <>
            {renderTooltipContent(tooltipContent)}
            <div>{hoverValue || checksumAddress}</div>
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
