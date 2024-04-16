import SDK from 'js-conflux-sdk';

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
      return isCfxHexAddress(address);
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

export function isAccountAddress(address: string): boolean {
  return getAddressInfo(address)?.type === 'user' || isZeroAddress(address);
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

export const formatAddress = (
  address: string,
  outputType = 'base32', // base32 or hex
): string => {
  return '';
};
