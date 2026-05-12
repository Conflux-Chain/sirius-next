import { AddressNameMap } from 'src/utils/request.types';

export type Props = CoreAddressContainerProps & EVMAddressContainerProps;

export interface CoreAddressContainerProps {
  value: string; // address value
  contractCreated?: string; // contract creation address
  maxWidth?: number; // address max width for view, default 200/170 for default, 400 for full
  isFull?: boolean; // show full address, default false
  isFullNameTag?: boolean; // show full nametag
  link?: boolean; // add link to address, default true
  isMe?: boolean; // when `address === portal selected address`, set isMe to true to add special tag, default false
  suffixAddressSize?: number; // suffix address size, default is 8
  showIcon?: boolean; // whether show contract icon, default true
  verify?: boolean; // show verified contract icon or unverified contract icon
  isEspaceAddress?: boolean; //Only Core. check the address if is a eSpace hex address, if yes, link to https://evm.confluxscan.net/address/{hex_address}
  showAddressLabel?: boolean;
  showENSLabel?: boolean;
  showNametag?: boolean;
  tokenName?: string | null;
  contractName?: string | null;
  showVerificationName?: boolean;
  verificationName?: string | null;
  innerName?: string | null; // inner name is used for some special address, like the zero address
  // official name tag
  nametag?: string | Iterable<React.ReactNode> | null;
  // ens name tag
  ensName?: string | null;
  cfxAddress?: string;
  isPosAddress?: boolean;
  hideAliasPrefixInHover?: boolean;
  nameMap?: Record<string, AddressNameMap>;
}
export interface EVMAddressContainerProps {
  value: string; // address value
  contractCreated?: string; // contract creation address
  maxWidth?: number; // address max width for view, default 200/170 for default, 400 for full
  isFull?: boolean; // show full address, default false
  isFullNameTag?: boolean; // show full nametag
  link?: boolean; // add link to address, default true
  isMe?: boolean; // when `address === portal selected address`, set isMe to true to add special tag, default false
  showIcon?: boolean; // whether show contract icon, default true
  verify?: boolean; // show verified contract icon or unverified contract icon
  showAddressLabel?: boolean;
  showNametag?: boolean;
  tokenName?: string | null;
  contractName?: string | null;
  showVerificationName?: boolean;
  verificationName?: string | null;
  innerName?: string | null; // inner name is used for some special address, like the zero address
  // official name tag
  nametag?: string | Iterable<React.ReactNode> | null;
  isContract?: boolean;
  hideAliasPrefixInHover?: boolean;
  nameMap?: Record<string, AddressNameMap>;
}

export interface RenderAddressProps {
  cfxAddress?: string;
  hoverValue?: string;
  hrefAddress?: string;
  isContract?: boolean;
  isLink?: boolean;
  link?: string | boolean;
  isFull?: boolean;
  isFullNameTag?: boolean;
  style?: React.CSSProperties;
  maxWidth?: number;
  suffixSize?: number;
  prefix?: React.ReactNode;
  ENSIcon?: React.ReactNode;
  suffix?: React.ReactNode;
  type?: 'pow' | 'pos';
  tokenName?: string | null;
  contractName?: string | null;
  showVerificationName?: boolean;
  verificationName?: string | null;
  innerName?: string | null; // inner name is used for some special address, like the zero address
  addressLabel?: string | Iterable<React.ReactNode> | null;
  // ens name tag
  ENSLabel?: string | Iterable<React.ReactNode> | null;
  // official name tag
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
