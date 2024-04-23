interface AddressCache {
    [key: string]: any;
}
declare const ADDRESS_FUNC_CACHE: AddressCache;
declare const isPosAddress: (address: string) => boolean;
declare const isCfxHexAddress: (address: string) => boolean;
declare const isBase32Address: (address: string) => boolean;
declare const isSimplyBase32Address: (address: string) => boolean;
declare const isAddress: (address: string) => boolean;
declare function isZeroAddress(address: string): boolean;
declare function isAccountAddress(address: string, space: string): Promise<boolean>;
declare function isContractAddress(address: string): boolean;
declare function isInnerContractAddress(address: string): boolean;
declare function isSpecialAddress(address: string): boolean;
declare function isContractCodeHashEmpty(codeHash: string): boolean;
declare function getAddressType(address: string): Promise<string>;
declare const getAddressInfo: (address: string) => {
    netId: number;
    type: string;
    hexAddress: ArrayBuffer | string;
} | null;
declare const NETWORK_ID: any;
declare const formatAddress: (address: string, outputType?: string) => any;

export { ADDRESS_FUNC_CACHE, NETWORK_ID, formatAddress, getAddressInfo, getAddressType, isAccountAddress, isAddress, isBase32Address, isCfxHexAddress, isContractAddress, isContractCodeHashEmpty, isInnerContractAddress, isPosAddress, isSimplyBase32Address, isSpecialAddress, isZeroAddress };
