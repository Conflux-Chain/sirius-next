import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { expect, it, vi } from 'vitest';
import { useEventLogScan } from './useEventLogScan';

it('resumes Core pages with the server cursor and resets it when the scan changes', async () => {
  const cursor = { blockNumber: '0x30', logIndex: '0x2' };
  const fetchPage = vi
    .fn()
    .mockResolvedValue({ logs: [{}], nextCursor: cursor });
  const initialProps = { address: 'contract-A', fromEpoch: '12' };
  const { result, rerender } = renderHook(
    ({ address, fromEpoch }) =>
      useEventLogScan('core', address, { fromEpoch }, fetchPage),
    {
      initialProps,
      wrapper: ({ children }) => (
        <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
      ),
    },
  );
  await waitFor(() => expect(result.current.data?.nextCursor).toEqual(cursor));
  const first = fetchPage.mock.calls[0]![1];
  act(() => result.current.setCursor(cursor));
  await waitFor(() =>
    expect(fetchPage).toHaveBeenLastCalledWith('cfx_scanLogs', {
      ...first,
      cursor,
    }),
  );
  rerender({ ...initialProps, fromEpoch: '15' });
  await waitFor(() => expect(fetchPage).toHaveBeenCalledTimes(3));
  expect(fetchPage.mock.calls[2]![1]).toEqual({
    ...first,
    filter: { ...first.filter, fromEpoch: '0xf' },
  });
  act(() => result.current.setCursor(cursor));
  await waitFor(() => expect(fetchPage).toHaveBeenCalledTimes(4));
  rerender({ address: 'contract-B', fromEpoch: '15' });
  await waitFor(() => expect(fetchPage).toHaveBeenCalledTimes(5));
  expect(fetchPage.mock.calls[4]![1]).toEqual({
    ...first,
    filter: { ...first.filter, address: 'contract-B', fromEpoch: '0xf' },
  });
});
