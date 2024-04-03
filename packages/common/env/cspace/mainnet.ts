import { API_HOST_MAP, DOMAIN, IS_STAGE } from '../env-constants';
import { NETWORK_TYPES } from '../types';
import logo from '../../images/cspace/logo.svg';
export * from './base';

import { default as _ENV_LOCALES_EN } from './locales/en/translation.json';
import { default as _ENV_LOCALES_EN_NET } from './locales/en/translationForDotNet.json'
import { default as _ENV_LOCALES_CN } from './locales/zh_cn/translation.json';
import { default as _ENV_LOCALES_CN_NET } from './locales/zh_cn/translationForDotNet.json'

import { HIDE_IN_DOT_NET } from '../../utils';

const ENV_LOCALES_EN = HIDE_IN_DOT_NET ? _ENV_LOCALES_EN_NET : _ENV_LOCALES_EN;
const ENV_LOCALES_CN = HIDE_IN_DOT_NET ? _ENV_LOCALES_CN_NET : _ENV_LOCALES_CN;
export { ENV_LOCALES_EN, ENV_LOCALES_CN }

// TODO-core
export const ENV_NETWORK_ID = 1030;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.CORE_MAINNET;
// TODO-core
export const ENV_API_HOST =
  API_HOST_MAP.openAPIHost ||
  (IS_STAGE
    ? `https://api-stage.confluxscan${DOMAIN}`
    : `https://api.confluxscan${DOMAIN}`);
export const ENV_CORE_API_HOST =
  API_HOST_MAP.secondaryOpenAPIHost ||
  (IS_STAGE
    ? `https://api-stage.confluxscan${DOMAIN}`
    : `https://api.confluxscan${DOMAIN}`);
export const ENV_CORE_SCAN_HOST =
  API_HOST_MAP.secondaryBackendAPIHost ||
  (IS_STAGE
    ? `https://www-stage.confluxscan${DOMAIN}`
    : `https://www.confluxscan${DOMAIN}`);
// TODO-core
export const ENV_RPC_SERVER =
  API_HOST_MAP.rpcHost || 'https://main.confluxrpc.com';
// TODO-core
export const ENV_WALLET_CONFIG = {
  chainId: ENV_NETWORK_ID,
  chainName: 'Conflux coreSpace',
  rpcUrls: ['https://main.confluxrpc.com'],
  blockExplorerUrls: ['https://core.confluxscan.io/'],
  nativeCurrency: {
    name: 'Conflux',
    symbol: 'CFX',
    decimals: 18,
  },
};

export const ENV_OPEN_API_HOST =
  API_HOST_MAP.openAPIHost ||
  (IS_STAGE
    ? `https://api-stage.confluxscan${DOMAIN}`
    : `https://api.confluxscan${DOMAIN}`);

export const ENV_LOGO = logo;

export const ENV_FC_ADDRESS = 'cfx:achc8nxj7r451c223m18w2dwjnmhkd6rxawrvkvsy2';
export const ENV_FC_EXCHANGE_ADDRESS =
  'cfx:acdrd6ahf4fmdj6rgw4n9k4wdxrzfe6ex6jc7pw50m';
export const ENV_FC_EXCHANGE_INTEREST_ADDRESS =
  'cfx:acag8dru4527jb1hkmx187w0c7ymtrzkt2schxg140';
export const ENV_CROSS_SPACE_ADDRESS =
  'cfx:aaejuaaaaaaaaaaaaaaaaaaaaaaaaaaaa2sn102vjv';
export const ENV_ENS_REGISTRY_ADDRESS =
  'cfx:acemru7fu1u8brtyn3hrtae17kbcd4pd9uwbspvnnm';
export const ENV_ENS_PUBLIC_RESOLVER_ADDRESS =
  'cfx:acasaruvgf44ss67pxzfs1exvj7k2vyt863f72n6up';
export const ENV_ENS_REVERSE_REGISTRAR_ADDRESS =
  'cfx:acfarpzehntpre0thg8x7dp0ajw4ms328ps634v1zk';