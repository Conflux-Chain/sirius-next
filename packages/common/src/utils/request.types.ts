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
  beacon?: {
    address?: string;
    verify?: {
      exactMatch?: boolean;
    };
  };
  implementation?: {
    address?: string;
    verify?: {
      exactMatch?: boolean;
    };
  };
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

export interface DetectAccountTypeResponse {
  isContract: boolean;
  delegatedTo: `0x${string}` | '' | null;
  extraMessage: string;
}

export interface TransferItemResponse {
  epochNumber: number;
  transactionHash: string;
  transactionTraceIndex: number;
  from: string;
  to: string;
  value: string;
  type: string;
  timestamp: number;
  syncTimestamp: number;
  transactionLogIndex: null;
  fromContractInfo?: {
    address: string;
    isVirtual?: boolean;
    verify?: {
      result?: number;
    };
  };
  fromTokenInfo?: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    tokenType: string;
  };
  toContractInfo?: {
    address: string;
    isVirtual?: boolean;
    verify?: {
      result?: number;
    };
  };
  toTokenInfo?: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    tokenType: string;
  };
  transferType?: string;
}

export interface MethodAbiItemResponse {
  fullName: string;
  formatWithArg?: string;
}
