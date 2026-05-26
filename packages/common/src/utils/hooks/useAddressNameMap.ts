import useSWRImmutable from 'swr/immutable';
import { fetchAddressNameMap } from '../request';
import { useMemo } from 'react';
import { AddressNameMap } from '../request.types';

export const transformNameMapKeysToLowerCase = (
  nameMap?: Record<string, AddressNameMap>,
) =>
  nameMap &&
  Object.fromEntries(
    Object.entries(nameMap).map(([k, v]) => [k.toLowerCase(), v]),
  );

export const useAddressNameMap = (addresses: string[], shouldFetch = true) => {
  const key = useMemo(() => {
    return shouldFetch && addresses.length > 0
      ? `address-name-map-${addresses
          .filter(i => !!i)
          .map(i => i.toLowerCase())
          .sort()
          .join(',')}`
      : null;
  }, [addresses, shouldFetch]);
  return useSWRImmutable(key, () =>
    fetchAddressNameMap(addresses, {
      withContractInfo: 'true',
      withNameTagInfo: 'true',
      withENSInfo: 'true',
    }).then(transformNameMapKeysToLowerCase),
  );
};
