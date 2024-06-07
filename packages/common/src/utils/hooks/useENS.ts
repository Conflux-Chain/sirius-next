import { useEffect } from 'react';
import useSWR from 'swr';
import { sendRequestENSInfo } from 'src/utils/request';
import { useENSStore } from '../../store';
import { ENSType } from '../../store/types';
import { isCoreDisplayAddress } from '../address';
import { apiPrefix } from '../constants';

const ensUrl = (ens: ENSType, value: string | null | string[]) => {
  if (!value) return null;
  if (typeof value === 'string' && ens[value]) return null;

  let url = null;

  if (typeof value === 'string' && isCoreDisplayAddress(value)) {
    url = `${apiPrefix}/ens/reverse/match?address=${value}`;
  } else if (Array.isArray(value) && value.length) {
    const validAddresses = value.filter(
      v => typeof v === 'string' && isCoreDisplayAddress(v) && !ens[v],
    );
    if (validAddresses.length === 0) return null;

    const baseUrl = `${apiPrefix}/ens/reverse/match?`;
    const maxQueryLength = 1800 - baseUrl.length;

    const query = validAddresses.reduce((acc, curr, index) => {
      const newPart = `${index === 0 ? '' : '&'}address=${curr}`;
      if (acc.length + newPart.length > maxQueryLength) {
        return acc;
      }
      return acc + newPart;
    }, '');

    if (query) {
      url = baseUrl + query;
    }
  }

  return url;
};

export const useENS = (address: string | null | string[]) => {
  const { ens, setENS } = useENSStore();

  const url = ensUrl(ens, address);

  const { data } = useSWR(url, () => sendRequestENSInfo(url), {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (data) {
      setENS(data);
    }
  }, [data]);

  return { ens };
};
