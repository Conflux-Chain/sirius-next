import useSWR from 'swr';
import {
  reqContractsStatistics,
  reqVerifiedContractsStatistics,
} from '../request';
import { useMemo } from 'react';

export const useContractsStatistics = () => {
  const { data: contractsStatistics, isLoading: contractsStatisticsLoading } =
    useSWR('contracts-statistics', () =>
      reqContractsStatistics({ limit: '2' }),
    );
  const {
    data: verifiedContractsStatistics,
    isLoading: verifiedContractsStatisticsLoading,
  } = useSWR('verified-contracts-statistics', () =>
    reqVerifiedContractsStatistics({ limit: '2' }),
  );
  return useMemo(() => {
    const [todayContracts, yesterdayContracts] =
      contractsStatistics?.list ?? [];
    const [todayVerifiedContracts, yesterdayVerifiedContracts] =
      verifiedContractsStatistics?.list ?? [];
    return [
      {
        totalContractsDeployed: todayContracts?.total,
        newContractsDeployed: yesterdayContracts?.count,
        totalContractsVerified: todayVerifiedContracts?.total,
        newContractsVerified: yesterdayVerifiedContracts?.count,
      },
      contractsStatisticsLoading || verifiedContractsStatisticsLoading,
    ] as const;
  }, [
    contractsStatistics,
    contractsStatisticsLoading,
    verifiedContractsStatistics,
    verifiedContractsStatisticsLoading,
  ]);
};
