import { useMemo } from 'react';
import { decodeErrorResult } from 'src/utils/sdk';
import type { AbiItem } from 'src/utils/sdk';
import { useContractDetail } from './useContractDetail';
import {
  COMMON_ERROR_OUTPUT_PREFIX,
  COMMON_PANIC_OUTPUT_PREFIX,
} from '../constants';
import CommonError from 'src/abis/CommonError';
import CommonPanic from 'src/abis/CommonPanic';

const fields = ['abi' as const];

export const useDecodeFunctionError = ({
  to,
  implementation: _implementation,
  errorData,
  space,
}: {
  errorData: `0x${string}`;
  to?: string;
  implementation?: string;
  space: 'evm' | 'core';
}): [
  {
    abiItem?: AbiItem;
    args?: readonly unknown[];
    errorName: string;
  } | null,
  boolean,
] => {
  const standardErrorAbi = useMemo(() => {
    if (errorData.startsWith(COMMON_ERROR_OUTPUT_PREFIX)) return CommonError;
    if (errorData.startsWith(COMMON_PANIC_OUTPUT_PREFIX)) return CommonPanic;
    return null;
  }, [errorData]);
  const { data, isLoading: contractLoading } = useContractDetail(
    to,
    fields,
    !standardErrorAbi && !!errorData,
  );
  const implementation = _implementation ?? data?.implementation?.address;
  const { data: implementationData, isLoading: implementationLoading } =
    useContractDetail(implementation, fields, !standardErrorAbi && !!errorData);
  const decoded = useMemo(() => {
    if (!data?.abi) return null;
    try {
      const result = decodeErrorResult({
        abi: JSON.parse(data.abi as string),
        data: errorData,
        space,
      });
      return result;
    } catch (error) {
      console.log('decode error data with contract abi failed', error);
      return null;
    }
  }, [errorData, data, space]);
  const decodedByImplementation = useMemo(() => {
    if (!implementationData?.abi) return null;
    try {
      const result = decodeErrorResult({
        abi: JSON.parse(implementationData.abi as string),
        data: errorData,
        space,
      });
      return result;
    } catch (error) {
      console.log('decode error data with contract abi failed', error);
      return null;
    }
  }, [errorData, implementationData, space]);

  return useMemo(() => {
    if (!errorData) return [null, false];
    if (standardErrorAbi)
      return [
        decodeErrorResult({
          abi: standardErrorAbi,
          data: errorData,
          space,
        }),
        false,
      ];
    if (decodedByImplementation)
      return [decodedByImplementation, implementationLoading];
    if (decoded) return [decoded, contractLoading];
    return [
      {
        errorName: 'unknown',
      },
      contractLoading || implementationLoading,
    ];
  }, [
    errorData,
    standardErrorAbi,
    decoded,
    decodedByImplementation,
    contractLoading,
    implementationLoading,
    space,
  ]);
};
