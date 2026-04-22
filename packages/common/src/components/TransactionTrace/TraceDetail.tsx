import { Card } from '../Card';
import { Select } from '../Select';
import { useTranslation } from 'react-i18next';
import { getTranslations } from 'src/store';
import clsx from 'clsx';
import { useDecodeFunctionData } from 'src/utils/hooks/useDecodeFunctionData';
import {
  DataType,
  useDecodedDataType,
} from 'src/utils/hooks/useDecodedDataType';
import { InputData } from '../InputData';
import { OutputData } from '../OutputData';
import { AbiFunctionWithoutGas } from 'src/utils/sdk';
import { useState } from 'react';
import { AbiWarning } from '../InputData/AbiWarning';

interface Props {
  to?: string;
  isContractCreated?: boolean;
  input?: `0x${string}`;
  output?: `0x${string}`;
  abi?: AbiFunctionWithoutGas[];
  outcome?: 'success' | 'fail' | 'reverted';
  space: 'evm' | 'core';
  proxy?: {
    beaconAddress?: string;
    implAddress: string;
  };
}

const CommonTraceDetail = ({
  to,
  input = '0x',
  output,
  outcome = 'success',
  abi,
  isContractCreated,
  space,
  proxy,
}: Props) => {
  const success = outcome === 'success';
  const { t } = useTranslation();
  const translations = getTranslations();
  const [decodedData, isLoading] = useDecodeFunctionData({
    to,
    input,
    output,
    success,
    space,
    abi,
    withOutput: true,
  });
  const { dataType, setDataType, dataTypeList, tip } = useDecodedDataType({
    to,
    input,
    isContractCreated,
    decodedData,
  });
  const isReturnDataEmpty = !output || output === '0x';
  let outputDataType = dataType;
  // when the transaction failed, the output is the error message, use utf8 as decode type
  if (
    (outputDataType === 'optimizationDecode' ||
      outputDataType === 'generalDecode') &&
    outcome === 'fail'
  ) {
    outputDataType = 'utf8';
  }

  return (
    <Card className="!border-1 !border-#E8E9EA py-10px">
      <div className="flex gap-5px">
        <div className="w-150px shrink-0"></div>
        <Select
          value={dataType}
          onChange={setDataType}
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
        <div className="flex-1">
          <InputData
            dataType={dataType}
            input={input}
            decodedData={decodedData}
            space={space}
            labelClassName="text-#002257 w-150px"
            success={success}
          />
        </div>
      </div>
      {dataType !== 'json' && !isReturnDataEmpty && (
        <div className="flex gap-5px mt-16px">
          {outputDataType !== 'optimizationDecode' && (
            <div className={clsx('w-150px shrink-0', !success && 'text-red')}>
              {outcome === 'success'
                ? 'Output Data'
                : outcome === 'fail'
                  ? 'Failed'
                  : 'Error'}
            </div>
          )}
          <div className="flex-1">
            <OutputData
              dataType={outputDataType}
              output={output}
              decodedData={decodedData}
              space={space}
              proxy={proxy}
              success={success}
              to={to}
              labelClassName={clsx(
                'w-150px',
                !success ? 'text-red' : 'text-#002257',
              )}
            />
          </div>
        </div>
      )}
      {!isLoading && <AbiWarning tip={tip} className="ml-150px" />}
    </Card>
  );
};

// create contract failed may return error data, but it's not standard, so we only show error info for it
const CreateContractFailedTraceDetail = ({
  to,
  output,
  space,
  proxy,
  outcome,
}: Props) => {
  const [dataType, setDataType] = useState<DataType>('utf8');
  const { t } = useTranslation();
  const translations = getTranslations();
  const dataTypeList = ['original', 'utf8'] as DataType[];

  return (
    <Card className="!border-1 !border-#E8E9EA py-10px">
      <div className="flex gap-5px">
        <div className="w-150px shrink-0"></div>
        <Select
          value={dataType}
          onChange={setDataType}
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
      <div className="flex gap-5px mt-16px">
        <div className={clsx('w-150px shrink-0 text-red')}>
          {outcome === 'fail' ? 'Failed' : 'Error'}
        </div>
        <div className="flex-1">
          <OutputData
            dataType={dataType}
            output={output}
            space={space}
            proxy={proxy}
            success={false}
            to={to}
            labelClassName="w-150px text-red"
          />
        </div>
      </div>
    </Card>
  );
};

export const TraceDetail = (props: Props) => {
  const { outcome = 'success', isContractCreated } = props;
  if (isContractCreated && outcome !== 'success')
    return <CreateContractFailedTraceDetail {...props} />;
  return <CommonTraceDetail {...props} />;
};
