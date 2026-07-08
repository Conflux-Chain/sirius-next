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
import { useAbiItemById } from './useAbiItemById';
import { formatABI } from '..';

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
  supportErrorAbi,
}: {
  errorData?: `0x${string}`;
  to?: string;
  implementation?: string;
  space: 'evm' | 'core';
  supportErrorAbi?: boolean;
}): [Result | null, boolean] => {
  const standardErrorAbi = useMemo(() => {
    if (!errorData) return null;
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
    if (!standardErrorAbi || !errorData) return null;
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
    if (!data?.abi || !errorData) return null;
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
    if (!implementationData?.abi || !errorData) return null;
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
  const errorId = errorData?.startsWith('0x') ? errorData.slice(0, 10) : null;
  const needErrorAbi =
    supportErrorAbi &&
    !!errorId &&
    // contract abi decoded failed
    !contractLoading &&
    (!decoded || decoded.failed) &&
    // implementation contract abi decoded failed
    !implementationLoading &&
    (!decodedByImplementation || decodedByImplementation.failed);
  const { data: errorAbiResponse, isLoading: errorAbiLoading } = useAbiItemById(
    errorId,
    'error',
    needErrorAbi,
  );
  const decodedByErrorAbi = useMemo(() => {
    if (!errorAbiResponse || !errorData || !errorId) return null;
    const errorAbiList = errorAbiResponse?.error?.[errorId];
    // decode tx data with error abi only if there is only one abi
    if (!errorAbiList || errorAbiList.length !== 1) return null;
    const errorAbi = errorAbiList[0]!;
    try {
      // e.g. NotFromEntryPoint(address,address,address)
      const signature = errorAbi.signature;
      // e.g. error NotFromEntryPoint(address msgSender, address entity, address entryPoint)
      const fullFormat = errorAbi.fullFormat;
      const abi = formatABI([fullFormat || `error ${signature}`], {
        json: true,
      });
      const result = decodeErrorResult({
        abi: JSON.parse(abi),
        data: errorData,
        space,
      });
      return result as Result;
    } catch (error) {
      console.log('decode error data with error abi failed', error);
      return {
        errorName: 'unknown',
        failed: true,
      };
    }
  }, [errorAbiResponse, errorData, errorId, space]);

  return useMemo(() => {
    if (!errorData) return [null, false];
    if (decodedByStandardError && !decodedByStandardError.failed)
      return [decodedByStandardError, false];
    if (decodedByImplementation && !decodedByImplementation.failed)
      return [decodedByImplementation, implementationLoading];
    if (decoded && !decoded.failed) return [decoded, contractLoading];
    if (decodedByErrorAbi && !decodedByErrorAbi.failed)
      return [decodedByErrorAbi, errorAbiLoading];
    if (contractLoading || implementationLoading || errorAbiLoading)
      return [null, true];
    return [
      {
        errorName: 'unknown',
        noAbi:
          !decodedByStandardError &&
          !decodedByImplementation &&
          !decoded &&
          !decodedByErrorAbi,
        failed:
          decodedByStandardError?.failed ||
          decodedByImplementation?.failed ||
          decoded?.failed ||
          decodedByErrorAbi?.failed,
      },
      false,
    ];
  }, [
    errorData,
    decodedByStandardError,
    decoded,
    decodedByImplementation,
    decodedByErrorAbi,
    contractLoading,
    implementationLoading,
    errorAbiLoading,
    space,
  ]);
};
