import { useDecodeFunctionError } from 'src/utils/hooks/useDecodeFunctionError';

interface Props {
  data?: string;
  to?: string;
  implementation?: string;
  fallback?: React.ReactNode;
}

export const AAFailedReason = function ({
  data,
  to,
  implementation,
  fallback,
}: Props) {
  const isHexData = data?.startsWith('0x');
  const [decodedError, isLoading] = useDecodeFunctionError({
    to,
    implementation,
    errorData: isHexData ? (data as `0x${string}`) : undefined,
    space: 'evm',
  });
  if (!isHexData) return data;
  if (
    isLoading ||
    !decodedError ||
    !decodedError.abiItem ||
    decodedError.abiItem.type !== 'error'
  ) {
    return fallback;
  }
  return decodedError.errorName;
};
