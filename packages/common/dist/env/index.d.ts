import * as CSPACE_MAINNET_CONFIG from './cspace/mainnet';
import * as CSPACE_TESTNET_CONFIG from './cspace/testnet';
import * as CSPACE_DEVNET_CONFIG from './cspace/devnet';
import * as ESPACE_MAINNET_CONFIG from './espace/mainnet';
import * as ESPACE_TESTNET_CONFIG from './espace/testnet';
import * as ESPACE_DEVNET_CONFIG from './espace/devnet';
import * as BSPACE_MAINNET_CONFIG from './bspace/mainnet';
import * as BSPACE_TESTNET_CONFIG from './bspace/testnet';
import * as BSPACE_DEVNET_CONFIG from './bspace/devnet';
declare const ENV_CONFIG: typeof CSPACE_MAINNET_CONFIG | typeof CSPACE_TESTNET_CONFIG | typeof CSPACE_DEVNET_CONFIG | typeof ESPACE_MAINNET_CONFIG | typeof ESPACE_TESTNET_CONFIG | typeof ESPACE_DEVNET_CONFIG | typeof BSPACE_MAINNET_CONFIG | typeof BSPACE_TESTNET_CONFIG | typeof BSPACE_DEVNET_CONFIG;
export * from './env-constants';
export * from './types';
export default ENV_CONFIG;
//# sourceMappingURL=index.d.ts.map