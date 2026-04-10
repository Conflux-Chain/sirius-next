import { useMemo } from 'react';
import type {
  AbiParameter,
  AbiFunctionWithoutGas,
  AbiError,
} from 'src/utils/sdk';

export const getParameterType = (input: AbiParameter): string => {
  let result = input.type;
  if (input.type.includes('tuple') && 'components' in input) {
    result = '(';
    result += input.components
      .map(item => {
        return getParameterType(item);
      })
      .join(', ');
    result += ')';
    if (input.type.includes('tuple[')) {
      result += input.type.replace('tuple', '');
    }
  }
  return result;
};

export const FunctionName = ({
  abiItem,
}: {
  abiItem: AbiFunctionWithoutGas | AbiError;
}) => {
  const args = useMemo(() => {
    return abiItem.inputs.map(item => {
      return {
        type: getParameterType(item),
        name: item.name,
      };
    });
  }, [abiItem]);
  const results = useMemo(() => {
    if (abiItem.type === 'error') return;
    return abiItem.outputs?.map(item => {
      return {
        type: getParameterType(item),
        name: item.name,
      };
    });
  }, [abiItem]);
  return (
    <div>
      <span>{abiItem.name}</span>
      <span className="m-0.1rem ml-0.3571rem">(</span>
      {args.map((a, index) => {
        let type = <span className="text-#d96349">{a.type}</span>;
        let arg = a.name && (
          <span className="ml-0.3571rem text-#e79d35"> {a.name}</span>
        );
        let comma =
          index !== args.length - 1 ? (
            <span className="mr-0.3571rem">, </span>
          ) : null;
        return (
          <span key={index}>
            {type}
            {arg}
            {comma}
          </span>
        );
      })}
      <span className="m-0.1rem">)</span>
      {abiItem.type === 'function' && abiItem.stateMutability === 'payable' && (
        <span className="m-0.1rem ml-0.3571rem">payable</span>
      )}
      {results && results.length > 0 && (
        <>
          <span className="ml-0.3571rem">returns</span>
          <span className="m-0.1rem ml-0.3571rem">(</span>
          {results.map((a, index) => {
            let type = <span className="text-#d96349">{a.type}</span>;
            let arg = a.name && (
              <span className="ml-0.3571rem text-#e79d35"> {a.name}</span>
            );
            let comma =
              index !== results.length - 1 ? (
                <span className="mr-0.3571rem">, </span>
              ) : null;
            return (
              <span key={index}>
                {type}
                {arg}
                {comma}
              </span>
            );
          })}
          <span className="m-0.1rem mr-0.3571rem">)</span>
        </>
      )}
    </div>
  );
};
