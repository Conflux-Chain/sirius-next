import { useState } from 'react';
import useSWR from 'swr';
import { eventLogPageSize, eventLogScan } from '../eventLogScan';
import type {
  EventLogCursor,
  EventLogPage,
  EventLogRequest,
} from '../eventLogScan';
import type { Space } from '../types';

export function useEventLogScan<Log>(
  space: Space,
  address: string,
  query: Record<string, unknown>,
  fetchPage: (
    method: string,
    request: EventLogRequest,
  ) => Promise<EventLogPage<Log>>,
) {
  const scan = eventLogScan[space];
  const request = scan.request(address, scan.read(query));
  const scanKey = JSON.stringify([scan.method, request]);
  const [page, setPage] = useState<{ key: string; cursor?: EventLogCursor }>({
    key: scanKey,
  });
  // Reset before fetching so a changed range can never carry the old cursor.
  if (page.key !== scanKey) setPage({ key: scanKey });
  const cursor = page.key === scanKey ? page.cursor : undefined;
  const params = request && (cursor ? { ...request, cursor } : request);
  const { data, isLoading, error } = useSWR(
    params ? ([scan.method, params] as const) : null,
    ([method, params]) => fetchPage(method, params),
  );
  return {
    data,
    isLoading,
    error,
    valid: request !== null,
    scanKey,
    pageSize: eventLogPageSize,
    setCursor: (cursor?: EventLogCursor) => setPage({ key: scanKey, cursor }),
  };
}
