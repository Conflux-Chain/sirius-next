import { useMemo, useState } from 'react';
import { Card } from '../Card';
import { Select } from '../Select';
import { useTranslation } from 'react-i18next';
import { getTranslations } from 'src/store';
import { Original } from '../InputData/Original';
import { UTF8 } from '../InputData/UTF8';
import { JsonDecode } from '../InputData/JsonDecode';
import { GeneralDecode } from '../InputData/GeneralDecode';
import {
  DecodedParameters,
  OptimizationDecode,
} from '../InputData/OptimizationDecode';
import { AbiFunctionWithoutGas } from 'src/utils/hooks/useTxTrace';
import { ErrorDecode } from '../OutputData/ErrorDecode';
import clsx from 'clsx';
import { useDecodeFunctionData } from 'src/utils/hooks/useDecodeFunctionData';

type DataType =
  | 'original'
  | 'json'
  | 'utf8'
  | 'generalDecode'
  | 'optimizationDecode';

interface Props {
  to?: string;
  isContractCreated?: boolean;
  input: `0x${string}`;
  output?: `0x${string}`;
  abi?: AbiFunctionWithoutGas[];
  success?: boolean;
  space: 'evm' | 'core';
  proxy?: {
    beaconAddress?: string;
    implAddress: string;
  };
}

const OriginalOutput = ({
  data,
  label,
  labelClassName,
}: {
  label: string;
  data: string;
  labelClassName?: string | false;
}) => {
  return (
    <>
      <div className={clsx('w-150px shrink-0', labelClassName)}>{label}</div>
      <div className="flex-1">
        <Original data={data}></Original>
      </div>
    </>
  );
};
const UTF8Output = ({
  data,
  label,
  labelClassName,
}: {
  label: string;
  data: string;
  labelClassName?: string | false;
}) => {
  return (
    <>
      <div className={clsx('w-150px shrink-0', labelClassName)}>{label}</div>
      <div className="flex-1">
        <UTF8 data={data}></UTF8>
      </div>
    </>
  );
};
const GeneralDecodeOutput = ({
  data,
  fullName,
  label,
  labelClassName,
}: {
  data: string;
  fullName?: string;
  label: string;
  labelClassName?: string | false;
}) => {
  return (
    <>
      <div className={clsx('w-150px shrink-0', labelClassName)}>{label}</div>
      <div className="flex-1">
        <GeneralDecode
          data={data}
          fullName={fullName}
          includeMethodID={false}
        ></GeneralDecode>
      </div>
    </>
  );
};

export const TraceDetail = ({
  to,
  input,
  output,
  success,
  abi,
  isContractCreated,
  space,
  proxy,
}: Props) => {
  const { t } = useTranslation();
  const translations = getTranslations();
  const [data] = useDecodeFunctionData({
    to,
    input,
    output,
    success,
    space,
    abi,
  });
  const [selectedType, setSelectedType] = useState<DataType | null>(null);
  const { typeList: dataTypeList, type: defaultDataType } = useMemo(() => {
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
    // support optimization and json decode if abi decode is available
    if (data.decodedParams) {
      typeList.push('json', 'optimizationDecode');
      type = 'optimizationDecode';
    }
    return {
      typeList,
      type,
    };
  }, [to, isContractCreated, input, data.decodedParams]);
  const dataType = selectedType || defaultDataType;

  const getInputBody = (dataType: DataType) => {
    if (dataType === 'original') {
      return <Original data={input}></Original>;
    } else if (dataType === 'utf8') {
      return <UTF8 data={input}></UTF8>;
    } else if (dataType === 'json') {
      return (
        <JsonDecode
          decodedParams={data.decodedParams!}
          decodedResults={data.decodedResults}
          abiItem={data.abiItem!}
          input={input}
        ></JsonDecode>
      );
    } else if (dataType === 'generalDecode') {
      return (
        <GeneralDecode data={input} fullName={data.fullName}></GeneralDecode>
      );
    } else if (dataType === 'optimizationDecode') {
      return (
        <OptimizationDecode
          decodedParams={data.decodedParams!}
          abiItem={data.abiItem!}
          input={input}
          labelClassName="text-#002257 w-150px"
          space={space}
        ></OptimizationDecode>
      );
    }
  };

  const getOutputBody = (dataType: DataType) => {
    const isReturnDataEmpty = !output || output === '0x';
    if (isReturnDataEmpty) return null;
    if (dataType === 'original') {
      return (
        <OriginalOutput
          label={success ? 'Output Data' : 'Error'}
          labelClassName={!success && 'text-red'}
          data={output}
        ></OriginalOutput>
      );
    } else if (dataType === 'utf8') {
      return (
        <UTF8Output
          label={success ? 'Output Data' : 'Error'}
          labelClassName={!success && 'text-red'}
          data={output}
        ></UTF8Output>
      );
    } else if (dataType === 'generalDecode') {
      if (!success)
        return (
          <OriginalOutput
            label={success ? 'Output Data' : 'Error'}
            labelClassName={!success && 'text-red'}
            data={output}
          ></OriginalOutput>
        );
      return (
        <GeneralDecodeOutput
          data={output}
          fullName={data.fullName}
          label={success ? 'Output Data' : 'Error'}
          labelClassName={!success && 'text-red'}
        ></GeneralDecodeOutput>
      );
    } else if (dataType === 'optimizationDecode') {
      if (!success) {
        return (
          <div className="flex-1">
            <ErrorDecode
              to={to}
              space={space}
              errorData={output}
              proxy={proxy}
              labelClassName="text-red w-150px"
            ></ErrorDecode>
          </div>
        );
      }
      return (
        <div className="flex-1">
          <DecodedParameters
            args={data.decodedResults}
            params={data.abiItem?.outputs ?? []}
            label="Return:"
            labelClassName="text-#002257 w-150px"
            space={space}
          />
        </div>
      );
    }
  };

  return (
    <Card className="!border-1 !border-#E8E9EA py-10px">
      <div className="flex gap-5px">
        <div className="w-150px shrink-0"></div>
        <Select
          value={dataType}
          onChange={v => setSelectedType(v as DataType)}
          disableMatchWidth
          size="medium"
          className="mb-16px mt-0 bg-#fff border border-solid border-#ccc"
          disabled={dataTypeList.length === 1}
          width={180}
        >
          {dataTypeList.map(dataTypeItem => {
            return (
              <Select.Option
                className="data-[highlighted]:bg-[var(--theme-color-green2)] data-[highlighted]:text-#fff"
                key={dataTypeItem}
                value={dataTypeItem}
              >
                {t(translations.transaction.select[dataTypeItem])}
              </Select.Option>
            );
          })}
        </Select>
      </div>
      <div className="flex gap-5px">
        {dataType !== 'optimizationDecode' && (
          <div className="w-150px shrink-0">
            {dataType === 'json' ? 'In and Out Data' : 'Input Data'}
          </div>
        )}
        <div className="flex-1">{getInputBody(dataType)}</div>
      </div>
      <div className="flex gap-5px mt-16px">{getOutputBody(dataType)}</div>
    </Card>
  );
};
