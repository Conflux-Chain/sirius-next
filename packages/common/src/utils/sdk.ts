import type {
  Abi,
  AbiStateMutability,
  AbiParameter,
  AbiItem,
  PublicClient as EVMPublicClient,
  BlockTag,
  RpcAuthorizationList,
  RpcTransactionRequest,
} from 'viem';
import {
  defineChain as defineEVMChain,
  createPublicClient as createPublicEVMClient,
  encodeFunctionData as encodeEVMFunctionData,
  decodeFunctionData as decodeEVMFunctionData,
  decodeFunctionResult as decodeEVMFunctionResult,
  decodeErrorResult as decodeEVMErrorResult,
  getAbiItem,
  http as evmHttp,
  Hex,
} from 'viem';
import {
  http as coreHttp,
  createPublicClient as createPublicCoreClient,
  encodeFunctionData as encodeCoreFunctionData,
  decodeFunctionData as decodeCoreFunctionData,
  decodeFunctionResult as decodeCoreFunctionResult,
} from 'cive';
import type {
  PublicClient as CorePublicClient,
  Address as CoreAddress,
} from 'cive';
import { NETWORK_ID } from './constants';
import { getEnvConfig } from '../store';
import {
  decodeErrorResult as decodeCoreErrorResult,
  defineChain as defineCoreChain,
} from './cive-plugins';
import { Space } from './types';
import { normalizeTransactionLists } from './transactionLists';

const clientMap: Record<Space, EVMPublicClient | CorePublicClient | null> = {
  evm: null,
  core: null,
};

function getPublicClient(space: 'evm' | 'core') {
  const ENV_CONFIG = getEnvConfig();
  const config = ENV_CONFIG.ENV_WALLET_CONFIG || {
    chainId: ENV_CONFIG.ENV_NETWORK_ID,
    chainName: 'Conflux Network',
    rpcUrls: [ENV_CONFIG.ENV_RPC_SERVER],
    blockExplorerUrls: [window.location.origin],
    nativeCurrency: {
      name: 'Conflux',
      symbol: 'CFX',
      decimals: 18,
    },
  };
  if (!clientMap[space]) {
    clientMap[space] =
      space === 'core'
        ? createPublicCoreClient({
            chain: defineCoreChain({
              id: NETWORK_ID,
              name: config.chainName,
              rpcUrls: {
                default: {
                  http: config.rpcUrls,
                },
              },
              nativeCurrency: config.nativeCurrency,
            }),
            transport: coreHttp(),
          })
        : createPublicEVMClient({
            chain: defineEVMChain({
              id: NETWORK_ID,
              name: config.chainName,
              rpcUrls: {
                default: {
                  http: config.rpcUrls,
                },
              },
              nativeCurrency: config.nativeCurrency,
            }),
            transport: evmHttp(),
          });
  }
  return clientMap[space]!;
}

export type CoreEstimateGasTag =
  | NonNullable<
      Parameters<CorePublicClient['estimateGasAndCollateral']>[0]['epochTag']
    >
  | Hex;

const getCoreEstimateEpoch = (
  tag?: CoreEstimateGasTag,
): Pick<
  Parameters<CorePublicClient['estimateGasAndCollateral']>[0],
  'epochTag' | 'epochNumber'
> => {
  if (tag === undefined) return {};
  if (
    tag === 'earliest' ||
    tag === 'latest_checkpoint' ||
    tag === 'latest_confirmed' ||
    tag === 'latest_state'
  ) {
    return { epochTag: tag };
  }
  if (typeof tag !== 'string' || !/^0x[0-9a-fA-F]+$/.test(tag)) {
    throw new Error('Unsupported Core gas estimation tag');
  }
  const epochNumber = BigInt(tag);
  // cive treats epochNumber: 0n as absent and falls back to latest_state.
  return epochNumber === 0n ? { epochTag: 'earliest' } : { epochNumber };
};

export type EstimateGasParams = {
  value?: string;
  account?: string;
  data?: Hex;
  to?: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  // Core addresses use base32; EVM addresses use hex.
  accessList?: readonly {
    address: string;
    storageKeys: readonly Hex[];
  }[];
} & (
  | {
      space: 'evm';
      authorizationList?: RpcAuthorizationList;
      tag?: BlockTag | Hex;
    }
  | {
      space: 'core';
      authorizationList?: never;
      tag?: CoreEstimateGasTag;
    }
  | {
      space: Space;
      authorizationList?: never;
      tag?: never;
    }
);

export const estimateGas = async ({
  to,
  data,
  value,
  account,
  space,
  accessList,
  authorizationList,
  tag,
  gasPrice,
  maxFeePerGas,
  maxPriorityFeePerGas,
}: EstimateGasParams) => {
  if (space === 'core' && authorizationList !== undefined) {
    throw new Error(
      'Core Space gas estimation does not support authorizationList',
    );
  }
  const publicClient = getPublicClient(space);
  if (space === 'core') {
    // Leave conflicting Core fee combinations to the node.
    // cive's transaction union otherwise rejects mixing legacy/1559 fields.
    const res = await (
      publicClient as CorePublicClient
    ).estimateGasAndCollateral({
      ...getCoreEstimateEpoch(tag),
      to: to as any,
      data,
      value: value ? BigInt(value) : undefined,
      account: account as any,
      ...(gasPrice !== undefined && { gasPrice: BigInt(gasPrice) }),
      ...(maxFeePerGas !== undefined && { maxFeePerGas: BigInt(maxFeePerGas) }),
      ...(maxPriorityFeePerGas !== undefined && {
        maxPriorityFeePerGas: BigInt(maxPriorityFeePerGas),
      }),
      ...(accessList !== undefined && {
        accessList: accessList.map(entry => ({
          address: entry.address as CoreAddress,
          storageKeys: [...entry.storageKeys],
        })),
      }),
    } as Parameters<CorePublicClient['estimateGasAndCollateral']>[0]);
    return res.gasLimit;
  }
  const lists = normalizeTransactionLists({
    accessList,
    authorizationList,
    to,
  });
  if (authorizationList !== undefined) {
    const toQuantity = (value?: string): Hex | undefined =>
      value === undefined ? undefined : `0x${BigInt(value).toString(16)}`;
    // Keep RPC authorization quantities as hex, including uint64 nonces that
    // cannot be represented exactly by viem's high-level number-based type.
    const gas = await (publicClient as EVMPublicClient).request({
      method: 'eth_estimateGas',
      params: [
        {
          from: account as Hex | undefined,
          to: to as Hex | undefined,
          data,
          value: toQuantity(value),
          gasPrice: toQuantity(gasPrice),
          maxFeePerGas: toQuantity(maxFeePerGas),
          maxPriorityFeePerGas: toQuantity(maxPriorityFeePerGas),
          ...lists,
        } as RpcTransactionRequest,
        tag ?? 'latest',
      ],
    });
    return BigInt(gas);
  }
  // Preserve viem's request validation and error handling.
  return (publicClient as EVMPublicClient).estimateGas({
    to: to as Hex,
    data,
    value: value ? BigInt(value) : undefined,
    account: account as Hex,
    ...(lists.accessList !== undefined && { accessList: lists.accessList }),
    ...(gasPrice !== undefined && { gasPrice: BigInt(gasPrice) }),
    ...(maxFeePerGas !== undefined && { maxFeePerGas: BigInt(maxFeePerGas) }),
    ...(maxPriorityFeePerGas !== undefined && {
      maxPriorityFeePerGas: BigInt(maxPriorityFeePerGas),
    }),
    ...(tag === undefined
      ? {}
      : tag.startsWith('0x')
        ? { blockNumber: BigInt(tag) }
        : { blockTag: tag as BlockTag }),
  } as Parameters<EVMPublicClient['estimateGas']>[0]);
};

export const simulateContract = ({
  address,
  functionName,
  args,
  abi,
  value,
  account,
  space,
}: {
  value?: string;
  account?: string;
  functionName: string;
  address: string;
  args?: string[];
  abi: Abi;
  space: Space;
}) => {
  const publicClient = getPublicClient(space);
  if (space === 'core') {
    return (publicClient as CorePublicClient)?.simulateContract({
      address: address as any,
      functionName,
      args,
      abi,
      value: value ? BigInt(value) : undefined,
      account: account as any,
    });
  }
  return (publicClient as EVMPublicClient)?.simulateContract({
    address: address as Hex,
    functionName,
    args,
    abi,
    value: value ? BigInt(value) : undefined,
    account: account as Hex,
  });
};

export const encodeFunctionData = ({
  args,
  abi,
  space,
}: {
  args: string[];
  abi: Abi;
  space: Space;
}): string => {
  if (space === 'core') {
    return encodeCoreFunctionData({
      args,
      abi,
    });
  } else {
    return encodeEVMFunctionData({
      args,
      abi,
    });
  }
};

export const decodeFunctionData = ({
  data,
  abi,
  space,
}: {
  data: Hex;
  abi: Abi;
  space: Space;
}): {
  args: readonly unknown[] | undefined;
  functionName: string;
} => {
  if (space === 'core') {
    return decodeCoreFunctionData({
      data,
      abi,
      networkId: NETWORK_ID,
    });
  } else {
    return decodeEVMFunctionData({
      data,
      abi,
    });
  }
};

export const decodeFunctionResult = ({
  data,
  abi,
  functionName,
  space,
}: {
  data: Hex;
  functionName: string;
  abi: Abi;
  space: Space;
}): unknown => {
  if (space === 'core') {
    return decodeCoreFunctionResult({
      data,
      functionName,
      abi,
      networkId: NETWORK_ID,
    });
  } else {
    return decodeEVMFunctionResult({
      data,
      functionName,
      abi,
    });
  }
};

export const decodeErrorResult = ({
  data,
  abi,
  space,
}: {
  data: Hex;
  abi: Abi;
  space: Space;
}): {
  abiItem: AbiItem;
  args: readonly unknown[] | undefined;
  errorName: string;
} => {
  if (space === 'core') {
    return decodeCoreErrorResult({
      data,
      abi,
    });
  } else {
    return decodeEVMErrorResult({
      data,
      abi,
    });
  }
};

export { getAbiItem };
export type { AbiParameter, AbiItem, AbiStateMutability };
export type AbiError = AbiItem & { type: 'error' };
export type AbiFunctionWithoutGas = Omit<AbiItem & { type: 'function' }, 'gas'>;
