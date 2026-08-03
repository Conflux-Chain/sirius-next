import type {
  Abi,
  AbiStateMutability,
  AbiParameter,
  AbiItem,
  PublicClient as EVMPublicClient,
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
import type { PublicClient as CorePublicClient } from 'cive';
import { NETWORK_ID } from './constants';
import { getEnvConfig } from '../store';
import {
  decodeErrorResult as decodeCoreErrorResult,
  defineChain as defineCoreChain,
} from './cive-plugins';
import { Space } from './types';

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

export const estimateGas = async ({
  to,
  data,
  value,
  account,
  space,
}: {
  value?: string;
  account?: string;
  data?: Hex;
  to?: string;
  space: Space;
}) => {
  const publicClient = getPublicClient(space);
  if (space === 'core') {
    const res = await (
      publicClient as CorePublicClient
    ).estimateGasAndCollateral({
      to: to as any,
      data,
      value: value ? BigInt(value) : undefined,
      account: account as any,
    });
    return res.gasLimit;
  }
  return (publicClient as EVMPublicClient).estimateGas({
    to: to as Hex,
    data,
    value: value ? BigInt(value) : undefined,
    account: account as Hex,
  });
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
