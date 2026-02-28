import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import qs from 'query-string';

export const useSearchParams = () => {
  const { search } = useLocation();
  return useMemo(() => qs.parse(search || ''), [search]);
};
