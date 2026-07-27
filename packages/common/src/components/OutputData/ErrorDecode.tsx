import { cn } from 'src/utils';
import { useDecodeFunctionError } from 'src/utils/hooks/useDecodeFunctionError';
import { Original } from '../InputData/Original';
import { DecodedParameters } from '../InputData/OptimizationDecode';
import { FunctionName } from '../InputData/FunctionName';
import { AbiWarning } from '../InputData/AbiWarning';
import type { AbiItem } from 'src/utils/sdk';

interface Props {
  errorData?: `0x${string}`;
  to?: string;
  space: 'evm' | 'core';
  abi?: AbiItem[];
  labelClassName?: string;
  contentClassName?: string;
  implementation?: string;
}

export const ErrorDecode = ({
  to,
  errorData,
  abi,
  space,
  labelClassName,
  contentClassName,
  implementation,
}: Props) => {
  const [decodedError, isLoading] = useDecodeFunctionError({
    to,
    implementation,
    abi,
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
        <div className="flex-1">
          <Original data={errorData ?? ''} className={contentClassName} />
          {!isLoading && (
            <AbiWarning
              tip={
                decodedError?.failed
                  ? 'contract.abiError'
                  : decodedError?.noAbi
                    ? 'contract.abiNotUploaded'
                    : undefined
              }
            />
          )}
        </div>
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
          contentClassName={contentClassName}
          space={space}
        />
      )}
    </>
  );
};
