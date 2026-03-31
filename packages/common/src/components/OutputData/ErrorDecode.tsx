import { cn } from 'src/utils';
import { useDecodeFunctionError } from 'src/utils/hooks/useDecodeFunctionError';
import { Original } from '../InputData/Original';
import { DecodedParameters } from '../InputData/OptimizationDecode';

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
    !decodedError.args ||
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
    <DecodedParameters
      args={decodedError.args}
      params={decodedError.abiItem.inputs}
      label="Error:"
      labelClassName={labelClassName}
      space={space}
    />
  );
};
