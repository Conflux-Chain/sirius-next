import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  clearIPFSGatewayDetectCache,
  clearIPFSGatewayListCache,
  detectIPFSGateway,
  detectIPFSGateways,
  fetchIPFSGatewayList,
  hostFromIPFSGateway,
  IPFS_GATEWAY_DETECT_STORAGE_PREFIX,
  IPFS_GATEWAY_GLOBAL_CACHE_KEY,
  IPFS_GATEWAY_LIST_STORAGE_PREFIX,
  IPFS_GATEWAY_RELOAD_CLEANED_KEY,
  normalizeIPFSGateway,
  tmplFromIPFSGateway,
} from './ipfsGateway';

const createResponse = (
  body: unknown,
  init: {
    ok?: boolean;
    status?: number;
    contentType?: string | null;
    delay?: number;
  } = {},
) => {
  const {
    ok = true,
    status = 200,
    contentType = 'application/json',
    delay = 0,
  } = init;

  return new Promise<Response>(resolve => {
    setTimeout(() => {
      resolve({
        ok,
        status,
        json: async () => body,
        headers: {
          get: (key: string) =>
            key.toLowerCase() === 'content-type' ? contentType : null,
        },
      } as Response);
    }, delay);
  });
};

const resetIPFSGatewayRuntimeCache = () => {
  delete (globalThis as any)[IPFS_GATEWAY_GLOBAL_CACHE_KEY];
  delete (globalThis as any)[IPFS_GATEWAY_RELOAD_CLEANED_KEY];
};

describe('ipfsGateway', () => {
  beforeEach(() => {
    clearIPFSGatewayDetectCache();
    clearIPFSGatewayListCache();
    resetIPFSGatewayRuntimeCache();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('normalizes gateway url and extracts host', () => {
    expect(normalizeIPFSGateway('https://ipfs.io/')).toBe('https://ipfs.io');
    expect(hostFromIPFSGateway('https://ipfs.io/ipfs')).toBe('ipfs.io');
    expect(hostFromIPFSGateway('ipfs.io/ipfs')).toBe('ipfs.io');
  });

  test('returns listed gateway template only for known gateways', () => {
    const gatewayList = ['https://ipfs.io', 'https://dweb.link'];

    expect(tmplFromIPFSGateway('https://ipfs.io/', gatewayList)).toBe(
      'https://ipfs.io',
    );
    expect(tmplFromIPFSGateway('https://example.com', gatewayList)).toBe(
      undefined,
    );
  });

  test('fetches and caches gateway list', async () => {
    const fetcher = vi.fn(() =>
      createResponse(['https://ipfs.io/', 'https://dweb.link']),
    ) as unknown as typeof globalThis.fetch;

    await expect(
      fetchIPFSGatewayList({ fetcher, listUrl: 'https://example.com/list' }),
    ).resolves.toEqual(['https://ipfs.io', 'https://dweb.link']);
    await fetchIPFSGatewayList({
      fetcher,
      listUrl: 'https://example.com/list',
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  test('reuses session cached gateway list after memory cache reset', async () => {
    const fetcher = vi.fn(() =>
      createResponse(['https://ipfs.io/', 'https://dweb.link']),
    ) as unknown as typeof globalThis.fetch;

    await expect(
      fetchIPFSGatewayList({ fetcher, listUrl: 'https://example.com/list' }),
    ).resolves.toEqual(['https://ipfs.io', 'https://dweb.link']);
    delete (globalThis as any).__SIRIUS_NEXT_IPFS_GATEWAY_CACHE__;
    await expect(
      fetchIPFSGatewayList({ fetcher, listUrl: 'https://example.com/list' }),
    ).resolves.toEqual(['https://ipfs.io', 'https://dweb.link']);

    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  test('detects a gateway by sample CID response', async () => {
    const fetcher = vi.fn(() =>
      createResponse('Hello from IPFS Gateway Checker', {
        contentType: 'text/plain; charset=utf-8',
      }),
    ) as unknown as typeof globalThis.fetch;

    const result = await detectIPFSGateway('https://ipfs.io/', { fetcher });

    expect(result.code).toBe('OK');
    expect(result.data.gateway).toBe('https://ipfs.io');
    expect(fetcher).toHaveBeenCalledWith(
      expect.stringContaining('/ipfs/'),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  test('marks non text/plain response as unavailable', async () => {
    const fetcher = vi.fn(() =>
      createResponse('<html></html>', { contentType: 'text/html' }),
    ) as unknown as typeof globalThis.fetch;

    await expect(
      detectIPFSGateway('https://ipfs.io', { fetcher }),
    ).resolves.toMatchObject({
      code: 'NOT_OK',
      message: 'fetch fail',
    });
  });

  test('reuses detected gateway latency in the same page visit', async () => {
    const fetcher = vi.fn(() =>
      createResponse('Hello from IPFS Gateway Checker', {
        contentType: 'text/plain; charset=utf-8',
        delay: 5,
      }),
    ) as unknown as typeof globalThis.fetch;

    const firstResult = await detectIPFSGateway('https://ipfs.io/', {
      fetcher,
    });
    const secondResult = await detectIPFSGateway('https://ipfs.io', {
      fetcher,
    });

    expect(firstResult).toBe(secondResult);
    expect(secondResult.data.time).toBe(firstResult.data.time);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  test('reuses session cached gateway latency after memory cache reset', async () => {
    const fetcher = vi.fn(() =>
      createResponse('Hello from IPFS Gateway Checker', {
        contentType: 'text/plain; charset=utf-8',
        delay: 5,
      }),
    ) as unknown as typeof globalThis.fetch;

    const firstResult = await detectIPFSGateway('https://ipfs.io/', {
      fetcher,
    });
    delete (globalThis as any).__SIRIUS_NEXT_IPFS_GATEWAY_CACHE__;
    const secondResult = await detectIPFSGateway('https://ipfs.io', {
      fetcher,
    });

    expect(secondResult).toEqual(firstResult);
    expect(secondResult.data.time).toBe(firstResult.data.time);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  test('clears session gateway caches on reload navigation entries', async () => {
    const staleListKey = `${IPFS_GATEWAY_LIST_STORAGE_PREFIX}https://example.com/stale-list`;
    const staleDetectUrl = 'https://stale.example/ipfs/test-cid';
    const staleDetectKey = `${IPFS_GATEWAY_DETECT_STORAGE_PREFIX}${staleDetectUrl}`;
    sessionStorage.setItem(
      staleListKey,
      JSON.stringify(['https://stale.example']),
    );
    sessionStorage.setItem(
      staleDetectKey,
      JSON.stringify({ data: { url: staleDetectUrl } }),
    );
    sessionStorage.setItem('other-cache-key', 'keep');
    vi.stubGlobal('performance', {
      getEntriesByType: vi.fn(() => [{ type: 'reload' }]),
    });
    resetIPFSGatewayRuntimeCache();
    const fetcher = vi.fn(() => createResponse(['https://fresh.example']));

    await expect(
      fetchIPFSGatewayList({
        fetcher,
        listUrl: 'https://example.com/fresh-list',
      }),
    ).resolves.toEqual(['https://fresh.example']);

    expect(sessionStorage.getItem(staleListKey)).toBeNull();
    expect(sessionStorage.getItem(staleDetectKey)).toBeNull();
    expect(sessionStorage.getItem('other-cache-key')).toBe('keep');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  test('clears session gateway caches on legacy performance.navigation reload', async () => {
    const staleListKey = `${IPFS_GATEWAY_LIST_STORAGE_PREFIX}https://example.com/stale-list`;
    const staleDetectUrl = 'https://stale.example/ipfs/test-cid';
    const staleDetectKey = `${IPFS_GATEWAY_DETECT_STORAGE_PREFIX}${staleDetectUrl}`;
    sessionStorage.setItem(
      staleListKey,
      JSON.stringify(['https://stale.example']),
    );
    sessionStorage.setItem(
      staleDetectKey,
      JSON.stringify({ data: { url: staleDetectUrl } }),
    );
    vi.stubGlobal('performance', {
      navigation: { type: 1 },
    });
    resetIPFSGatewayRuntimeCache();
    const fetcher = vi.fn(() => createResponse(['https://fresh.example']));

    await expect(
      fetchIPFSGatewayList({
        fetcher,
        listUrl: 'https://example.com/fresh-list',
      }),
    ).resolves.toEqual(['https://fresh.example']);

    expect(sessionStorage.getItem(staleListKey)).toBeNull();
    expect(sessionStorage.getItem(staleDetectKey)).toBeNull();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  test('detects gateways in batches and returns fastest', async () => {
    const fetcher = vi.fn((url: string) => {
      const delay = url.startsWith('https://slow.example') ? 20 : 5;
      return createResponse('Hello from IPFS Gateway Checker', {
        contentType: 'text/plain',
        delay,
      });
    }) as unknown as typeof globalThis.fetch;

    const result = await detectIPFSGateways({
      gateways: ['https://slow.example', 'https://fast.example'],
      pageSize: 1,
      fetcher,
    });

    expect(result.fastest).toBe('https://fast.example');
    expect(result.availableGateways).toHaveLength(2);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  test('uses a safe page size when pageSize is not positive', async () => {
    const fetcher = vi.fn(() =>
      createResponse('Hello from IPFS Gateway Checker', {
        contentType: 'text/plain',
      }),
    ) as unknown as typeof globalThis.fetch;

    await expect(
      detectIPFSGateways({
        gateways: ['https://gateway-1.example', 'https://gateway-2.example'],
        pageSize: 0,
        fetcher,
        useCache: false,
      }),
    ).resolves.toMatchObject({
      availableGateways: expect.any(Array),
    });
    await expect(
      detectIPFSGateways({
        gateways: ['https://gateway-3.example'],
        pageSize: -1,
        fetcher,
        useCache: false,
      }),
    ).resolves.toMatchObject({
      availableGateways: expect.any(Array),
    });

    expect(fetcher).toHaveBeenCalledTimes(3);
  });
});
