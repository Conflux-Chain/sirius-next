import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import qs from '@cfxjs/sirius-next-compat/dist/queryString.js';

export const useSearchParams = () => {
  const { search } = useLocation();
  return useMemo(() => qs.parse(search || ''), [search]);
};
