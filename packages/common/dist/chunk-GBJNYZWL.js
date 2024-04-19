import {
  getAccount
} from "./chunk-PIWYBVLY.js";
import {
  getEnvConfig
} from "./chunk-W4ZISPJS.js";

// src/utils/address.ts
import SDK from "js-conflux-sdk";
import lodash from "lodash";
var ADDRESS_FUNC_CACHE = {};
var isPosAddress = (address) => {
  try {
    return address.startsWith("0x") && address.length === 66;
  } catch (e) {
    return false;
  }
};
var isCfxHexAddress = (address) => {
  const CACHE_KEY = `isCfxHexAddress(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY])
    return ADDRESS_FUNC_CACHE[CACHE_KEY];
  let result = false;
  try {
    result = SDK.address.isValidCfxHexAddress(address);
  } catch (e) {
  }
  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;
  return result;
};
var isBase32Address = (address) => {
  const CACHE_KEY = `isBase32Address(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY])
    return ADDRESS_FUNC_CACHE[CACHE_KEY];
  let result = false;
  try {
    result = SDK.address.isValidCfxAddress(address);
  } catch (e) {
  }
  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;
  return result;
};
var isSimplyBase32Address = (address) => {
  const CACHE_KEY = `isSimplyBase32Address(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY])
    return ADDRESS_FUNC_CACHE[CACHE_KEY];
  let result = false;
  try {
    result = SDK.address.isValidCfxAddress(address) && SDK.address.simplifyCfxAddress(address) === address;
  } catch (e) {
  }
  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;
  return result;
};
var isAddress = (address) => {
  try {
    if (address.startsWith("0x")) {
      return SDK.address.isValidHexAddress(address) || isZeroAddress(address);
    } else {
      return isBase32Address(address);
    }
  } catch (e) {
    return false;
  }
};
function isZeroAddress(address) {
  const CACHE_KEY = `isZeroAddress(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY])
    return ADDRESS_FUNC_CACHE[CACHE_KEY];
  let result = false;
  try {
    result = SDK.address.isZeroAddress(formatAddress(address, "hex")) || address === SDK.CONST.ZERO_ADDRESS_HEX || address === "0x0";
  } catch (e) {
  }
  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;
  return result;
}
async function isAccountAddress(address, space) {
  if (space === "core") {
    return getAddressInfo(address)?.type === "user" || isZeroAddress(address);
  }
  if (space === "evm") {
    try {
      return await getAddressType(address) === "account";
    } catch (e) {
      throw e;
    }
  }
  return false;
}
function isContractAddress(address) {
  return getAddressInfo(address)?.type === "contract";
}
function isInnerContractAddress(address) {
  const CACHE_KEY = `isInnerContractAddress(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY])
    return ADDRESS_FUNC_CACHE[CACHE_KEY];
  let result = false;
  try {
    result = SDK.address.isInternalContractAddress(
      formatAddress(address, "hex")
    );
  } catch (e) {
  }
  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;
  return result;
}
function isSpecialAddress(address) {
  const CACHE_KEY = `isSpecialAddress(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY])
    return ADDRESS_FUNC_CACHE[CACHE_KEY];
  let result = getAddressInfo(address)?.type === "builtin" && !isInnerContractAddress(address);
  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;
  return result;
}
function isContractCodeHashEmpty(codeHash) {
  return codeHash === "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470" || codeHash === "0x" || codeHash === "";
}
async function getAddressType(address) {
  try {
    const account = await getAccount(address);
    if (isContractCodeHashEmpty(account.codeHash)) {
      return "account";
    }
    return "contract";
  } catch (e) {
    console.log("getAddressType error: ", e);
    throw e;
  }
}
var getAddressInfo = (address) => {
  const CACHE_KEY = `getAddressInfo(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY])
    return ADDRESS_FUNC_CACHE[CACHE_KEY];
  let result = null;
  try {
    if (isCfxHexAddress(address)) {
      const base32Address = formatAddress(address, "base32");
      result = SDK.address.decodeCfxAddress(base32Address);
    } else if (isBase32Address(address)) {
      result = SDK.address.decodeCfxAddress(address);
    }
  } catch (e) {
  }
  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;
  return result;
};
var NETWORK_ID = (() => {
  const ENV_CONFIG = getEnvConfig();
  console.log(ENV_CONFIG);
  let networkId = ENV_CONFIG.ENV_NETWORK_ID;
  let cacheNetworkId = Number(
    localStorage.getItem("CONFLUX_SCAN_NETWORK_ID" /* networkId */)
  );
  if (lodash.isFinite(cacheNetworkId)) {
    networkId = Number(cacheNetworkId);
  }
  return networkId;
})();
var formatAddress = (address, outputType = "base32") => {
  const CACHE_KEY = `formatAddress(${address}, ${outputType})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY])
    return ADDRESS_FUNC_CACHE[CACHE_KEY];
  let result = address;
  try {
    if (outputType === "base32") {
      if (isCfxHexAddress(address)) {
        result = SDK.format.address(address, NETWORK_ID);
      } else if (isBase32Address(address)) {
        const reg = /(.*):(.*):(.*)/;
        if (typeof address === "string" && reg.test(address)) {
          result = address.replace(reg, "$1:$3").toLowerCase();
        }
      }
    } else if (outputType === "hex") {
      if (isAddress(address)) {
        if (outputType === "hex") {
          if (isBase32Address(address)) {
            result = SDK.format.hexAddress(address);
          } else {
            result = address;
          }
        } else if (outputType === "base32") {
          result = SDK.format.address(address, NETWORK_ID);
        } else {
          result = address;
        }
      } else if (isBase32Address(address)) {
        if (outputType === "hex") {
          result = SDK.format.hexAddress(address);
        } else if (outputType === "base32") {
          const reg = /(.*):(.*):(.*)/;
          let lowercaseAddress = address;
          if (typeof address === "string" && reg.test(address)) {
            lowercaseAddress = address.replace(reg, "$1:$3").toLowerCase();
          }
          result = lowercaseAddress;
        } else {
          result = address;
        }
      } else {
        result = address;
      }
    }
    ADDRESS_FUNC_CACHE[CACHE_KEY] = result;
    return result;
  } catch (error) {
  }
  return result;
};

export {
  ADDRESS_FUNC_CACHE,
  isPosAddress,
  isCfxHexAddress,
  isBase32Address,
  isSimplyBase32Address,
  isAddress,
  isZeroAddress,
  isAccountAddress,
  isContractAddress,
  isInnerContractAddress,
  isSpecialAddress,
  isContractCodeHashEmpty,
  getAddressType,
  getAddressInfo,
  NETWORK_ID,
  formatAddress
};
//# sourceMappingURL=chunk-GBJNYZWL.js.map