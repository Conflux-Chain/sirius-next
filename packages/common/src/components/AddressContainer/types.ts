import { GlobalDataType } from '../../store/types';
export interface Props {
  globalData?: GlobalDataType;
  value: string; // address value
  alias?: string; // address alias, such as contract name, miner name, default null
  contractCreated?: string; // contract creation address
  maxWidth?: number; // address max width for view, default 200/170 for default, 400 for full
  isFull?: boolean; // show full address, default false
  isFullNameTag?: boolean; // show full nametag
  isLink?: boolean;
  link?: boolean; // add link to address, default true
  isMe?: boolean; // when `address === portal selected address`, set isMe to true to add special tag, default false
  suffixAddressSize?: number; // suffix address size, default is 8
  showIcon?: boolean; // whether show contract icon, default true
  verify?: boolean; // show verified contract icon or unverified contract icon
  isEspaceAddress?: boolean; //Only Core. check the address if is a eSpace hex address, if yes, link to https://evm.confluxscan.net/address/{hex_address}
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
  isContract?: boolean;
  isPosAddress?: boolean;
  hideAliasPrefixInHover?: boolean;
}

export interface RenderAddressProps {
  cfxAddress?: string;
  alias?: string;
  hoverValue?: string;
  hrefAddress?: string;
  isContract?: boolean;
  content?: string;
  isLink?: boolean;
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
  hideAliasPrefixInHover?: boolean;
}
export interface TooltipContent {
  [key: string]: {
    label: string;
    value: string | Iterable<React.ReactNode> | null | undefined;
    hideLabel?: boolean;
  };
}
