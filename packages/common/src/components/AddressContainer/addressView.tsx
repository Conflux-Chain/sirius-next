import { Translation } from 'react-i18next';
import { Tooltip } from '../Tooltip';
import { Text } from '../Text';
import {
  abbreviateAddress,
  convertCheckSum,
  convertLink,
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

  const name = content || ENSLabel || nametag || addressLabel || alias;

  const defaultStyle = {
    maxWidth: `${(name && isFullNameTag) || isFull ? 'auto' : (maxWidth || defaultPCMaxWidth) + 'px'}`,
  };

  const href = convertLink({ link, type, hrefAddress, cfxAddress });

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

  const checksumAddress = convertCheckSum(cfxAddress);

  const cfxAddressLabel =
    typeof cfxAddress === 'string' && !isFull
      ? abbreviateAddress(checksumAddress)
      : checksumAddress;

  return (
    <div className="inline-flex">
      {prefix}
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
