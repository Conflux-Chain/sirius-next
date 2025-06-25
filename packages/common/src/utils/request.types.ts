export interface BaseContractInfo {
  address?: string;
  balance?: string;
  nonce?: string;
  codeHash?: string;
  stakingBalance?: string;
  collateralForStorage?: string;
  accumulatedInterestReturn?: string;
  admin?: string;
  cfxTransferTab?: number;
  erc20TransferTab?: number;
  erc721TransferTab?: number;
  erc1155TransferTab?: number;
  nftAssetTab?: number;
  minedBlockTab?: number;
  sponsor?: {
    sponsorForGas?: string;
    sponsorForCollateral?: string;
    sponsorGasBound?: string;
    sponsorBalanceForGas?: string;
    sponsorBalanceForCollateral?: string;
    availableStoragePoints?: string;
    usedStoragePoints?: string;
  };
  epochNumber?: number;
  timestamp?: number;
  transactionHash?: string;
  from?: string;
  contractFactory?: string;
  hex40id?: number;
  name?: string;
  website?: string;
  verify?: {
    exactMatch?: boolean;
  };
  proxy?: Record<string, unknown>;
  beacon?: Record<string, unknown>;
  implementation?: Record<string, unknown>;
  destroy?: {
    status?: number;
    message?: string;
  };
  isRegistered?: boolean;
  accountInfo?: {
    total?: number;
    map?: Record<string, unknown>;
  };
}
