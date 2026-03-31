import { useMemo } from 'react';
import { decodeErrorResult } from 'src/utils/sdk';
import type { AbiItem } from 'src/utils/sdk';
import { useContractDetail } from './useContractDetail';
import { COMMON_ERROR_OUTPUT_PREFIX } from '../constants';
import CommonError from 'src/abis/CommonError';

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
  const isCommonError = useMemo(
    () => errorData.startsWith(COMMON_ERROR_OUTPUT_PREFIX),
    [errorData],
  );
  const { data, isLoading } = useContractDetail(
    to,
    fields,
    !isCommonError && !!errorData,
  );
  const implementation = _implementation ?? data?.implementation?.address;
  const { data: implementationData, isLoading: implementationLoading } =
    useContractDetail(implementation, fields, !isCommonError && !!errorData);
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

  const loading = isLoading || implementationLoading;

  return useMemo(() => {
    if (!errorData) return [null, false];
    if (isCommonError)
      return [
        decodeErrorResult({
          abi: CommonError,
          data: errorData,
          space,
        }),
        false,
      ];
    if (decodedByImplementation) return [decodedByImplementation, loading];
    if (decoded) return [decoded, loading];
    return [
      {
        errorName: 'unknown',
      },
      loading,
    ];
  }, [
    errorData,
    decoded,
    isCommonError,
    decodedByImplementation,
    isLoading,
    space,
  ]);
};
