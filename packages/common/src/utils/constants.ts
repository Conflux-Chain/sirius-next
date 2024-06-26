import { getEnvConfig } from '../store';
import lodash from 'lodash';
/**
 * @todo
 * 1. setNFTCacheInfo cacheKey
 * 2. GlobalTip
 *
 * @export
 * @enum {number}
 */
export enum LOCALSTORAGE_KEYS_MAP {
  reqProjectConfigMD5 = 'CONFLUX_SCAN_REQ_PROJECT_CONFIG_MD5',
  networkId = 'CONFLUX_SCAN_NETWORK_ID',
  contracts = 'CONFLUX_SCAN_CONTRACTS',
  contractNameTag = 'CONFLUX_SCAN_CONTRACT_NAME_TAG',
  currency = 'CONFLUX_SCAN_LOCALSTORAGE_KEY_CURRENCY',
  ageFormat = 'CONFLUX_SCAN_TABLE_AGE_FORMAT',
  cookieAgreed = 'CONFLUXSCAN_COOKIE_AGREED',
  txnRecords = 'CONFLUXSCAN_TXN_RECORDS',
  fccfxNotice = 'CONFLUX_SCAN_FCCFX_NOTICE',
  addressLabel = 'CONFLUX_SCAN_ADDRESS_LABELS',
  txPrivateNote = 'CONFLUX_SCAN_TX_PRIVATE_NOTES',
  hideInDotNet = 'CONFLUX_SCAN_HIDE_IN_DOT_NET',
  apis = 'CONFLUX_SCAN_APIS',
}

export const apiPrefix = '/v1';

export const CURRENCY_SYMBOLS: { [key: string]: string } = {
  USD: '$',
  CNY: '¥',
  GBP: '£',
  KRW: '₩',
  RUB: '₽',
  EUR: '€',
};

export const getCurrency = () => {
  return localStorage.getItem(LOCALSTORAGE_KEYS_MAP.currency) || 'USD';
};

export const getCurrencySymbol = () => {
  return CURRENCY_SYMBOLS[getCurrency()];
};

export const NETWORK_ID = (() => {
  const ENV_CONFIG = getEnvConfig();
  let networkId = ENV_CONFIG.ENV_NETWORK_ID;
  let cacheNetworkId = Number(
    localStorage.getItem(LOCALSTORAGE_KEYS_MAP.networkId),
  );

  if (lodash.isFinite(cacheNetworkId)) {
    networkId = Number(cacheNetworkId);
  }
  return networkId;
})();
