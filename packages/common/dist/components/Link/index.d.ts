import React, { PropsWithChildren } from 'react';
interface LinkProps {
    className?: string;
    href: string;
    ga?: {
        category: string;
        action: string;
        label: string;
    };
    state?: any;
}
export declare const Link: React.FC<PropsWithChildren<LinkProps>>;
export {};
//# sourceMappingURL=index.d.ts.map