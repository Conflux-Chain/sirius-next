import { cn } from 'src/utils';
import { useDecodeFunctionError } from 'src/utils/hooks/useDecodeFunctionError';
import { Original } from '../InputData/Original';
import { DecodedParameters } from '../InputData/OptimizationDecode';
import { FunctionName } from '../InputData/FunctionName';

export const ErrorDecode = ({
  to,
  errorData,
  space,
  labelClassName,
  proxy,
}: {
  errorData: `0x${string}`;
  to?: string;
  space: 'evm' | 'core';
  labelClassName?: string;
  proxy?: {
    beaconAddress?: string;
    implAddress: string;
  };
}) => {
  const [decodedError, isLoading] = useDecodeFunctionError({
    to,
    implementation: proxy?.implAddress,
    errorData,
    space,
  });

  if (
    isLoading ||
    !decodedError ||
    !decodedError.abiItem ||
    decodedError.abiItem.type !== 'error'
  )
    return (
      <div className="flex min-h-32px">
        <div
          className={cn(
            'w-100px shrink-0 grow-0 text-14px lh-18px pt-6px text-#6a737d',
            labelClassName,
          )}
        >
          Error:
        </div>
        <Original data={errorData} />
      </div>
    );
  return (
    <>
      <div className="flex min-h-32px">
        <div
          className={cn(
            'w-100px shrink-0 grow-0 text-14px lh-18px text-#6a737d pt-1px',
            labelClassName,
          )}
        >
          Error:{' '}
        </div>
        <div>
          <FunctionName abiItem={decodedError.abiItem}></FunctionName>
        </div>
      </div>
      {decodedError.args && decodedError.args.length > 0 && (
        <DecodedParameters
          args={decodedError.args}
          params={decodedError.abiItem.inputs}
          label="Parameters:"
          labelClassName={labelClassName}
          space={space}
        />
      )}
    </>
  );
};
