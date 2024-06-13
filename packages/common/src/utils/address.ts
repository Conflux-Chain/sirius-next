import SDK from 'js-conflux-sdk';
import { getAccount } from './rpcRequest';
import { RenderAddressProps } from '../components/AddressContainer/types';
import { NETWORK_ID } from './constants';
import { isHex } from '.';

interface AddressCache {
  [key: string]: any;
}
export const ADDRESS_FUNC_CACHE: AddressCache = {};

// common
const addressHandlerWrapper = <T extends Function>(
  handler: T,
  cacheKey?: string,
): T => {
  return ((address: string, ...args: unknown[]) => {
    if (!address) return handler(address, ...args);
    const lowerAddress = address.toLowerCase();
    let CACHE_KEY = '';
    if (cacheKey) {
      CACHE_KEY = `${cacheKey}(${lowerAddress},${args.join(',')})`;
      if (ADDRESS_FUNC_CACHE[CACHE_KEY]) return ADDRESS_FUNC_CACHE[CACHE_KEY];
    }
    const result = handler(lowerAddress, ...args);
    if (cacheKey) {
      ADDRESS_FUNC_CACHE[CACHE_KEY] = result;
    }
    return result;
  }) as unknown as T;
};

// evm
export const convertCheckSum = addressHandlerWrapper((address?: string) => {
  if (address && isHexAddress(address)) {
    return SDK.format.checksumAddress(address);
  }
  return address;
}, 'convertCheckSum');

// core
export const isPosAddress = addressHandlerWrapper(
  (address: string): boolean => {
    try {
      return address.startsWith('0x') && address.length === 66;
    } catch (e) {
      return false;
    }
  },
  'isPosAddress',
);

// core mainnet or testnet
export const isCoreMainOrTestAddress = addressHandlerWrapper(
  (address: string): boolean => {
    return isCoreMainnetAddress(address) || isCoreTestnetAddress(address);
  },
  'isCoreMainOrTestAddress',
);

// core mainnet
export const isCoreMainnetAddress = addressHandlerWrapper(
  (address: string): boolean => {
    return isBase32Address(address) && /^cfx:/i.test(address);
  },
  'isCoreMainnetAddress',
);

// core testnet
export const isCoreTestnetAddress = addressHandlerWrapper(
  (address: string): boolean => {
    return isBase32Address(address) && /^cfxtest:/i.test(address);
  },
  'isCoreTestnetAddress',
);

// core other chainId
export const isCoreOtherNetAddress = addressHandlerWrapper(
  (address: string): boolean => {
    return isBase32Address(address) && /^net/i.test(address);
  },
  'isCoreOtherNetAddress',
);

// evm
export const isHexAddress = addressHandlerWrapper(
  (address: string): boolean => {
    try {
      return SDK.address.isValidHexAddress(address);
    } catch (e) {
      return false;
    }
  },
  'isHexAddress',
);

// core
export const isCoreHexAddress = addressHandlerWrapper(
  (address: string): boolean => {
    try {
      return SDK.address.isValidCfxHexAddress(address);
    } catch (e) {
      return false;
    }
  },
  'isCoreHexAddress',
);

// core
export const isBase32Address = addressHandlerWrapper(
  (address: string): boolean => {
    try {
      return SDK.address.isValidCfxAddress(address);
    } catch (e) {
      return false;
    }
  },
  'isBase32Address',
);

// core
export const isSimplyBase32Address = addressHandlerWrapper(
  (address: string): boolean => {
    try {
      return (
        isBase32Address(address) &&
        SDK.address.simplifyCfxAddress(address) === address
      );
    } catch (e) {
      return false;
    }
  },
  'isSimplyBase32Address',
);

// evm
export const isEvmAddress = addressHandlerWrapper(
  (address: string): boolean => {
    return (
      isHexAddress(address) ||
      isBase32Address(address) ||
      isZeroAddress(address)
    );
  },
  'isEvmAddress',
);

// core
export const isCoreAddress = addressHandlerWrapper(
  (address: string): boolean => {
    return (
      isCoreHexAddress(address) ||
      isBase32Address(address) ||
      isZeroAddress(address)
    );
  },
  'isCoreAddress',
);

// common
export const isZeroAddress = addressHandlerWrapper(
  (address: string): boolean => {
    try {
      // hex
      if (isHexAddress(address)) {
        return address === SDK.CONST.ZERO_ADDRESS_HEX;
        // base32
      } else if (isBase32Address(address)) {
        return SDK.address.isZeroAddress(formatAddress(address, 'hex'));
      } else if (address === '0x0') {
        return true;
      }
    } catch (e) {}
    return false;
  },
  'isZeroAddress',
);

// core
export const isCoreUserAddress = addressHandlerWrapper(
  (address: string): boolean => {
    if (isZeroAddress(address)) return true;
    return getCoreAddressInfo(address)?.type === 'user';
  },
  'isCoreUserAddress',
);

// evm
export const isEvmUserAddress = addressHandlerWrapper(
  async (address: string): Promise<boolean> => {
    try {
      if (isZeroAddress(address)) return true;
      return (await getEvmAddressType(address)) === 'user';
    } catch (e) {
      return false;
    }
  },
  'isEvmUserAddress',
);

// core
export const isCoreContractAddress = addressHandlerWrapper(
  (address: string, isIncludingInnerContract: boolean = true): boolean => {
    return (
      getCoreAddressInfo(address)?.type === 'contract' ||
      (isIncludingInnerContract && isInnerContractAddress(address))
    );
  },
  'isCoreContractAddress',
);

// evm
export const isEvmContractAddress = addressHandlerWrapper(
  async (address: string): Promise<boolean> => {
    try {
      return (await getEvmAddressType(address)) === 'contract';
    } catch (e) {
      return false;
    }
  },
  'isEvmContractAddress',
);

//core
export const isInnerContractAddress = addressHandlerWrapper(
  (address: string): boolean => {
    try {
      return SDK.address.isInternalContractAddress(
        formatAddress(address, 'hex'),
      );
    } catch (e) {
      return false;
    }
  },
  'isInnerContractAddress',
);

// core
// address start with 0x0, not valid internal contract, but fullnode support
export const isSpecialAddress = addressHandlerWrapper(
  (address: string): boolean => {
    return (
      getCoreAddressInfo(address)?.type === 'builtin' &&
      !isInnerContractAddress(address)
    );
  },
  'isSpecialAddress',
);

// evm
export const isContractCodeHashEmpty = addressHandlerWrapper(
  (codeHash: string) => {
    return (
      codeHash ===
        '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' ||
      codeHash === '0x' ||
      codeHash === ''
    );
  },
  'isContractCodeHashEmpty',
);

// evm
/**
 * Only evm address type
 */
export const getEvmAddressType = addressHandlerWrapper(
  async (address: string): Promise<string> => {
    try {
      const account: any = await getAccount(address);
      if (isContractCodeHashEmpty(account.codeHash)) {
        return 'user';
      }
      return 'contract';
    } catch (e) {
      console.log('getEvmAddressType error: ', e);
      throw e;
    }
  },
  'getEvmAddressType',
);

// core
/**
 * Only core address type
 */
export const getCoreAddressInfo = addressHandlerWrapper(
  (
    address: string,
  ): {
    netId: number;
    type: string;
    hexAddress: ArrayBuffer | string;
  } | null => {
    try {
      if (isCoreHexAddress(address)) {
        const base32Address = formatAddress(address, 'base32');
        return SDK.address.decodeCfxAddress(base32Address);
      } else if (isBase32Address(address)) {
        return SDK.address.decodeCfxAddress(address);
      }
    } catch (e) {}
    return null;
  },
  'getCoreAddressInfo',
);

// common
export const formatAddress = addressHandlerWrapper(
  (address: string, outputType = 'base32') => {
    let result = address;

    try {
      if (outputType === 'base32') {
        if (isCoreHexAddress(address)) {
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

    return result;
  },
  'formatAddress',
);

// Omit specification judgment: test environment cfxtest:xxx...xxxx, production environment cfx:xxx...xxxxxxxx,
export const abbreviateAddress = (address: string) => {
  let prefixNum = 0;
  let suffixNum = 0;

  if (isHexAddress(address)) {
    prefixNum = 6;
    suffixNum = 4;
  } else if (isCoreTestnetAddress(address) || isCoreOtherNetAddress(address)) {
    prefixNum = 11;
    suffixNum = 4;
  } else if (isCoreMainnetAddress(address)) {
    prefixNum = 7;
    suffixNum = 8;
  }

  if (prefixNum !== 0 && suffixNum !== 0) {
    return `${address.slice(0, prefixNum)}...${address.slice(-suffixNum)}`;
  }
  return address;
};
