import useSWRImmutable from 'swr/immutable';
import { fetchAddressNameMap } from '../request';
import { useMemo } from 'react';

export const useAddressNameMap = (addresses: string[], shouldFetch = true) => {
  const key = useMemo(() => {
    return shouldFetch && addresses.length > 0
      ? `address-name-map-${[...addresses].sort().join(',')}`
      : null;
  }, [addresses, shouldFetch]);
  return useSWRImmutable(key, () =>
    fetchAddressNameMap(addresses, {
      withContractInfo: 'true',
      withNameTagInfo: 'true',
      withENSInfo: 'true',
    }),
  );
};
