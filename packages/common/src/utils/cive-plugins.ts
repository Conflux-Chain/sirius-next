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
  TFormatters extends ChainFormatters,
  const TChain extends Chain<TFormatters>,
>(chain: TChain): Prettify<Assign<Chain<undefined>, TChain>> {
  return {
    formatters: undefined,
    fees: undefined,
    serializers: undefined,
    ...chain,
  } as Assign<Chain<undefined>, TChain>;
}

type DecodeErrorResultParameters<
  AbiType extends Abi | readonly unknown[] = Abi,
> = {
  abi?: AbiType | undefined;
  data: Hex;
};
type DecodeErrorResultReturnType<
  AbiType extends Abi | readonly unknown[] = Abi,
  AllErrorNames extends ContractErrorName<AbiType> = ContractErrorName<AbiType>,
> =
  IsNarrowable<AbiType, Abi> extends true
    ? UnionEvaluate<
        {
          [errorName in AllErrorNames]: {
            abiItem: AbiType extends Abi
              ? Abi extends AbiType
                ? AbiItem
                : any
              : AbiItem;
            args: ContractErrorArgs<AbiType, errorName>;
            errorName: errorName;
          };
        }[AllErrorNames]
      >
    : {
        abiItem: AbiItem;
        args: readonly unknown[] | undefined;
        errorName: string;
      };

export function decodeErrorResult<
  const AbiType extends Abi | readonly unknown[],
>(
  parameters: DecodeErrorResultParameters<AbiType>,
): DecodeErrorResultReturnType<AbiType> {
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
