import { useDecodeFunctionError } from 'src/utils/hooks/useDecodeFunctionError';

interface Props {
  data?: `0x${string}`;
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
  const [decodedError, isLoading] = useDecodeFunctionError({
    to,
    implementation,
    errorData: data,
    space: 'evm',
  });
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
