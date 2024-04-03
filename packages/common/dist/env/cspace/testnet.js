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
const logo_testnet_svg_1 = __importDefault(require("../../images/cspace/logo-testnet.svg"));
__exportStar(require("./base"), exports);
const translation_json_1 = __importDefault(require("./locales/en/translation.json"));
const translation_json_2 = __importDefault(require("./locales/zh_cn/translation.json"));
const translationForDotNet_json_1 = __importDefault(require("./locales/zh_cn/translationForDotNet.json"));
const utils_1 = require("../../utils");
const ENV_LOCALES_EN = translation_json_1.default;
exports.ENV_LOCALES_EN = ENV_LOCALES_EN;
const ENV_LOCALES_CN = utils_1.HIDE_IN_DOT_NET ? translationForDotNet_json_1.default : translation_json_2.default;
exports.ENV_LOCALES_CN = ENV_LOCALES_CN;
// TODO-core
exports.ENV_NETWORK_ID = 1029;
exports.ENV_NETWORK_TYPE = types_1.NETWORK_TYPES.CORE_TESTNET;
// TODO-core
exports.ENV_API_HOST = env_constants_1.API_HOST_MAP.openAPIHost ||
    (env_constants_1.IS_STAGE
        ? `https://api-testnet-stage.confluxscan${env_constants_1.DOMAIN}`
        : `https://api-testnet.confluxscan${env_constants_1.DOMAIN}`);
exports.ENV_CORE_API_HOST = env_constants_1.API_HOST_MAP.secondaryOpenAPIHost ||
    (env_constants_1.IS_STAGE
        ? `https://api-testnet-stage.confluxscan${env_constants_1.DOMAIN}`
        : `https://api-testnet.confluxscan${env_constants_1.DOMAIN}`);
exports.ENV_CORE_SCAN_HOST = env_constants_1.API_HOST_MAP.secondaryBackendAPIHost ||
    (env_constants_1.IS_STAGE
        ? `https://testnet-stage.confluxscan${env_constants_1.DOMAIN}`
        : `https://testnet.confluxscan${env_constants_1.DOMAIN}`);
// TODO-core
exports.ENV_RPC_SERVER = env_constants_1.API_HOST_MAP.rpcHost || 'https://test.confluxrpc.com';
// TODO-core
exports.ENV_WALLET_CONFIG = {
    chainId: exports.ENV_NETWORK_ID,
    chainName: 'coreSpace Testnet',
    rpcUrls: ['https://test.confluxrpc.com'],
    blockExplorerUrls: ['https://testnet.confluxscan.io/'],
    nativeCurrency: {
        name: 'Conflux',
        symbol: 'CFX',
        decimals: 18,
    },
};
exports.ENV_OPEN_API_HOST = env_constants_1.API_HOST_MAP.openAPIHost ||
    (env_constants_1.IS_STAGE
        ? `https://api-testnet-stage.confluxscan${env_constants_1.DOMAIN}`
        : `https://api-testnet.confluxscan${env_constants_1.DOMAIN}`);
exports.ENV_LOGO = logo_testnet_svg_1.default;
exports.ENV_FC_ADDRESS = 'cfxtest:achteu1f777f1j1s8s4tvsx5vk5vcbrn4ykxa0fzg1';
exports.ENV_FC_EXCHANGE_ADDRESS = 'cfxtest:acf6wwargxpp9ddfe7rnagf2ty9gsxs54uptst589y';
exports.ENV_FC_EXCHANGE_INTEREST_ADDRESS = 'cfxtest:acadrvdd07u69hazg0nkjkpdetvyc5wma6put8949d';
exports.ENV_CROSS_SPACE_ADDRESS = 'cfxtest:aaejuaaaaaaaaaaaaaaaaaaaaaaaaaaaa2eaeg85p5';
exports.ENV_ENS_REGISTRY_ADDRESS = 'cfxtest:acemru7fu1u8brtyn3hrtae17kbcd4pd9u2m761bta';
exports.ENV_ENS_PUBLIC_RESOLVER_ADDRESS = 'cfxtest:acbfyf69zaxau5a23w10dgyrmb0hrz4p9pewn6sejp';
exports.ENV_ENS_REVERSE_REGISTRAR_ADDRESS = 'cfxtest:acfarpzehntpre0thg8x7dp0ajw4ms328pe1mm17vd';
