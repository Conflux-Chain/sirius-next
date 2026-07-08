import { useDecodeFunctionError } from 'src/utils/hooks/useDecodeFunctionError';

interface Props {
  data?: string;
  fallback?: React.ReactNode;
}

export const AAFailedReason = function ({ data, fallback }: Props) {
  const isHexData = data?.startsWith('0x');
  const [decodedError, isLoading] = useDecodeFunctionError({
    errorData: isHexData ? (data as `0x${string}`) : undefined,
    space: 'evm',
    supportErrorAbi: true,
  });
  if (!isHexData) return data;
  if (
    isLoading ||
    !decodedError ||
    !decodedError.abiItem ||
    decodedError.failed ||
    decodedError.noAbi ||
    decodedError.abiItem.type !== 'error'
  ) {
    return fallback;
  }
  return decodedError.errorName;
};
