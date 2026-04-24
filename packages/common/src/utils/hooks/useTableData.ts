import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import qs from 'query-string';
import useSWR, { SWRConfiguration, KeyedMutator } from 'swr';
import { fetchWithPrefix } from '../request';
import { useSearchParams } from './useSearchParams';

export interface UseTableDataOptions<T> {
  url: string;
  query?: Record<string, any>;
  defaultSkip?: number;
  defaultLimit?: number;
  shouldFetch?: boolean;
  swrConfig?: SWRConfiguration<T>;
}

export interface TablePagination {
  current: number;
  pageSize: number;
  total: number;
}

interface TableData {
  list: Record<string, unknown>[];
  total: number;
  listLimit?: number;
}

export interface UseTableDataResult<T extends TableData> {
  data: T | undefined;
  loading: boolean;
  error: any;
  mutate: KeyedMutator<T>;
  pagination: TablePagination;
  setPagination: (next: { current?: number; pageSize?: number }) => void;
}

const toPositiveInt = (
  value: unknown,
  fallback: number,
  { allowZero = false }: { allowZero?: boolean } = {},
) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  if (!Number.isInteger(n)) return fallback;
  if (allowZero ? n < 0 : n <= 0) return fallback;
  return n;
};

export const useTableData = <T extends TableData = TableData>({
  url,
  query,
  defaultSkip = 0,
  defaultLimit = 10,
  shouldFetch = true,
  swrConfig,
}: UseTableDataOptions<T>): UseTableDataResult<T> => {
  const history = useHistory();
  const search = useSearchParams();

  const skip = toPositiveInt(search.skip, defaultSkip, { allowZero: true });
  const limit = toPositiveInt(search.limit, defaultLimit);

  const pageSize = limit;
  const current = Math.floor(skip / limit) + 1;

  const requestUrl = useMemo(() => {
    const { skip: _s, limit: _l, ...restSearch } = search;
    return qs.stringifyUrl({
      url,
      query: {
        ...(query || {}),
        ...restSearch,
        skip: String(skip),
        limit: String(limit),
      },
    });
  }, [url, query, search, skip, limit]);

  const key = shouldFetch ? requestUrl : null;

  const { data, error, isLoading, mutate } = useSWR<T>(
    key,
    () => fetchWithPrefix<T>(requestUrl),
    {
      ...swrConfig,
    },
  );

  const setPagination = useCallback(
    (next: { current?: number; pageSize?: number }) => {
      const nextPageSize = next.pageSize ?? pageSize;
      const nextCurrent = next.current ?? current;
      const nextSkip = Math.max(0, (nextCurrent - 1) * nextPageSize);
      const nextSearch = qs.stringify({
        ...search,
        skip: String(nextSkip),
        limit: String(nextPageSize),
      });
      history.push({
        pathname: history.location.pathname,
        search: nextSearch ? `?${nextSearch}` : '',
      });
    },
    [history, search, current, pageSize],
  );

  return {
    data,
    loading: isLoading,
    error,
    mutate,
    pagination: {
      current,
      pageSize,
      total:
        Math.min(data?.total ?? 0, data?.listLimit ?? 0) || data?.total || 0,
    },
    setPagination,
  };
};
