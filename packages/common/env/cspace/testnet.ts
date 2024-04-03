import { API_HOST_MAP, DOMAIN, IS_STAGE } from '../env-constants';
import { NETWORK_TYPES } from '../types';
import logo from '../../images/cspace/logo-testnet.svg';
export * from './base';

import { default as _ENV_LOCALES_EN } from './locales/en/translation.json';
import { default as _ENV_LOCALES_EN_NET } from './locales/en/translationForDotNet.json'
import { default as _ENV_LOCALES_CN } from './locales/zh_cn/translation.json';
import { default as _ENV_LOCALES_CN_NET } from './locales/zh_cn/translationForDotNet.json'

import { HIDE_IN_DOT_NET } from '../../utils';

const ENV_LOCALES_EN = _ENV_LOCALES_EN;
const ENV_LOCALES_CN = HIDE_IN_DOT_NET ? _ENV_LOCALES_CN_NET : _ENV_LOCALES_CN;
export { ENV_LOCALES_EN, ENV_LOCALES_CN }

// TODO-core
export const ENV_NETWORK_ID = 1029;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.CORE_TESTNET;
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

export const ENV_OPEN_API_HOST =
  API_HOST_MAP.openAPIHost ||
  (IS_STAGE
    ? `https://api-testnet-stage.confluxscan${DOMAIN}`
    : `https://api-testnet.confluxscan${DOMAIN}`);
    
export const ENV_LOGO = logo;

export const ENV_FC_ADDRESS =
  'cfxtest:achteu1f777f1j1s8s4tvsx5vk5vcbrn4ykxa0fzg1';
export const ENV_FC_EXCHANGE_ADDRESS =
  'cfxtest:acf6wwargxpp9ddfe7rnagf2ty9gsxs54uptst589y';
export const ENV_FC_EXCHANGE_INTEREST_ADDRESS =
  'cfxtest:acadrvdd07u69hazg0nkjkpdetvyc5wma6put8949d';
export const ENV_CROSS_SPACE_ADDRESS =
  'cfxtest:aaejuaaaaaaaaaaaaaaaaaaaaaaaaaaaa2eaeg85p5';
export const ENV_ENS_REGISTRY_ADDRESS =
  'cfxtest:acemru7fu1u8brtyn3hrtae17kbcd4pd9u2m761bta';
export const ENV_ENS_PUBLIC_RESOLVER_ADDRESS =
  'cfxtest:acbfyf69zaxau5a23w10dgyrmb0hrz4p9pewn6sejp';
export const ENV_ENS_REVERSE_REGISTRAR_ADDRESS =
  'cfxtest:acfarpzehntpre0thg8x7dp0ajw4ms328pe1mm17vd';
