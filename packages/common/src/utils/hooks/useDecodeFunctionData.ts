import { useMemo } from 'react';
import {
  decodeFunctionData,
  decodeFunctionResult,
  getAbiItem,
} from 'src/utils/sdk';
import { useContractDetail } from './useContractDetail';
import { AbiFunctionWithoutGas } from './useTxTrace';
import { formatABI } from '..';

const fields = ['abi' as const];

const decodeFunctionDataByAbi = ({
  abi,
  input,
  output,
  space,
  success,
}: {
  input: `0x${string}`;
  output?: `0x${string}`;
  abi?: AbiFunctionWithoutGas[];
  space: 'evm' | 'core';
  success?: boolean;
}) => {
  const hasAbi = abi && abi.length > 0;
  if (!hasAbi) return null;
  try {
    const isReturnDataEmpty = !output || output === '0x';
    const methodID = input.slice(0, 10);
    const decodedParams = decodeFunctionData({
      abi: abi,
      data: input,
      space,
    });
    let decodedResults = success
      ? !isReturnDataEmpty
        ? decodeFunctionResult({
            abi: abi,
            functionName: decodedParams.functionName,
            data: output,
            space,
          })
        : undefined
      : output;
    const abiItem = getAbiItem({
      abi: abi,
      name: methodID,
    }) as AbiFunctionWithoutGas;
    const fullName = formatABI([abiItem])[0];

    return {
      decodedParams,
      decodedResults: Array.isArray(decodedResults)
        ? (decodedResults as unknown[])
        : [decodedResults],
      abiItem,
      fullName: fullName,
    };
  } catch (error) {
    console.log('decode function data and result error', error);
    return null;
  }
};

export const useDecodeFunctionData = ({
  to,
  abi: outerAbi,
  implementation: _implementation,
  input,
  output,
  space,
  success,
}: {
  input: `0x${string}`;
  output?: `0x${string}`;
  to?: string;
  implementation?: string;
  abi?: AbiFunctionWithoutGas[];
  space: 'evm' | 'core';
  success?: boolean;
}): [
  {
    decodedParams?: {
      args: readonly unknown[] | undefined;
      functionName: string;
    };
    decodedResults?: unknown[];
    abiItem?: AbiFunctionWithoutGas;
    fullName?: string;
  },
  boolean,
] => {
  const hasAbi = outerAbi && outerAbi.length > 0;
  const { data, isLoading } = useContractDetail(to, fields, !hasAbi && !!input);
  const implementation = _implementation ?? data?.implementation?.address;
  const { data: implementationData, isLoading: implementationLoading } =
    useContractDetail(implementation, fields, !hasAbi && !!input);
  const decodedByOuterAbi = useMemo(() => {
    return decodeFunctionDataByAbi({
      abi: outerAbi,
      input,
      output,
      space,
      success,
    });
  }, [input, output, outerAbi, success, space]);
  const decodedByContractAbi = useMemo(() => {
    if (!data?.abi) return null;
    return decodeFunctionDataByAbi({
      abi: JSON.parse(data.abi as string),
      input,
      output,
      space,
      success,
    });
  }, [input, output, data?.abi, success, space]);
  const decodedByImplementationAbi = useMemo(() => {
    if (!implementationData?.abi) return null;
    return decodeFunctionDataByAbi({
      abi: JSON.parse(implementationData.abi as string),
      input,
      output,
      space,
      success,
    });
  }, [input, output, implementationData?.abi, success, space]);

  const loading = isLoading || implementationLoading;

  return useMemo(() => {
    if (!input) return [{}, false];
    if (decodedByOuterAbi) return [decodedByOuterAbi, false];
    if (decodedByImplementationAbi)
      return [decodedByImplementationAbi, loading];
    if (decodedByContractAbi) return [decodedByContractAbi, loading];
    return [{}, false];
  }, [
    input,
    decodedByOuterAbi,
    decodedByContractAbi,
    decodedByImplementationAbi,
    isLoading,
  ]);
};
