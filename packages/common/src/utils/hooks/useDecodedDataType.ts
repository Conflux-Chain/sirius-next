import { useCallback, useMemo, useState } from 'react';
import { DecodedFunctionData } from './useDecodeFunctionData';

export type DataType =
  | 'original'
  | 'json'
  | 'utf8'
  | 'generalDecode'
  | 'optimizationDecode';

export const useDecodedDataType = ({
  to,
  input,
  isContractCreated,
  decodedData,
}: {
  to?: string;
  isContractCreated?: boolean;
  input: `0x${string}`;
  decodedData?: DecodedFunctionData;
}) => {
  const [selectedType, setSelectedType] = useState<DataType | null>(null);
  const {
    typeList: dataTypeList,
    type: defaultDataType,
    tip,
  } = useMemo(() => {
    const typeList: DataType[] = ['original'];
    let type: DataType = 'original';
    if (!to || isContractCreated) {
      return {
        typeList,
        type,
      };
    }
    // support utf8 decode if to is not empty and is not contract created
    typeList.push('utf8');
    type = 'utf8';
    const isDataEmpty = !input || input === '0x';
    if (isDataEmpty) {
      return {
        typeList,
        type,
      };
    }
    // support general decode if input length is multiple of 64 (without methodID)
    if ((input.length - 10) % 64 === 0) {
      typeList.push('generalDecode');
      type = 'generalDecode';
    }
    let tip = 'contract.abiNotUploaded';
    // support optimization and json decode if abi decode is available
    if (decodedData?.decodedParams) {
      typeList.push('json', 'optimizationDecode');
      type = 'optimizationDecode';
      tip = decodedData.similarWarning ? 'contract.similarWarning' : '';
    } else if (decodedData?.failed) {
      tip = 'contract.abiError';
    }
    return {
      typeList,
      type,
      tip,
    };
  }, [to, isContractCreated, input, decodedData]);
  const dataType = selectedType || defaultDataType;
  return {
    tip,
    dataType,
    dataTypeList,
    setDataType: useCallback(
      (type: DataType) => {
        if (!dataTypeList.includes(type)) return;
        setSelectedType(type);
      },
      [dataTypeList],
    ),
  };
};
