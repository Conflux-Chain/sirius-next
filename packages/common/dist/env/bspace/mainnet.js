"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV_LOGO = exports.ENV_WALLET_CONFIG = exports.ENV_RPC_SERVER = exports.ENV_CORE_SCAN_HOST = exports.ENV_CORE_API_HOST = exports.ENV_API_HOST = exports.ENV_NETWORK_TYPE = exports.ENV_NETWORK_ID = exports.ENV_LOCALES_CN = exports.ENV_LOCALES_EN = void 0;
const env_constants_1 = require("../env-constants");
const types_1 = require("../types");
const logo_svg_1 = __importDefault(require("../../images/bspace/logo.svg"));
__exportStar(require("./base"), exports);
var translation_json_1 = require("./locales/en/translation.json");
Object.defineProperty(exports, "ENV_LOCALES_EN", { enumerable: true, get: function () { return __importDefault(translation_json_1).default; } });
var translation_json_2 = require("./locales/zh_cn/translation.json");
Object.defineProperty(exports, "ENV_LOCALES_CN", { enumerable: true, get: function () { return __importDefault(translation_json_2).default; } });
// TODO-btc
exports.ENV_NETWORK_ID = 1030;
exports.ENV_NETWORK_TYPE = types_1.NETWORK_TYPES.BTC_MAINNET;
// TODO-btc
exports.ENV_API_HOST = env_constants_1.API_HOST_MAP.openAPIHost ||
    (env_constants_1.IS_STAGE
        ? `https://evmapi-stage.confluxscan${env_constants_1.DOMAIN}`
        : `https://evmapi.confluxscan${env_constants_1.DOMAIN}`);
exports.ENV_CORE_API_HOST = env_constants_1.API_HOST_MAP.secondaryOpenAPIHost ||
    (env_constants_1.IS_STAGE
        ? `https://api-stage.confluxscan${env_constants_1.DOMAIN}`
        : `https://api.confluxscan${env_constants_1.DOMAIN}`);
exports.ENV_CORE_SCAN_HOST = env_constants_1.API_HOST_MAP.secondaryBackendAPIHost ||
    (env_constants_1.IS_STAGE
        ? `https://www-stage.confluxscan${env_constants_1.DOMAIN}`
        : `https://www.confluxscan${env_constants_1.DOMAIN}`);
// TODO-btc
exports.ENV_RPC_SERVER = env_constants_1.API_HOST_MAP.rpcHost || 'https://evm-cfxbridge.confluxrpc.com';
// TODO-btc
exports.ENV_WALLET_CONFIG = {
    chainId: exports.ENV_NETWORK_ID,
    chainName: 'Conflux bSpace',
    rpcUrls: ['https://evm.confluxrpc.com'],
    blockExplorerUrls: ['https://btc.confluxscan.io/'],
    nativeCurrency: {
        name: 'Conflux',
        symbol: 'CFX',
        decimals: 18,
    },
};
exports.ENV_LOGO = logo_svg_1.default;
