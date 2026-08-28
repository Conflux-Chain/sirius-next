import { afterEach, describe, expect, test, vi } from 'vitest';
import { fetchWithCache } from './cache';

let keyId = 0;

const createKey = () => `cache-test-${keyId++}`;

describe('fetchWithCache', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test('returns the cached value until maxAge expires', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));

    const fetcher = vi
      .fn()
      .mockReturnValueOnce('first')
      .mockReturnValueOnce('second');
    const cachedFetcher = fetchWithCache(fetcher, {
      key: createKey(),
      maxAge: 100,
    });

    expect(cachedFetcher('same-input')).toBe('first');
    vi.advanceTimersByTime(100);
    expect(cachedFetcher('same-input')).toBe('first');
    expect(fetcher).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1);
    expect(cachedFetcher('same-input')).toBe('second');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  test('evicts rejected promises so the next call retries', async () => {
    const error = new Error('temporary failure');
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('retry-success');
    const cachedFetcher = fetchWithCache(fetcher, { key: createKey() });

    await expect(cachedFetcher('same-input')).rejects.toBe(error);
    await Promise.resolve();
    await expect(cachedFetcher('same-input')).resolves.toBe('retry-success');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
