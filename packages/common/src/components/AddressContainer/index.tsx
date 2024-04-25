import { memo } from 'react';
import { withTranslation } from 'react-i18next';
import { Translation } from 'react-i18next';
import { Tooltip } from '../Tooltip';
import { abbreviateString } from '../../utils/address';
import { getTranslations } from '../../store';

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

  let href;

  const name = content || ENSLabel || nametag || addressLabel || alias;

  const calculatedMaxWidth =
    name && isFullNameTag ? 1000 : isFull ? 430 : maxWidth || defaultPCMaxWidth;

  if (link) {
    if (typeof link === 'string') {
      href = link;
    } else {
      href = `/${type === 'pow' ? 'address' : 'pos/accounts'}/${
        hrefAddress || cfxAddress
      }`;
    }
  }

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
    <div className="inline">
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

export const AddressContainer = withTranslation()(
  memo(({}) => {
    return <></>;
  }),
);
