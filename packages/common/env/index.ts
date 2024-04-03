import * as CSPACE_MAINNET_CONFIG from './cspace/mainnet';
import * as CSPACE_TESTNET_CONFIG from './cspace/testnet';
import * as CSPACE_DEVNET_CONFIG from './cspace/devnet';

import * as ESPACE_MAINNET_CONFIG from './espace/mainnet';
import * as ESPACE_TESTNET_CONFIG from './espace/testnet';
import * as ESPACE_DEVNET_CONFIG from './espace/devnet';

import * as BSPACE_MAINNET_CONFIG from './bspace/mainnet';
import * as BSPACE_TESTNET_CONFIG from './bspace/testnet';
import * as BSPACE_DEVNET_CONFIG from './bspace/devnet';

import { LOCALSTORAGE_KEYS_MAP } from '../utils/constants';


import {
  IS_CSPACE_MAINNET,
  IS_CSPACE_TESTNET,
  IS_CSPACE_DEVNET,
  IS_ESPACE_MAINNET,
  IS_ESPACE_TESTNET,
  IS_ESPACE_DEVNET,
  IS_BSPACE_MAINNET,
  IS_BSPACE_TESTNET,
  IS_BSPACE_DEVNET,
} from './env-constants';

const DEFAULT_NETWORK_CONFIG = ESPACE_MAINNET_CONFIG;

const ENV_CONFIG:any = (() => {
  if (IS_CSPACE_MAINNET) {
    return CSPACE_MAINNET_CONFIG;
  } else if (IS_CSPACE_TESTNET) {
    return CSPACE_TESTNET_CONFIG;
  }else if (IS_CSPACE_DEVNET) {
    return CSPACE_DEVNET_CONFIG;
  }

  if (IS_ESPACE_MAINNET) {
    return ESPACE_MAINNET_CONFIG;
  } else if (IS_ESPACE_TESTNET) {
    return ESPACE_TESTNET_CONFIG;
  } else if (IS_ESPACE_DEVNET) {
    return ESPACE_DEVNET_CONFIG;
  }
  
  if (IS_BSPACE_MAINNET) {
    return BSPACE_MAINNET_CONFIG;
  } else if (IS_BSPACE_TESTNET) {
    return BSPACE_TESTNET_CONFIG;
  } else if (IS_BSPACE_DEVNET) {
    return BSPACE_DEVNET_CONFIG;
  }
  console.warn('Unknown env');
  return DEFAULT_NETWORK_CONFIG;
})();

export * from './env-constants';
export * from './types';
export default ENV_CONFIG;

export const IS_FOREIGN_HOST = /.io$/.test(window.location.host);
export const DOMAIN = IS_FOREIGN_HOST ? '.io' : '.net';

export const IS_STAGE = process.env.REACT_APP_DEV === 'true';

export const STAGE_FLAG = IS_STAGE ? '-stage' : '';
