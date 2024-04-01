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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const CSPACE_MAINNET_CONFIG = __importStar(require("./cspace/mainnet"));
const CSPACE_TESTNET_CONFIG = __importStar(require("./cspace/testnet"));
const CSPACE_DEVNET_CONFIG = __importStar(require("./cspace/devnet"));
const ESPACE_MAINNET_CONFIG = __importStar(require("./espace/mainnet"));
const ESPACE_TESTNET_CONFIG = __importStar(require("./espace/testnet"));
const ESPACE_DEVNET_CONFIG = __importStar(require("./espace/devnet"));
const BSPACE_MAINNET_CONFIG = __importStar(require("./bspace/mainnet"));
const BSPACE_TESTNET_CONFIG = __importStar(require("./bspace/testnet"));
const BSPACE_DEVNET_CONFIG = __importStar(require("./bspace/devnet"));
const env_constants_1 = require("./env-constants");
const DEFAULT_NETWORK_CONFIG = ESPACE_MAINNET_CONFIG;
const ENV_CONFIG = (() => {
    if (env_constants_1.IS_CSPACE_MAINNET) {
        return CSPACE_MAINNET_CONFIG;
    }
    else if (env_constants_1.IS_CSPACE_TESTNET) {
        return CSPACE_TESTNET_CONFIG;
    }
    else if (env_constants_1.IS_CSPACE_DEVNET) {
        return CSPACE_DEVNET_CONFIG;
    }
    if (env_constants_1.IS_ESPACE_MAINNET) {
        return ESPACE_MAINNET_CONFIG;
    }
    else if (env_constants_1.IS_ESPACE_TESTNET) {
        return ESPACE_TESTNET_CONFIG;
    }
    else if (env_constants_1.IS_ESPACE_DEVNET) {
        return ESPACE_DEVNET_CONFIG;
    }
    if (env_constants_1.IS_BSPACE_MAINNET) {
        return BSPACE_MAINNET_CONFIG;
    }
    else if (env_constants_1.IS_BSPACE_TESTNET) {
        return BSPACE_TESTNET_CONFIG;
    }
    else if (env_constants_1.IS_BSPACE_DEVNET) {
        return BSPACE_DEVNET_CONFIG;
    }
    console.warn('Unknown env');
    return DEFAULT_NETWORK_CONFIG;
})();
__exportStar(require("./env-constants"), exports);
__exportStar(require("./types"), exports);
exports.default = ENV_CONFIG;
