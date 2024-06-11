import SDK from 'js-conflux-sdk';
import { getAccount } from './rpcRequest';
import { RenderAddressProps } from '../components/AddressContainer/types';
import { NETWORK_ID } from './constants';

interface AddressCache {
  [key: string]: any;
}
export const ADDRESS_FUNC_CACHE: AddressCache = {};

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

export const convertCheckSum = addressHandlerWrapper((cfxAddress?: string) => {
  if (cfxAddress === undefined) {
    return '';
  }

  if (isHexAddress(cfxAddress)) {
    return SDK.format.checksumAddress(cfxAddress);
  }

  return cfxAddress;
}, 'convertCheckSum');

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

// cfx, cfxtest
export const isCoreMainOrTestAddress = addressHandlerWrapper(
  (address: string): boolean => {
    let result = false;

    try {
      result = isBase32Address(address) && address.startsWith('cfx');
    } catch (e) {}

    return result;
  },
  'isCoreMainOrTestAddress',
);

export const isHexAddress = addressHandlerWrapper(
  (address: string): boolean => {
    let result = false;

    try {
      result =
        address.startsWith('0x') && SDK.address.isValidHexAddress(address);
    } catch (e) {}

    return result;
  },
  'isHexAddress',
);

export const isCfxHexAddress = addressHandlerWrapper(
  (address: string): boolean => {
    let result = false;

    try {
      result = SDK.address.isValidCfxHexAddress(address);
    } catch (e) {}

    return result;
  },
  'isCfxHexAddress',
);

export const isBase32Address = addressHandlerWrapper(
  (address: string): boolean => {
    let result = false;

    try {
      result = SDK.address.isValidCfxAddress(address);
    } catch (e) {}

    return result;
  },
  'isBase32Address',
);

export const isSimplyBase32Address = addressHandlerWrapper(
  (address: string): boolean => {
    let result = false;

    try {
      result =
        SDK.address.isValidCfxAddress(address) &&
        SDK.address.simplifyCfxAddress(address) === address;
    } catch (e) {}

    return result;
  },
  'isSimplyBase32Address',
);

// support hex and base32
export const isAddress = addressHandlerWrapper((address: string): boolean => {
  try {
    if (address.startsWith('0x')) {
      return SDK.address.isValidHexAddress(address) || isZeroAddress(address);
    } else {
      return isBase32Address(address);
    }
  } catch (e) {
    return false;
  }
}, 'isAddress');

export const isZeroAddress = addressHandlerWrapper(
  (address: string): boolean => {
    let result = false;

    try {
      result =
        SDK.address.isZeroAddress(formatAddress(address, 'hex')) ||
        address === SDK.CONST.ZERO_ADDRESS_HEX ||
        address === '0x0';
    } catch (e) {}

    return result;
  },
  'isZeroAddress',
);

export const isAccountAddress = addressHandlerWrapper(
  async (address: string, space: string): Promise<boolean> => {
    if (space === 'core') {
      return (
        getCoreAddressInfo(address)?.type === 'user' || isZeroAddress(address)
      );
    }
    if (space === 'evm') {
      try {
        return (await getEvmAddressType(address)) === 'account';
      } catch (e) {
        throw e;
      }
    }
    return false;
  },
  'isAccountAddress',
);

export const isCoreContractAddress = addressHandlerWrapper(
  (address: string): boolean => {
    return (
      isBase32Address(address) &&
      (getCoreAddressInfo(address)?.type === 'contract' ||
        isInnerContractAddress(address))
    );
  },
  'isCoreContractAddress',
);

/**
 * @deprecated
 */
export const isContractAddress = (address: string): boolean => {
  return isCoreContractAddress(address);
};

export const isEvmContractAddress = addressHandlerWrapper(
  async (address: string): Promise<boolean> => {
    try {
      return (await getEvmAddressType(address)) === 'contract';
    } catch (e) {
      throw e;
    }
  },
  'isEvmContractAddress',
);

export const isInnerContractAddress = addressHandlerWrapper(
  (address: string): boolean => {
    let result = false;

    try {
      result = SDK.address.isInternalContractAddress(
        formatAddress(address, 'hex'),
      );
    } catch (e) {}

    return result;
  },
  'isInnerContractAddress',
);

// address start with 0x0, not valid internal contract, but fullnode support
export const isSpecialAddress = addressHandlerWrapper(
  (address: string): boolean => {
    let result =
      getCoreAddressInfo(address)?.type === 'builtin' &&
      !isInnerContractAddress(address);

    return result;
  },
  'isSpecialAddress',
);

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

/**
 * Only evm address type
 */
export const getEvmAddressType = addressHandlerWrapper(
  async (address: string): Promise<string> => {
    try {
      const account: any = await getAccount(address);
      if (isContractCodeHashEmpty(account.codeHash)) {
        return 'account';
      }
      return 'contract';
    } catch (e) {
      console.log('getEvmAddressType error: ', e);
      throw e;
    }
  },
  'getEvmAddressType',
);

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
    let result = null;

    try {
      if (isCfxHexAddress(address)) {
        const base32Address = formatAddress(address, 'base32');
        result = SDK.address.decodeCfxAddress(base32Address);
      } else if (isBase32Address(address)) {
        result = SDK.address.decodeCfxAddress(address);
      }
    } catch (e) {}

    return result;
  },
  'getCoreAddressInfo',
);

export const formatAddress = addressHandlerWrapper(
  (address: string, outputType = 'base32') => {
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

    return result;
  },
  'formatAddress',
);

// Omit specification judgment: test environment cfxtest:....xxxx, production environment cfx:....xxxx,
export const abbreviateString = (str: string) => {
  const isHex = str.startsWith('0x');
  const isCfxtest = str.startsWith('cfxtest');
  const prefixNum = isHex ? 6 : isCfxtest ? 11 : 7;
  const suffixNum = isHex ? 4 : isCfxtest ? 4 : 8;

  if (str.length > 7) {
    return `${str.slice(0, prefixNum)}...${str.slice(-suffixNum)}`;
  }
  return str;
};

export const convertLink = ({
  link,
  type,
  hrefAddress,
  cfxAddress,
}: RenderAddressProps) => {
  if (typeof link === 'string') {
    return link;
  }

  const url = hrefAddress || cfxAddress;

  if (url) {
    if (window.location.pathname.includes('/address/' + url)) {
      return false;
    }

    return `/${type === 'pow' ? 'address' : 'pos/accounts'}/${url}`;
  }

  return false;
};
