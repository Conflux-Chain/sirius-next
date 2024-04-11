import React from 'react';
interface Props {
    title: React.ReactNode;
    children: React.ReactNode;
    noBorder?: boolean;
    vertical?: boolean;
    size?: 'medium' | 'small' | 'tiny';
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export type DescriptionProps = Props & NativeAttrs;
export declare const Description: ({ title, style, className, children, noBorder, vertical, size, ...others }: DescriptionProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map