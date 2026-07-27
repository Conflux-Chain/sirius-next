import type { Chain, ChainFormatters, Abi, Hex } from 'cive';
import {
  type Prettify,
  type Assign,
  type AbiItem,
  type ContractErrorName,
  type IsNarrowable,
  type UnionEvaluate,
  type ContractErrorArgs,
  toFunctionSelector,
} from 'viem';
import CommonError from '../abis/CommonError';
import CommonPanic from '../abis/CommonPanic';
import {
  decodeAbiParameters as decodeCoreAbiParameters,
  formatAbiItem as formatCoreAbiItem,
} from 'cive/utils';
import { NETWORK_ID } from './constants';

export function defineChain<
  formatters extends ChainFormatters,
  const chain extends Chain<formatters>,
>(chain: chain): Prettify<Assign<Chain<undefined>, chain>> {
  return {
    formatters: undefined,
    fees: undefined,
    serializers: undefined,
    ...chain,
  } as Assign<Chain<undefined>, chain>;
}

type DecodeErrorResultParameters<abi extends Abi | readonly unknown[] = Abi> = {
  abi?: abi | undefined;
  data: Hex;
};
type DecodeErrorResultReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  allErrorNames extends ContractErrorName<abi> = ContractErrorName<abi>,
> =
  IsNarrowable<abi, Abi> extends true
    ? UnionEvaluate<
        {
          [errorName in allErrorNames]: {
            abiItem: abi extends Abi
              ? Abi extends abi
                ? AbiItem
                : any
              : AbiItem;
            args: ContractErrorArgs<abi, errorName>;
            errorName: errorName;
          };
        }[allErrorNames]
      >
    : {
        abiItem: AbiItem;
        args: readonly unknown[] | undefined;
        errorName: string;
      };

export function decodeErrorResult<const abi extends Abi | readonly unknown[]>(
  parameters: DecodeErrorResultParameters<abi>,
): DecodeErrorResultReturnType<abi> {
  const { abi, data } = parameters as DecodeErrorResultParameters;

  if (data.length < 10 || !data.startsWith('0x'))
    throw new Error('Invalid data');
  const signature = data.slice(0, 10);

  const abi_ = [...(abi || []), CommonError[0], CommonPanic[0]];

  const abiItem = abi_.find(
    x =>
      x.type === 'error' &&
      signature === toFunctionSelector(formatCoreAbiItem(x)),
  );
  if (!abiItem)
    throw new Error(`not found abi item for error signature: ${signature}`);
  return {
    abiItem,
    args:
      'inputs' in abiItem && abiItem.inputs && abiItem.inputs.length > 0
        ? decodeCoreAbiParameters(
            abiItem.inputs,
            `0x${data.slice(10)}`,
            NETWORK_ID,
          )
        : undefined,
    errorName: (abiItem as { name: string }).name,
  };
}
