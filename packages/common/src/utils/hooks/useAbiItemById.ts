import useSWRImmutable from 'swr/immutable';
import { reqAbiById } from '../request';

export const useAbiItemById = (
  id?: string | null,
  type: 'function' | 'event' | 'error' = 'function',
  shouldFetch = true,
) => {
  return useSWRImmutable(
    shouldFetch && id ? `abi-item-by-id:${id}-${type}` : null,
    () =>
      reqAbiById({
        [type]: id,
      }),
  );
};
