"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_HOST_MAP = exports.STAGE_FLAG = exports.IS_DEV = exports.IS_STAGE = exports.IS_DEVNET = exports.IS_TESTNET = exports.IS_MAINNET = exports.IS_CSPACE = exports.IS_BSPACE = exports.IS_ESPACE = exports.IS_BSPACE_MAINNET = exports.IS_BSPACE_TESTNET = exports.IS_BSPACE_DEVNET = exports.IS_ESPACE_MAINNET = exports.IS_ESPACE_TESTNET = exports.IS_ESPACE_DEVNET = exports.IS_CSPACE_MAINNET = exports.IS_CSPACE_TESTNET = exports.IS_CSPACE_DEVNET = exports.DOMAIN = exports.IS_FOREIGN_HOST = void 0;
const constants_1 = require("../utils/constants");
exports.IS_FOREIGN_HOST = /.io$/.test(window.location.host);
exports.DOMAIN = exports.IS_FOREIGN_HOST ? '.io' : '.net';
exports.IS_CSPACE_DEVNET = process.env.REACT_APP_CFX_DEVNET === 'true' ||
    /^net8888[.-]/.test(window.location.host);
exports.IS_CSPACE_TESTNET = process.env.REACT_APP_CFX_TESTNET === 'true' ||
    /^testnet[.-]/.test(window.location.hostname);
exports.IS_CSPACE_MAINNET = process.env.REACT_APP_CFX_MAINNET === 'true' ||
    /^www[.-]/.test(window.location.hostname);
exports.IS_ESPACE_DEVNET = process.env.REACT_APP_EVM_DEVNET === 'true' ||
    /^net[\d]+eth/.test(window.location.host);
exports.IS_ESPACE_TESTNET = process.env.REACT_APP_EVM_TESTNET === 'true' ||
    /^evmtestnet[.-]/.test(window.location.hostname);
exports.IS_ESPACE_MAINNET = process.env.REACT_APP_EVM_MAINNET === 'true' ||
    /^evm[.-]/.test(window.location.hostname);
exports.IS_BSPACE_DEVNET = process.env.REACT_APP_BTC_DEVNET === 'true' ||
    /^net[\d]+btc/.test(window.location.host);
exports.IS_BSPACE_TESTNET = process.env.REACT_APP_BTC_TESTNET === 'true' ||
    /^btctestnet[.-]/.test(window.location.hostname);
exports.IS_BSPACE_MAINNET = process.env.REACT_APP_BTC_MAINNET === 'true' ||
    /^btc[.-]/.test(window.location.hostname);
exports.IS_ESPACE = exports.IS_ESPACE_MAINNET || exports.IS_ESPACE_TESTNET || exports.IS_ESPACE_DEVNET;
exports.IS_BSPACE = exports.IS_BSPACE_MAINNET || exports.IS_BSPACE_TESTNET || exports.IS_BSPACE_DEVNET;
exports.IS_CSPACE = exports.IS_CSPACE_MAINNET || exports.IS_CSPACE_TESTNET || exports.IS_CSPACE_DEVNET;
exports.IS_MAINNET = exports.IS_ESPACE_MAINNET || exports.IS_BSPACE_MAINNET || exports.IS_CSPACE_MAINNET;
exports.IS_TESTNET = exports.IS_ESPACE_TESTNET || exports.IS_BSPACE_TESTNET || exports.IS_CSPACE_TESTNET;
exports.IS_DEVNET = exports.IS_ESPACE_DEVNET || exports.IS_BSPACE_DEVNET || exports.IS_CSPACE_DEVNET;
// only for dev and qa, use with caution
exports.IS_STAGE = process.env.REACT_APP_DEV === 'true';
exports.IS_DEV = process.env.NODE_ENV === 'development';
exports.STAGE_FLAG = exports.IS_STAGE ? '-stage' : '';
exports.API_HOST_MAP = (() => {
    try {
        const apis = localStorage.getItem(constants_1.LOCALSTORAGE_KEYS_MAP.apis) ?? '';
        return JSON.parse(apis);
    }
    catch (error) {
        return {};
    }
})();
