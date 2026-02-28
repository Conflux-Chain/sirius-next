import { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import qs from 'query-string';
import { useSearchParams } from './useSearchParams';
import { isAddressEqual } from '../address';

export const useAutoSetHolderFilterParams = (keys: string[]) => {
  const [inHolderFilter, setInHolderFilter] = useState(false);
  const history = useHistory();
  const { pathname } = useLocation();
  const { a: holder, ...query } = useSearchParams() as Record<string, string>;
  // enter holder filter
  useEffect(() => {
    if (
      holder &&
      keys.every(key => {
        const value = query[key];
        return (
          !value ||
          isAddressEqual(value, holder, {
            isAddress: () => true,
          })
        );
      })
    ) {
      const newParams = keys.reduce(
        (prev, curr) => {
          prev[curr] = holder;
          return prev;
        },
        {} as Record<string, string>,
      );
      setInHolderFilter(true);
      history.replace(
        qs.stringifyUrl({
          url: pathname,
          query: {
            ...query,
            a: holder,
            ...newParams,
          },
        }),
      );
    }
  }, [holder]);

  // exit holder filter if holder is not equal to query[key]
  useEffect(() => {
    if (
      holder &&
      inHolderFilter &&
      keys.some(key => {
        const value = query[key];
        return (
          !value ||
          !isAddressEqual(value, holder, {
            isAddress: () => true,
          })
        );
      })
    ) {
      setInHolderFilter(false);
      history.replace(
        qs.stringifyUrl({
          url: pathname,
          query: {
            ...query,
          },
        }),
      );
    }
  }, [holder, history, pathname, query, inHolderFilter]);
};
