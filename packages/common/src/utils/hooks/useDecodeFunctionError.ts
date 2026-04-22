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

interface Result {
  abiItem?: AbiItem;
  args?: readonly unknown[];
  errorName: string;
  // no abi for decoded
  noAbi?: boolean;
  // decoded failed
  failed?: boolean;
}

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
}): [Result | null, boolean] => {
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
  const decodedByStandardError = useMemo(() => {
    if (!standardErrorAbi) return null;
    try {
      const result = decodeErrorResult({
        abi: standardErrorAbi,
        data: errorData,
        space,
      });
      return result as Result;
    } catch (error) {
      console.log('decode error data with standard error abi failed', error);
      return {
        errorName: 'unknown',
        failed: true,
      };
    }
  }, [errorData, standardErrorAbi, space]);
  const decoded = useMemo(() => {
    if (!data?.abi) return null;
    try {
      const result = decodeErrorResult({
        abi: JSON.parse(data.abi as string),
        data: errorData,
        space,
      });
      return result as Result;
    } catch (error) {
      console.log('decode error data with contract abi failed', error);
      return {
        errorName: 'unknown',
        failed: true,
      };
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
      return result as Result;
    } catch (error) {
      console.log('decode error data with implementation abi failed', error);
      return {
        errorName: 'unknown',
        failed: true,
      };
    }
  }, [errorData, implementationData, space]);

  return useMemo(() => {
    if (!errorData) return [null, false];
    if (decodedByStandardError && !decodedByStandardError.failed)
      return [decodedByStandardError, false];
    if (decodedByImplementation && !decodedByImplementation.failed)
      return [decodedByImplementation, implementationLoading];
    if (decoded && !decoded.failed) return [decoded, contractLoading];
    if (contractLoading || implementationLoading) return [null, true];
    return [
      {
        errorName: 'unknown',
        noAbi: !decodedByStandardError && !decodedByImplementation && !decoded,
        failed:
          decodedByImplementation?.failed ||
          decoded?.failed ||
          decodedByStandardError?.failed,
      },
      false,
    ];
  }, [
    errorData,
    decodedByStandardError,
    decoded,
    decodedByImplementation,
    contractLoading,
    implementationLoading,
    space,
  ]);
};
