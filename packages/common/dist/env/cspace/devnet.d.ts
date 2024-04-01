import { NETWORK_TYPES } from '../types';
export * from './base';
export { default as ENV_LOCALES_EN } from './locales/en/translation.json';
export { default as ENV_LOCALES_CN } from './locales/zh_cn/translation.json';
export declare const ENV_NETWORK_ID = 1030;
export declare const ENV_NETWORK_TYPE = NETWORK_TYPES.BTC_DEVNET;
export declare const ENV_API_HOST: string;
export declare const ENV_CORE_API_HOST: string;
export declare const ENV_CORE_SCAN_HOST: string;
export declare const ENV_RPC_SERVER: string;
export declare const ENV_WALLET_CONFIG: {
    chainId: number;
    chainName: string;
    rpcUrls: string[];
    blockExplorerUrls: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
};
//# sourceMappingURL=devnet.d.ts.map