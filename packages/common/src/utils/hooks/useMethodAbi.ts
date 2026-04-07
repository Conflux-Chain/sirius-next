import useSWRImmutable from 'swr/immutable';
import { reqAbiByMethodId } from '../request';

export const useMethodAbi = (methodId?: string, shouldFetch = true) => {
  return useSWRImmutable(
    shouldFetch && methodId ? `method-abi-${methodId}` : null,
    () => reqAbiByMethodId(methodId ?? ''),
  );
};
