import SDK from 'js-conflux-sdk';
import lodash from 'lodash';
import { getEnvConfig } from '../store';
import { getAccount } from './rpcRequest';
import { LOCALSTORAGE_KEYS_MAP } from './constants';

interface AddressCache {
  [key: string]: any;
}
export const ADDRESS_FUNC_CACHE: AddressCache = {};

export const isPosAddress = (address: string): boolean => {
  try {
    return address.startsWith('0x') && address.length === 66;
  } catch (e) {
    return false;
  }
};

export const isCfxHexAddress = (address: string): boolean => {
  const CACHE_KEY = `isCfxHexAddress(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY]) return ADDRESS_FUNC_CACHE[CACHE_KEY];

  let result = false;

  try {
    result = SDK.address.isValidCfxHexAddress(address);
  } catch (e) {}

  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;

  return result;
};

export const isBase32Address = (address: string): boolean => {
  const CACHE_KEY = `isBase32Address(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY]) return ADDRESS_FUNC_CACHE[CACHE_KEY];

  let result = false;

  try {
    result = SDK.address.isValidCfxAddress(address);
  } catch (e) {}

  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;

  return result;
};

export const isSimplyBase32Address = (address: string): boolean => {
  const CACHE_KEY = `isSimplyBase32Address(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY]) return ADDRESS_FUNC_CACHE[CACHE_KEY];

  let result = false;

  try {
    result =
      SDK.address.isValidCfxAddress(address) &&
      SDK.address.simplifyCfxAddress(address) === address;
  } catch (e) {}

  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;

  return result;
};

// support hex and base32
export const isAddress = (address: string): boolean => {
  try {
    if (address.startsWith('0x')) {
      return SDK.address.isValidHexAddress(address) || isZeroAddress(address);
    } else {
      return isBase32Address(address);
    }
  } catch (e) {
    return false;
  }
};

export function isZeroAddress(address: string): boolean {
  const CACHE_KEY = `isZeroAddress(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY]) return ADDRESS_FUNC_CACHE[CACHE_KEY];

  let result = false;

  try {
    result =
      SDK.address.isZeroAddress(formatAddress(address, 'hex')) ||
      address === SDK.CONST.ZERO_ADDRESS_HEX ||
      address === '0x0';
  } catch (e) {}

  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;

  return result;
}

export async function isAccountAddress(
  address: string,
  space: string,
): Promise<boolean> {
  if (space === 'core') {
    return getAddressInfo(address)?.type === 'user' || isZeroAddress(address);
  }
  if (space === 'evm') {
    try {
      return (await getAddressType(address)) === 'account';
    } catch (e) {
      throw e;
    }
  }
  return false;
}

export function isContractAddress(address: string): boolean {
  return getAddressInfo(address)?.type === 'contract';
}

export function isInnerContractAddress(address: string): boolean {
  const CACHE_KEY = `isInnerContractAddress(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY]) return ADDRESS_FUNC_CACHE[CACHE_KEY];

  let result = false;

  try {
    result = SDK.address.isInternalContractAddress(
      formatAddress(address, 'hex'),
    );
  } catch (e) {}

  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;

  return result;
}

// address start with 0x0, not valid internal contract, but fullnode support
export function isSpecialAddress(address: string): boolean {
  const CACHE_KEY = `isSpecialAddress(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY]) return ADDRESS_FUNC_CACHE[CACHE_KEY];

  let result =
    getAddressInfo(address)?.type === 'builtin' &&
    !isInnerContractAddress(address);

  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;

  return result;
}

export function isContractCodeHashEmpty(codeHash: string) {
  return (
    codeHash ===
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' ||
    codeHash === '0x' ||
    codeHash === ''
  );
}

export async function getAddressType(address: string): Promise<string> {
  try {
    const account: any = await getAccount(address);
    if (isContractCodeHashEmpty(account.codeHash)) {
      return 'account';
    }
    return 'contract';
  } catch (e) {
    console.log('getAddressType error: ', e);
    throw e;
  }
}

export const getAddressInfo = (
  address: string,
): {
  netId: number;
  type: string;
  hexAddress: ArrayBuffer | string;
} | null => {
  const CACHE_KEY = `getAddressInfo(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY]) return ADDRESS_FUNC_CACHE[CACHE_KEY];

  let result = null;

  try {
    if (isCfxHexAddress(address)) {
      const base32Address = formatAddress(address, 'base32');
      result = SDK.address.decodeCfxAddress(base32Address);
    } else if (isBase32Address(address)) {
      result = SDK.address.decodeCfxAddress(address);
    }
  } catch (e) {}

  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;

  return result;
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

export const formatAddress = (address: string, outputType = 'base32') => {
  const CACHE_KEY = `formatAddress(${address}, ${outputType})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY]) {
    return ADDRESS_FUNC_CACHE[CACHE_KEY];
  }

  let result = address;

  try {
    if (outputType === 'base32') {
      if (isCfxHexAddress(address)) {
        result = SDK.format.address(address, NETWORK_ID);
      } else if (isBase32Address(address)) {
        const reg = /(.*):(.*):(.*)/;
        if (reg.test(address)) {
          result = address.replace(reg, '$1:$3').toLowerCase();
        }
      }
    } else if (outputType === 'hex') {
      if (isBase32Address(address)) {
        result = SDK.format.hexAddress(address);
      }
    }
  } catch (error) {
    console.error('Failed to format address:', error);
  }

  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;
  return result;
};

// export const formatAddress = (
//   address: string,
//   outputType = 'base32', // base32 or hex
// ): string => {
//   const CACHE_KEY = `formatAddress(${address}, ${outputType})`;
//   if (ADDRESS_FUNC_CACHE[CACHE_KEY]) return ADDRESS_FUNC_CACHE[CACHE_KEY];

//   let result = address;

//   try {
//     if (outputType === 'base32') {
//       if (isCfxHexAddress(address)) {
//         result = SDK.format.address(address, NETWORK_ID);
//       } else if (isBase32Address(address)) {
//         const reg = /(.*):(.*):(.*)/;
//         // compatibility with verbose address, will replace with simply address later
//         if (typeof address === 'string' && reg.test(address)) {
//           result = address.replace(reg, '$1:$3').toLowerCase();
//         }
//       }
//     } else if (outputType === 'hex') {
//       if (isAddress(address)) {
//         if (outputType === 'hex') {
//           if (isBase32Address(address)) {
//             result = SDK.format.hexAddress(address);
//           } else {
//             result = address;
//           }
//         } else if (outputType === 'base32') {
//           result = SDK.format.address(address, NETWORK_ID);
//         } else {
//           result = address;
//         }
//       } else if (isBase32Address(address)) {
//         if (outputType === 'hex') {
//           result = SDK.format.hexAddress(address);
//         } else if (outputType === 'base32') {
//           const reg = /(.*):(.*):(.*)/;
//           let lowercaseAddress = address;

//           // compatibility with verbose address, will replace with simply address later
//           if (typeof address === 'string' && reg.test(address)) {
//             lowercaseAddress = address.replace(reg, '$1:$3').toLowerCase();
//           }
//           result = lowercaseAddress;
//         } else {
//           result = address;
//         }
//       } else {
//         result = address;
//       }
//     }
//     ADDRESS_FUNC_CACHE[CACHE_KEY] = result;

//     return result;
//   } catch (error) {

//   }

//   return result;

// };
interface EVN_TYPE {
  IS_MAINNET: boolean;
}
// Omit specification judgment: test environment cfxtest:....xxxx, production environment cfx:....xxxx,
export const abbreviateString = (str: string) => {
  const ENV_CONFIG: EVN_TYPE = getEnvConfig();
  const prefixNum = ENV_CONFIG?.IS_MAINNET ? 8 : 12;
  const suffixNum = ENV_CONFIG?.IS_MAINNET ? 8 : 4;
  if (str.length > 7) {
    return `${str.slice(0, prefixNum)}...${str.slice(-suffixNum)}`;
  }
  return str;
};