import useSWRImmutable from 'swr/immutable';
import { getContractDetail } from '../request';

export const useContractDetail = <T extends string>(
  contractAddress?: string,
  fields: T[] = [],
  shouldFetch = true,
) => {
  return useSWRImmutable(
    shouldFetch && contractAddress
      ? `contract-detail-${contractAddress}-${fields.join(',')}`
      : null,
    () => getContractDetail(contractAddress, fields),
  );
};
