import { API_HOST_MAP, IS_DEV } from '../env-constants';
import { NETWORK_TYPES } from '../types';
import logo from '../../images/cspace/logo.svg';
export * from './base';
export { default as ENV_LOCALES_EN } from './locales/en/translation.json';
export { default as ENV_LOCALES_CN } from './locales/zh_cn/translation.json';

export const ENV_NETWORK_ID = 1030;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.BTC_DEVNET;
export const ENV_API_HOST =
  API_HOST_MAP.openAPIHost ||
  (IS_DEV
    ? 'https://net8888cfx.confluxscan.net'
    : window.location.origin.replace(/core/, 'api'));
export const ENV_CORE_API_HOST =
  API_HOST_MAP.secondaryOpenAPIHost ||
  (IS_DEV
    ? 'https://net8888cfx.confluxscan.net'
    : window.location.origin.replace(/core/, 'api'));
export const ENV_CORE_SCAN_HOST =
  API_HOST_MAP.secondaryBackendAPIHost || 'https://www.confluxscan.net';
// TODO-core
export const ENV_RPC_SERVER =
  API_HOST_MAP.rpcHost || 'https://net8888cfx-cfxbridge.confluxrpc.com';
export const ENV_WALLET_CONFIG = {
  chainId: ENV_NETWORK_ID,
  chainName: 'Conflux coreSpace',
  // TODO-core
  rpcUrls: ['https://net8888cfx-cfxbridge.confluxrpc.com'],
  blockExplorerUrls: ['https://net8888cfx.confluxscan.net'],
  // TODO-core
  nativeCurrency: {
    name: 'Conflux',
    symbol: 'CFX',
    decimals: 18,
  },
};
export const ENV_LOGO = logo;
