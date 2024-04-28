import * as React$1 from 'react';
import * as react_i18next from 'react-i18next';
import { WithTranslation } from 'react-i18next';
import * as react_jsx_runtime from 'react/jsx-runtime';

interface RenderAddressProps {
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
}
declare const RenderAddress: ({ cfxAddress, alias, hoverValue, hrefAddress, content, link, isFull, isFullNameTag, style, maxWidth, prefix, suffix, type, addressLabel, ENSLabel, nametag }: RenderAddressProps) => react_jsx_runtime.JSX.Element;
interface Props {
    globalData?: any;
    value: string;
    alias?: string;
    contractCreated?: string;
    maxWidth?: number;
    isFull?: boolean;
    isFullNameTag?: boolean;
    isLink?: boolean;
    link?: boolean;
    isMe?: boolean;
    suffixAddressSize?: number;
    showIcon?: boolean;
    verify?: boolean;
    isEspaceAddress?: boolean;
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
}
declare const AddressContainer: React$1.ComponentType<Omit<react_i18next.Subtract<Props & WithTranslation<"translation", undefined>, react_i18next.WithTranslationProps>, keyof WithTranslation<N, undefined>> & react_i18next.WithTranslationProps>;

export { AddressContainer, RenderAddress };
