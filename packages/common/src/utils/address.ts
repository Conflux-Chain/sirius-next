import SDK from 'js-conflux-sdk';
import { getAccount } from './rpcRequest';
import { NETWORK_ID } from './constants';
import {
  checksumHexAddress,
  convertHexToBase32,
  isBase32Address as _isBase32Address,
  isSimplyBase32Address as _isSimplyBase32Address,
  isHexAddress,
  isCoreHexAddress,
  decode,
  convertBase32ToHex,
  getCoreHexAddressType,
  Base32Address,
  isAddressEqual as _isAddressEqual,
} from '@cfx-kit/dapp-utils/dist/address';

type CoreAddressType = 'user' | 'contract' | 'builtin' | 'null' | 'unknown';
type EvmAddressType = 'user' | 'contract';
type LooseAddressType = string | undefined | null;

interface AddressCache {
  [key: string]: unknown;
}
export const ADDRESS_FUNC_CACHE: AddressCache = {};

// common
const addressHandlerWrapper = <T extends Function>(
  handler: T,
  cacheKey?: string,
): T => {
  return ((address: LooseAddressType, ...args: unknown[]) => {
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
export const convertCheckSum = <T extends LooseAddressType>(address: T) => {
  if (address && isHexAddress(address)) {
    return checksumHexAddress(address);
  }
  return address;
};

// core mainnet or testnet
export const isCoreMainOrTestAddress = addressHandlerWrapper(
  (address: LooseAddressType): boolean => {
    return isCoreMainnetAddress(address) || isCoreTestnetAddress(address);
  },
);

// core mainnet
export const isCoreMainnetAddress = addressHandlerWrapper(
  (address: LooseAddressType): boolean => {
    return !!address && /^cfx:/i.test(address) && _isBase32Address(address);
  },
);

// core testnet
export const isCoreTestnetAddress = addressHandlerWrapper(
  (address: LooseAddressType): boolean => {
    return !!address && /^cfxtest:/i.test(address) && _isBase32Address(address);
  },
);

// core other chainId
export const isCoreOtherNetAddress = addressHandlerWrapper(
  (address: LooseAddressType): boolean => {
    return !!address && /^net/i.test(address) && _isBase32Address(address);
  },
);

// evm
export const isEvmAddress = addressHandlerWrapper(
  (address: LooseAddressType, includeBase32 = true): boolean => {
    if (!address) return false;
    return (
      isHexAddress(address) ||
      isSimplyZeroAddress(address) ||
      (includeBase32 && _isBase32Address(address))
    );
  },
);

// core
export const isCoreAddress = addressHandlerWrapper(
  (address: LooseAddressType): boolean => {
    if (!address) return false;
    return (
      isCoreHexAddress(address) ||
      isSimplyZeroAddress(address) ||
      _isBase32Address(address)
    );
  },
);

// common, only for 0x0
export const isSimplyZeroAddress = addressHandlerWrapper(
  (address: LooseAddressType) => {
    return address === '0x0';
  },
);

// common
export const isZeroAddress = addressHandlerWrapper(
  (address: LooseAddressType): boolean => {
    if (!address) return false;
    try {
      // hex
      if (isHexAddress(address)) {
        return address === SDK.CONST.ZERO_ADDRESS_HEX;
      } else if (isSimplyZeroAddress(address)) {
        return true;
        // base32
      } else if (_isBase32Address(address)) {
        return formatAddress(address, 'hex') === SDK.CONST.ZERO_ADDRESS_HEX;
      }
    } catch (e) {}
    return false;
  },
);

// core
export const isCoreUserAddress = addressHandlerWrapper(
  (address: LooseAddressType): boolean => {
    if (isZeroAddress(address)) return true;
    return getCoreAddressInfo(address)?.type === 'user';
  },
);

// evm
export const isEvmUserAddress = addressHandlerWrapper(
  async (address: LooseAddressType): Promise<boolean> => {
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
  (address: LooseAddressType, isIncludingInnerContract = true): boolean => {
    return (
      getCoreAddressInfo(address)?.type === 'contract' ||
      (isIncludingInnerContract && isInnerContractAddress(address))
    );
  },
);

// evm
export const isEvmContractAddress = addressHandlerWrapper(
  async (address: LooseAddressType): Promise<boolean> => {
    try {
      return (await getEvmAddressType(address)) === 'contract';
    } catch (e) {
      return false;
    }
  },
);

//core
export const isInnerContractAddress = addressHandlerWrapper(
  (address: LooseAddressType): boolean => {
    if (!address) return false;
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
  (address: LooseAddressType): boolean => {
    return (
      getCoreAddressInfo(address)?.type === 'builtin' &&
      !isInnerContractAddress(address)
    );
  },
);

// evm
export const isContractCodeHashEmpty = (codeHash: string) => {
  return (
    codeHash ===
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' ||
    codeHash === '0x' ||
    codeHash === ''
  );
};

// evm
/**
 * Only evm address type
 */
export const getEvmAddressType = addressHandlerWrapper(
  async (address: LooseAddressType): Promise<EvmAddressType | null> => {
    if (!address) return null;
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
  (address: LooseAddressType): CoreAddressInfo | null => {
    if (!address) return null;
    try {
      if (isCoreHexAddress(address)) {
        return {
          netId: NETWORK_ID,
          type: getCoreHexAddressType(address),
        };
      } else if (_isBase32Address(address)) {
        const { netId, type } = decode(address);
        return { netId, type } as CoreAddressInfo;
      }
    } catch (e) {}
    return null;
  },
);

// common
export const formatAddress = <T extends LooseAddressType>(
  address: T,
  outputType: 'hex' | 'base32',
) => {
  if (!address) return address;
  let result = address as string;

  try {
    if (outputType === 'base32') {
      if (isCoreHexAddress(address)) {
        result = convertHexToBase32(address, NETWORK_ID);
      } else if (_isBase32Address(address)) {
        const reg = /(.*):(.*):(.*)/;
        if (reg.test(address)) {
          result = address.replace(reg, '$1:$3').toLowerCase();
        }
      }
    } else if (outputType === 'hex') {
      if (_isBase32Address(address)) {
        result = convertBase32ToHex(address);
      }
    }
  } catch (error) {
    console.error('Failed to format address:', error);
  }

  return result;
};

/* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ temp make omnibus type loose ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */

export const isBase32Address = (address: LooseAddressType) => {
  if (!address) return false;
  return _isBase32Address(address);
};

export const isSimplyBase32Address = (address: LooseAddressType) => {
  if (!address) return false;
  return _isSimplyBase32Address(address as Base32Address);
};

/* ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ temp make omnibus type loose ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ */

// evm
// Convert hex to base32 for the bridge interface.
export const formatAddressHexToBase32 = (address: LooseAddressType) => {
  if (typeof address === 'string' && isHexAddress(address)) {
    return convertHexToBase32(address, NETWORK_ID.toString());
  }
  return address;
};

export const isAddressEqual = (
  a: Parameters<typeof _isAddressEqual>[0],
  b: Parameters<typeof _isAddressEqual>[1],
  options?: Parameters<typeof _isAddressEqual>[2],
) => {
  try {
    if (!a || !b) return false;
    return _isAddressEqual(a, b, options);
  } catch (error) {
    console.error('Failed to check:', error);
    return false;
  }
};
