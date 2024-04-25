import * as React$1 from 'react';
import * as react_i18next from 'react-i18next';
import * as react_jsx_runtime from 'react/jsx-runtime';

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
declare const RenderAddress: ({ cfxAddress, alias, hoverValue, hrefAddress, content, link, isFull, isFullNameTag, style, maxWidth, prefix, suffix, type, addressLabel, ENSLabel, nametag, }: RenderAddressProps) => react_jsx_runtime.JSX.Element;
declare const AddressContainer: React$1.ComponentType<Omit<react_i18next.Subtract<object, react_i18next.WithTranslationProps>, keyof react_i18next.WithTranslation<N, undefined>> & react_i18next.WithTranslationProps>;

export { AddressContainer, RenderAddress };
