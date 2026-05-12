import React from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, useLocation } from 'react-router-dom';
import { SWRConfig } from 'swr';

const fetchWithPrefix = vi.fn();

vi.mock('../request', () => ({
  fetchWithPrefix: (...args: any[]) => fetchWithPrefix(...args),
}));

import { useTableData } from './useTableData';

const makeWrapper = (initialEntries: string[] = ['/']) => {
  const locationRef: { current: ReturnType<typeof useLocation> | null } = {
    current: null,
  };
  const LocationProbe = () => {
    locationRef.current = useLocation();
    return null;
  };
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <MemoryRouter initialEntries={initialEntries}>
        <Route path="*">
          <LocationProbe />
          {children}
        </Route>
      </MemoryRouter>
    </SWRConfig>
  );
  return { wrapper, locationRef };
};

describe('useTableData', () => {
  beforeEach(() => {
    fetchWithPrefix.mockReset();
    fetchWithPrefix.mockResolvedValue({ list: [], total: 0 });
  });

  test('uses default skip=0, limit=10 → current=1, pageSize=10', async () => {
    const { wrapper } = makeWrapper(['/']);
    const { result } = renderHook(() => useTableData({ url: '/txs' }), {
      wrapper,
    });

    expect(result.current.pagination).toEqual({
      current: 1,
      pageSize: 10,
      total: 0,
    });
    await waitFor(() =>
      expect(fetchWithPrefix).toHaveBeenCalledWith(
        expect.stringContaining('skip=0'),
      ),
    );
    expect(fetchWithPrefix.mock.calls[0]?.[0]).toContain('limit=10');
  });

  test('respects defaultSkip/defaultLimit overrides', async () => {
    const { wrapper } = makeWrapper(['/']);
    const { result } = renderHook(
      () => useTableData({ url: '/txs', defaultSkip: 0, defaultLimit: 25 }),
      { wrapper },
    );
    expect(result.current.pagination.pageSize).toBe(25);
    await waitFor(() =>
      expect(fetchWithPrefix.mock.calls[0]?.[0]).toContain('limit=25'),
    );
  });

  test('parses skip=20&limit=10 → current=3, pageSize=10', async () => {
    const { wrapper } = makeWrapper(['/?skip=20&limit=10']);
    const { result } = renderHook(() => useTableData({ url: '/txs' }), {
      wrapper,
    });
    expect(result.current.pagination.current).toBe(3);
    expect(result.current.pagination.pageSize).toBe(10);
  });

  test('invalid values fall back to defaults', async () => {
    const { wrapper } = makeWrapper(['/?skip=abc&limit=-5']);
    const { result } = renderHook(() => useTableData({ url: '/txs' }), {
      wrapper,
    });
    expect(result.current.pagination).toMatchObject({
      current: 1,
      pageSize: 10,
    });
  });

  test('reads total from response', async () => {
    fetchWithPrefix.mockResolvedValue({ list: [], total: 123 });
    const { wrapper } = makeWrapper(['/']);
    const { result } = renderHook(() => useTableData({ url: '/txs' }), {
      wrapper,
    });
    await waitFor(() => expect(result.current.pagination.total).toBe(123));
  });

  test('shouldFetch=false skips request', () => {
    const { wrapper } = makeWrapper(['/']);
    renderHook(() => useTableData({ url: '/txs', shouldFetch: false }), {
      wrapper,
    });
    expect(fetchWithPrefix).not.toHaveBeenCalled();
  });

  test('merges extra query into request url', async () => {
    const { wrapper } = makeWrapper(['/']);
    renderHook(
      () => useTableData({ url: '/txs', query: { address: '0xabc' } }),
      { wrapper },
    );
    await waitFor(() => expect(fetchWithPrefix).toHaveBeenCalled());
    const calledUrl = fetchWithPrefix.mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain('address=0xabc');
    expect(calledUrl).toContain('skip=0');
    expect(calledUrl).toContain('limit=10');
  });

  test('carries other URL search params into the request url', async () => {
    const { wrapper } = makeWrapper(['/?status=1&token=USDT&skip=0&limit=10']);
    renderHook(() => useTableData({ url: '/txs' }), { wrapper });
    await waitFor(() => expect(fetchWithPrefix).toHaveBeenCalled());
    const calledUrl = fetchWithPrefix.mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain('status=1');
    expect(calledUrl).toContain('token=USDT');
    expect(calledUrl).toContain('skip=0');
    expect(calledUrl).toContain('limit=10');
  });

  test('URL search param takes precedence over explicit query of same key', async () => {
    const { wrapper } = makeWrapper(['/?status=1']);
    renderHook(() => useTableData({ url: '/txs', query: { status: '2' } }), {
      wrapper,
    });
    await waitFor(() => expect(fetchWithPrefix).toHaveBeenCalled());
    const calledUrl = fetchWithPrefix.mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain('status=1');
    expect(calledUrl).not.toContain('status=2');
  });

  test('setPagination({ current: 2 }) writes skip/limit back to URL', async () => {
    const { wrapper, locationRef } = makeWrapper(['/list?foo=bar']);
    const { result } = renderHook(() => useTableData({ url: '/txs' }), {
      wrapper,
    });

    act(() => {
      result.current.setPagination({ current: 2 });
    });

    await waitFor(() => {
      expect(locationRef.current?.search).toContain('skip=10');
    });
    expect(locationRef.current?.search).toContain('limit=10');
    expect(locationRef.current?.search).toContain('foo=bar');
    expect(locationRef.current?.pathname).toBe('/list');
  });

  test('setPagination({ pageSize: 20 }) recomputes skip from current page', async () => {
    const { wrapper, locationRef } = makeWrapper(['/?skip=20&limit=10']);
    const { result } = renderHook(() => useTableData({ url: '/txs' }), {
      wrapper,
    });

    // current=3, pageSize=10 → switching to pageSize=20 uses (3-1)*20=40
    act(() => {
      result.current.setPagination({ pageSize: 20 });
    });

    await waitFor(() => {
      expect(locationRef.current?.search).toContain('limit=20');
    });
    expect(locationRef.current?.search).toContain('skip=40');
  });
});
