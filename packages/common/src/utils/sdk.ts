import type { Abi, AbiStateMutability, AbiParameter, AbiItem } from 'viem';
import {
  decodeFunctionData as decodeEVMFunctionData,
  decodeFunctionResult as decodeEVMFunctionResult,
  decodeErrorResult as decodeEVMErrorResult,
  getAbiItem,
  toFunctionSelector,
} from 'viem';
import {
  decodeFunctionData as decodeCoreFunctionData,
  decodeFunctionResult as decodeCoreFunctionResult,
  // TODO
  // decodeErrorResult as decodeCoreErrorResult,
} from 'cive';
import {
  decodeAbiParameters as decodeCoreAbiParameters,
  formatAbiItem as formatCoreAbiItem,
} from 'cive/utils';
import { NETWORK_ID } from './constants';

export const decodeFunctionData = ({
  data,
  abi,
  space,
}: {
  data: `0x${string}`;
  abi: Abi;
  space: 'evm' | 'core';
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
  data: `0x${string}`;
  functionName: string;
  abi: Abi;
  space: 'evm' | 'core';
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
  data: `0x${string}`;
  abi: Abi;
  space: 'evm' | 'core';
}): {
  abiItem: AbiItem;
  args: readonly unknown[] | undefined;
  errorName: string;
} => {
  if (space === 'core') {
    // cive not support decodeErrorResult method, temp solution
    if (data.length < 10 || !data.startsWith('0x'))
      throw new Error('Invalid data');
    const signature = data.slice(0, 10);

    const abiItem = abi.find(
      x =>
        x.type === 'error' &&
        signature === toFunctionSelector(formatCoreAbiItem(x)),
    );
    if (!abiItem)
      throw new Error(`not found abi item for error signature: ${signature}`);
    return {
      abiItem,
      args:
        'inputs' in abiItem && abiItem.inputs && abiItem.inputs.length > 0
          ? decodeCoreAbiParameters(
              abiItem.inputs,
              `0x${data.slice(10)}`,
              NETWORK_ID,
            )
          : undefined,
      errorName: (abiItem as { name: string }).name,
    };
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
