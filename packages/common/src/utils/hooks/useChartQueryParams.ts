import { useMemo } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const useChartQueryParams = ({
  preview = false,
  withoutToday = false,
}: {
  preview?: boolean;
  withoutToday?: boolean;
}) => {
  const yesterday = useMemo(
    () =>
      withoutToday ? dayjs().utc().startOf('day').subtract(1, 'day').unix() : 0,
    [withoutToday],
  );
  if (!withoutToday) {
    return preview
      ? {
          limit: '30',
          intervalType: 'day',
        }
      : undefined;
  }
  return preview
    ? {
        limit: '30',
        intervalType: 'day',
        maxTimestamp: yesterday,
      }
    : {
        maxTimestamp: yesterday,
      };
};
