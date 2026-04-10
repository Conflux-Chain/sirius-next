import type { AbiParameter } from 'src/utils/sdk';

const parseParams = (params: unknown, abiParam: AbiParameter): unknown => {
  if (abiParam.type === 'tuple' && 'components' in abiParam) {
    return abiParam.components.map((item, index) => {
      const key = item.name ?? index;
      const value = (params as any)[key];
      return parseParams(value, item);
    });
  }
  if (abiParam.type.includes('tuple[') && 'components' in abiParam) {
    return (params as unknown[]).map(param =>
      abiParam.components.map((item, index) => {
        const key = item.name ?? index;
        return parseParams((param as any)[key], item);
      }),
    );
  }
  if (abiParam.type.includes('[')) {
    return (params as unknown[]).map(param =>
      typeof param === 'bigint' ? param.toString() : param,
    );
  }
  if (typeof params === 'bigint') return params.toString();
  return params;
};

export const parseArgs = (
  args: readonly unknown[],
  abiParams: readonly AbiParameter[],
) => {
  return abiParams.map((param, index) => {
    const arg = args[index];
    return parseParams(arg, param);
  });
};
