import { useMemo } from 'react';
import {
  decodeFunctionData,
  decodeFunctionResult,
  getAbiItem,
  AbiFunctionWithoutGas,
} from 'src/utils/sdk';
import { useContractDetail } from './useContractDetail';
import { formatABI } from '..';
import { useMethodAbi } from './useMethodAbi';

const fields = ['abi' as const];

export type Hex = `0x${string}`;

const decodeFunctionDataByAbi = ({
  abi: _abi,
  input,
  output,
  space,
  success,
  withOutput = false,
  similarWarning,
}: {
  input: Hex;
  output?: Hex;
  abi?: AbiFunctionWithoutGas[] | string;
  space: 'evm' | 'core';
  success?: boolean;
  withOutput?: boolean;
  similarWarning?: boolean;
}) => {
  try {
    const abi = typeof _abi === 'string' ? JSON.parse(_abi) : _abi;
    const hasAbi = abi && abi.length > 0;
    if (!hasAbi) return null;
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
      name: decodedParams.functionName ?? methodID,
    }) as AbiFunctionWithoutGas;
    // if the output has only one value, decodeFunctionResult will return the value directly, otherwise it will return an array,
    // so we need to check the length of abiItem.outputs to determine whether to wrap decodedResults in an array
    const results =
      decodedResults === undefined
        ? undefined
        : abiItem.outputs.length === 1
          ? [decodedResults]
          : (decodedResults as unknown[]);
    if (!withOutput) {
      abiItem.outputs = [];
    }
    const fullName = formatABI([abiItem])[0];
    return {
      decodedParams,
      decodedResults: results,
      abiItem,
      fullName: fullName,
      failed: false,
      similarWarning,
    };
  } catch (error) {
    console.log('decode function data and result error', error);
    return {
      failed: true,
      similarWarning,
    };
  }
};

export interface DecodedFunctionData {
  decodedParams?: {
    args: readonly unknown[] | undefined;
    functionName: string;
  };
  decodedResults?: unknown[];
  abiItem?: AbiFunctionWithoutGas;
  fullName?: string;
  // no abi for decoded
  noAbi?: boolean;
  // decoded failed
  failed?: boolean;
  // decoded by method abi, not contract abi
  similarWarning?: boolean;
}

export const useDecodeFunctionData = ({
  to,
  abi: outerAbi,
  implementation: _implementation,
  input,
  output,
  space,
  success,
  supportMethodAbi,
  withOutput,
}: {
  input: Hex;
  output?: Hex;
  to?: string;
  implementation?: string;
  abi?: AbiFunctionWithoutGas[];
  space: 'evm' | 'core';
  success?: boolean;
  supportMethodAbi?: boolean;
  withOutput?: boolean;
}): [DecodedFunctionData, boolean] => {
  const hasOuterAbi = outerAbi && outerAbi.length > 0;
  const needContractAbi = !hasOuterAbi && !!input;
  const { data: contractData, isLoading: contractLoading } = useContractDetail(
    to,
    fields,
    needContractAbi,
  );
  const implementation =
    _implementation ?? contractData?.implementation?.address;
  const { data: implementationData, isLoading: implementationLoading } =
    useContractDetail(implementation, fields, needContractAbi);
  const decodedByOuterAbi = useMemo(() => {
    return decodeFunctionDataByAbi({
      abi: outerAbi,
      input,
      output,
      space,
      success,
      withOutput,
    });
  }, [input, output, outerAbi, success, space, withOutput]);
  const decodedByContractAbi = useMemo(() => {
    if (!contractData?.abi) return null;
    return decodeFunctionDataByAbi({
      abi: contractData.abi as string,
      input,
      output,
      space,
      success,
      withOutput,
    });
  }, [input, output, contractData?.abi, success, space, withOutput]);
  const decodedByImplementationAbi = useMemo(() => {
    if (!implementationData?.abi) return null;
    return decodeFunctionDataByAbi({
      abi: implementationData.abi as string,
      input,
      output,
      space,
      success,
      withOutput,
    });
  }, [input, output, implementationData?.abi, success, space, withOutput]);
  const needMethodAbi =
    !!supportMethodAbi &&
    needContractAbi &&
    // contract abi decoded failed
    !contractLoading &&
    (!decodedByContractAbi || decodedByContractAbi.failed) &&
    // implementation contract abi decoded failed
    !implementationLoading &&
    (!decodedByImplementationAbi || decodedByImplementationAbi.failed);
  const { data: methodAbi, isLoading: methodAbiLoading } = useMethodAbi(
    input.slice(0, 10),
    needMethodAbi,
  );
  const decodedByMethodAbi = useMemo(() => {
    // decode tx data with function abi only if there is only one function
    if (!methodAbi || methodAbi.list.length !== 1) return null;
    try {
      // e.g. transfer(address,uint256)
      const fullName = methodAbi.list[0]!.fullName;
      // e.g. function transfer(address recipient, uint256 amount) returns (bool)
      const formatWithArg = methodAbi.list[0]!.formatWithArg;
      const abi = formatABI([formatWithArg || `function ${fullName}`], {
        json: true,
      });
      return decodeFunctionDataByAbi({
        abi: abi,
        input,
        output,
        space,
        success,
        withOutput,
        similarWarning: true,
      });
    } catch (error) {
      console.log('decode function data and result error', error);
      return {
        failed: true,
      };
    }
  }, [input, output, methodAbi, success, space, withOutput]);

  return useMemo(() => {
    if (!input) return [{}, false];
    if (decodedByOuterAbi && !decodedByOuterAbi.failed)
      return [decodedByOuterAbi, false];
    if (decodedByImplementationAbi && !decodedByImplementationAbi.failed)
      return [decodedByImplementationAbi, implementationLoading];
    if (decodedByContractAbi && !decodedByContractAbi.failed)
      return [decodedByContractAbi, contractLoading];
    if (decodedByMethodAbi && !decodedByMethodAbi.failed)
      return [decodedByMethodAbi, methodAbiLoading];
    if (
      (decodedByOuterAbi && decodedByOuterAbi.failed) ||
      (decodedByImplementationAbi && decodedByImplementationAbi.failed) ||
      (decodedByContractAbi && decodedByContractAbi.failed) ||
      (decodedByMethodAbi && decodedByMethodAbi.failed)
    ) {
      return [
        {
          failed: true,
        },
        false,
      ];
    }
    return [
      {
        noAbi: true,
      },
      false,
    ];
  }, [
    input,
    decodedByOuterAbi,
    decodedByContractAbi,
    decodedByImplementationAbi,
    decodedByMethodAbi,
    contractLoading,
    implementationLoading,
    methodAbiLoading,
  ]);
};
