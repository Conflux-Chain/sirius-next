import * as react_jsx_runtime from 'react/jsx-runtime';
import react__default from 'react';

interface Props {
    title: react__default.ReactNode;
    children: react__default.ReactNode;
    noBorder?: boolean;
    vertical?: boolean;
    size?: 'medium' | 'small' | 'tiny';
}
type NativeAttrs = Omit<react__default.HTMLAttributes<any>, keyof Props>;
type DescriptionProps = Props & NativeAttrs;
declare const Description: ({ title, style, className, children, noBorder, vertical, size, ...others }: DescriptionProps) => react_jsx_runtime.JSX.Element;

export { Description, type DescriptionProps };
