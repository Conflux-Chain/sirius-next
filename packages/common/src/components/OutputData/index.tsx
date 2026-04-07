import { DataType } from 'src/utils/hooks/useDecodedDataType';
import { DecodedFunctionData } from 'src/utils/hooks/useDecodeFunctionData';
import { ErrorDecode } from './ErrorDecode';
import { Original } from '../InputData/Original';
import { UTF8 } from '../InputData/UTF8';
import { GeneralDecode } from '../InputData/GeneralDecode';
import { DecodedParameters } from '../InputData/OptimizationDecode';

export const OutputData = ({
  decodedData,
  dataType,
  output,
  to,
  space,
  success,
  proxy,
  labelClassName,
}: {
  decodedData?: DecodedFunctionData;
  dataType: DataType;
  output?: `0x${string}`;
  space: 'evm' | 'core';
  to?: string;
  labelClassName?: string;
  success?: boolean;
  proxy?: {
    beaconAddress?: string;
    implAddress: string;
  };
}) => {
  const isReturnDataEmpty = !output || output === '0x';
  if (isReturnDataEmpty) return null;
  if (dataType === 'utf8') {
    return <UTF8 data={output}></UTF8>;
  } else if (dataType === 'generalDecode') {
    if (!success) return <Original data={output}></Original>;
    if (decodedData) {
      return (
        <GeneralDecode
          data={output}
          fullName={decodedData.fullName}
        ></GeneralDecode>
      );
    }
  } else if (dataType === 'optimizationDecode') {
    if (!success) {
      return (
        <ErrorDecode
          to={to}
          space={space}
          errorData={output}
          proxy={proxy}
          labelClassName={labelClassName}
        ></ErrorDecode>
      );
    }
    if (decodedData) {
      return (
        <DecodedParameters
          args={decodedData.decodedResults}
          params={decodedData.abiItem?.outputs ?? []}
          label="Return:"
          labelClassName={labelClassName}
          space={space}
        />
      );
    }
  }
  return <Original data={output}></Original>;
};
