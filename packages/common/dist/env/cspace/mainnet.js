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
exports.ENV_ENS_REVERSE_REGISTRAR_ADDRESS = exports.ENV_ENS_PUBLIC_RESOLVER_ADDRESS = exports.ENV_ENS_REGISTRY_ADDRESS = exports.ENV_CROSS_SPACE_ADDRESS = exports.ENV_FC_EXCHANGE_INTEREST_ADDRESS = exports.ENV_FC_EXCHANGE_ADDRESS = exports.ENV_FC_ADDRESS = exports.ENV_LOGO = exports.ENV_OPEN_API_HOST = exports.ENV_WALLET_CONFIG = exports.ENV_RPC_SERVER = exports.ENV_CORE_SCAN_HOST = exports.ENV_CORE_API_HOST = exports.ENV_API_HOST = exports.ENV_NETWORK_TYPE = exports.ENV_NETWORK_ID = exports.ENV_LOCALES_CN = exports.ENV_LOCALES_EN = void 0;
const env_constants_1 = require("../env-constants");
const types_1 = require("../types");
const logo_svg_1 = __importDefault(require("../../images/cspace/logo.svg"));
__exportStar(require("./base"), exports);
const translation_json_1 = __importDefault(require("./locales/en/translation.json"));
const translation_json_2 = __importDefault(require("./locales/zh_cn/translation.json"));
const ENV_LOCALES_EN = translation_json_1.default;
exports.ENV_LOCALES_EN = ENV_LOCALES_EN;
console.log("ENV_LOCALES_EN:", ENV_LOCALES_EN);
const ENV_LOCALES_CN = translation_json_2.default;
exports.ENV_LOCALES_CN = ENV_LOCALES_CN;
// TODO-core
exports.ENV_NETWORK_ID = 1030;
exports.ENV_NETWORK_TYPE = types_1.NETWORK_TYPES.CORE_MAINNET;
// TODO-core
exports.ENV_API_HOST = env_constants_1.API_HOST_MAP.openAPIHost ||
    (env_constants_1.IS_STAGE
        ? `https://api-stage.confluxscan${env_constants_1.DOMAIN}`
        : `https://api.confluxscan${env_constants_1.DOMAIN}`);
exports.ENV_CORE_API_HOST = env_constants_1.API_HOST_MAP.secondaryOpenAPIHost ||
    (env_constants_1.IS_STAGE
        ? `https://api-stage.confluxscan${env_constants_1.DOMAIN}`
        : `https://api.confluxscan${env_constants_1.DOMAIN}`);
exports.ENV_CORE_SCAN_HOST = env_constants_1.API_HOST_MAP.secondaryBackendAPIHost ||
    (env_constants_1.IS_STAGE
        ? `https://www-stage.confluxscan${env_constants_1.DOMAIN}`
        : `https://www.confluxscan${env_constants_1.DOMAIN}`);
// TODO-core
exports.ENV_RPC_SERVER = env_constants_1.API_HOST_MAP.rpcHost || 'https://main.confluxrpc.com';
// TODO-core
exports.ENV_WALLET_CONFIG = {
    chainId: exports.ENV_NETWORK_ID,
    chainName: 'Conflux coreSpace',
    rpcUrls: ['https://main.confluxrpc.com'],
    blockExplorerUrls: ['https://core.confluxscan.io/'],
    nativeCurrency: {
        name: 'Conflux',
        symbol: 'CFX',
        decimals: 18,
    },
};
exports.ENV_OPEN_API_HOST = env_constants_1.API_HOST_MAP.openAPIHost ||
    (env_constants_1.IS_STAGE
        ? `https://api-stage.confluxscan${env_constants_1.DOMAIN}`
        : `https://api.confluxscan${env_constants_1.DOMAIN}`);
exports.ENV_LOGO = logo_svg_1.default;
exports.ENV_FC_ADDRESS = 'cfx:achc8nxj7r451c223m18w2dwjnmhkd6rxawrvkvsy2';
exports.ENV_FC_EXCHANGE_ADDRESS = 'cfx:acdrd6ahf4fmdj6rgw4n9k4wdxrzfe6ex6jc7pw50m';
exports.ENV_FC_EXCHANGE_INTEREST_ADDRESS = 'cfx:acag8dru4527jb1hkmx187w0c7ymtrzkt2schxg140';
exports.ENV_CROSS_SPACE_ADDRESS = 'cfx:aaejuaaaaaaaaaaaaaaaaaaaaaaaaaaaa2sn102vjv';
exports.ENV_ENS_REGISTRY_ADDRESS = 'cfx:acemru7fu1u8brtyn3hrtae17kbcd4pd9uwbspvnnm';
exports.ENV_ENS_PUBLIC_RESOLVER_ADDRESS = 'cfx:acasaruvgf44ss67pxzfs1exvj7k2vyt863f72n6up';
exports.ENV_ENS_REVERSE_REGISTRAR_ADDRESS = 'cfx:acfarpzehntpre0thg8x7dp0ajw4ms328ps634v1zk';
