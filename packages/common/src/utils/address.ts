import SDK from 'js-conflux-sdk';
import { getAccount } from './rpcRequest';
import { NETWORK_ID } from './constants';
import {
  checksumHexAddress,
  convertHexToBase32,
  isBase32Address,
  isHexAddress,
  isCoreHexAddress,
  decode,
  convertBase32ToHex,
  getCoreHexAddressType,
} from '@cfx-kit/dapp-utils/dist/address';

type CoreAddressType = 'user' | 'contract' | 'builtin' | 'null' | 'unknown';
type EvmAddressType = 'user' | 'contract';

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
export const convertCheckSum = <T extends undefined | string>(address: T) => {
  if (address && isHexAddress(address)) {
    return checksumHexAddress(address);
  }
  return address;
};

// core mainnet or testnet
export const isCoreMainOrTestAddress = addressHandlerWrapper(
  (address: string): boolean => {
    return isCoreMainnetAddress(address) || isCoreTestnetAddress(address);
  },
);

// core mainnet
export const isCoreMainnetAddress = addressHandlerWrapper(
  (address: string): boolean => {
    return /^cfx:/i.test(address) && isBase32Address(address);
  },
);

// core testnet
export const isCoreTestnetAddress = addressHandlerWrapper(
  (address: string): boolean => {
    return /^cfxtest:/i.test(address) && isBase32Address(address);
  },
);

// core other chainId
export const isCoreOtherNetAddress = addressHandlerWrapper(
  (address: string): boolean => {
    return /^net/i.test(address) && isBase32Address(address);
  },
);

// evm
export const isEvmAddress = addressHandlerWrapper(
  (address: string): boolean => {
    return (
      isHexAddress(address) ||
      isSimplyZeroAddress(address) ||
      isBase32Address(address)
    );
  },
);

// core
export const isCoreAddress = addressHandlerWrapper(
  (address: string): boolean => {
    return (
      isCoreHexAddress(address) ||
      isSimplyZeroAddress(address) ||
      isBase32Address(address)
    );
  },
);

// common, only for 0x0
export const isSimplyZeroAddress = addressHandlerWrapper((address: string) => {
  return address === '0x0';
});

// common
export const isZeroAddress = addressHandlerWrapper(
  (address: string): boolean => {
    try {
      // hex
      if (isHexAddress(address)) {
        return address === SDK.CONST.ZERO_ADDRESS_HEX;
      } else if (isSimplyZeroAddress(address)) {
        return true;
        // base32
      } else if (isBase32Address(address)) {
        return formatAddress(address, 'hex') === SDK.CONST.ZERO_ADDRESS_HEX;
      }
    } catch (e) {}
    return false;
  },
);

// core
export const isCoreUserAddress = addressHandlerWrapper(
  (address: string): boolean => {
    if (isZeroAddress(address)) return true;
    return getCoreAddressInfo(address)?.type === 'user';
  },
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
);

// core
export const isCoreContractAddress = addressHandlerWrapper(
  (address: string, isIncludingInnerContract = true): boolean => {
    return (
      getCoreAddressInfo(address)?.type === 'contract' ||
      (isIncludingInnerContract && isInnerContractAddress(address))
    );
  },
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
);

// evm
/**
 * Only evm address type
 */
export const getEvmAddressType = addressHandlerWrapper(
  async (address: string): Promise<EvmAddressType> => {
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

interface CoreAddressInfo {
  netId: number;
  type: CoreAddressType;
}

// core
/**
 * Only core address type
 */
export const getCoreAddressInfo = addressHandlerWrapper(
  (address: string): CoreAddressInfo | null => {
    try {
      if (isCoreHexAddress(address)) {
        return {
          netId: NETWORK_ID,
          type: getCoreHexAddressType(address),
        };
      } else if (isBase32Address(address)) {
        const { netId, type } = decode(address);
        return { netId, type } as CoreAddressInfo;
      }
    } catch (e) {}
    return null;
  },
);

// common
export const formatAddress = (
  address: string,
  outputType: 'hex' | 'base32' = 'base32',
) => {
  let result = address;

  try {
    if (outputType === 'base32') {
      if (isCoreHexAddress(address)) {
        result = convertHexToBase32(address, NETWORK_ID);
      } else if (isBase32Address(address)) {
        const reg = /(.*):(.*):(.*)/;
        if (reg.test(address)) {
          result = address.replace(reg, '$1:$3').toLowerCase();
        }
      }
    } else if (outputType === 'hex') {
      if (isBase32Address(address)) {
        result = convertBase32ToHex(address);
      }
    }
  } catch (error) {
    console.error('Failed to format address:', error);
  }

  return result;
};
