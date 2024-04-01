import { API_HOST_MAP, DOMAIN, IS_STAGE } from '../env-constants';
import { NETWORK_TYPES } from '../types';
// import logo from '../../images/cspace/logo-testnet.svg';
export * from './base';
export { default as ENV_LOCALES_EN } from './locales/en/translation.json';
export { default as ENV_LOCALES_CN } from './locales/zh_cn/translation.json';

// TODO-core
export const ENV_NETWORK_ID = 1029;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.BTC_TESTNET;
// TODO-core
export const ENV_API_HOST =
  API_HOST_MAP.openAPIHost ||
  (IS_STAGE
    ? `https://api-testnet-stage.confluxscan${DOMAIN}`
    : `https://api-testnet.confluxscan${DOMAIN}`);
export const ENV_CORE_API_HOST =
  API_HOST_MAP.secondaryOpenAPIHost ||
  (IS_STAGE
    ? `https://api-testnet-stage.confluxscan${DOMAIN}`
    : `https://api-testnet.confluxscan${DOMAIN}`);
export const ENV_CORE_SCAN_HOST =
  API_HOST_MAP.secondaryBackendAPIHost ||
  (IS_STAGE
    ? `https://testnet-stage.confluxscan${DOMAIN}`
    : `https://testnet.confluxscan${DOMAIN}`);
// TODO-core
export const ENV_RPC_SERVER =
  API_HOST_MAP.rpcHost || 'https://test.confluxrpc.com';
// TODO-core
export const ENV_WALLET_CONFIG = {
  chainId: ENV_NETWORK_ID,
  chainName: 'coreSpace Testnet',
  rpcUrls: ['https://test.confluxrpc.com'],
  blockExplorerUrls: ['https://testnet.confluxscan.io/'],
  nativeCurrency: {
    name: 'Conflux',
    symbol: 'CFX',
    decimals: 18,
  },
};
// export const ENV_LOGO = logo;
