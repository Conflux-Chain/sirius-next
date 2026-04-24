import { useMemo } from 'react';
import { useAddressNameMap } from './useAddressNameMap';
import { AddressNameMap } from '../request.types';

export const enhanceDataWithNameMap = (
  list?: Record<string, unknown>[],
  nameMap?: Record<string, AddressNameMap>,
) => {
  const normalizedNameMap = Object.fromEntries(
    Object.entries(nameMap || {}).map(([k, v]) => [k.toLowerCase(), v]),
  );

  return (
    list?.map(item => {
      const newItem = {
        ...item,
        nameMap: normalizedNameMap,
      };
      return newItem;
    }) || []
  );
};

export const formatListResponseWithNameMap = <
  T extends Record<string, unknown>,
>(
  res: T,
) => {
  return {
    ...res,
    list: enhanceDataWithNameMap(
      res.list as Record<string, unknown>[],
      res.nameMap as Record<string, AddressNameMap>,
    ),
  };
};

export const useEnhanceDataWithNameMap = (
  list?: Record<string, unknown>[],
  {
    addressKeys,
    nameMap,
  }: {
    addressKeys?: string[];
    nameMap?: Record<string, AddressNameMap>;
  } = {},
) => {
  const keys = useMemo(() => addressKeys?.join(',') || '', [addressKeys]);
  const addresses = useMemo(() => {
    const set = new Set<string>();
    list?.forEach(item => {
      addressKeys?.forEach(key => {
        const address = item[key];
        if (address && typeof address === 'string') {
          set.add(address);
        }
      });
    });
    return Array.from(set);
  }, [list, keys]);
  const { data: fetchedNameMap, isLoading } = useAddressNameMap(
    addresses,
    !nameMap,
  );
  const finalNameMap = nameMap || fetchedNameMap;
  return useMemo(() => {
    return {
      data: enhanceDataWithNameMap(list, finalNameMap),
      isLoading,
    };
  }, [list, finalNameMap, isLoading]);
};
