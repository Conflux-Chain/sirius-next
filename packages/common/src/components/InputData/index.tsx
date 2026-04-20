import { DataType } from 'src/utils/hooks/useDecodedDataType';
import { Original } from './Original';
import { UTF8 } from './UTF8';
import { JsonDecode } from './JsonDecode';
import { OptimizationDecode } from './OptimizationDecode';
import { GeneralDecode } from './GeneralDecode';
import { DecodedFunctionData } from 'src/utils/hooks/useDecodeFunctionData';

export const InputData = ({
  decodedData,
  dataType,
  input,
  space,
  labelClassName,
  success,
}: {
  decodedData: DecodedFunctionData;
  dataType: DataType;
  input: `0x${string}`;
  space: 'evm' | 'core';
  labelClassName?: string;
  success?: boolean;
}) => {
  if (dataType === 'utf8') {
    return <UTF8 data={input}></UTF8>;
  } else if (
    dataType === 'json' &&
    decodedData.decodedParams &&
    decodedData.abiItem
  ) {
    return (
      <JsonDecode
        decodedParams={decodedData.decodedParams}
        decodedResults={decodedData.decodedResults}
        abiItem={decodedData.abiItem}
        input={input}
        success={success}
      ></JsonDecode>
    );
  } else if (dataType === 'generalDecode') {
    return (
      <GeneralDecode
        data={input}
        fullName={decodedData.fullName}
      ></GeneralDecode>
    );
  } else if (
    dataType === 'optimizationDecode' &&
    decodedData.decodedParams &&
    decodedData.abiItem
  ) {
    return (
      <OptimizationDecode
        decodedParams={decodedData.decodedParams}
        abiItem={decodedData.abiItem}
        input={input}
        labelClassName={labelClassName}
        space={space}
      ></OptimizationDecode>
    );
  }
  return <Original data={input}></Original>;
};
