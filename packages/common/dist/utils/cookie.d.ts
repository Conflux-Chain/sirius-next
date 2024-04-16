declare const docCookies: {
    getItem: (sKey: string) => string | null;
    setItem: (sKey: string, sValue: string | number | boolean, vEnd?: number | string | Date, sPath?: string, sDomain?: string, bSecure?: boolean) => boolean;
    removeItem: (sKey: string, sPath?: string, sDomain?: string) => boolean;
    hasItem: (sKey: string) => boolean;
    keys: () => string[];
};
export default docCookies;
//# sourceMappingURL=cookie.d.ts.map