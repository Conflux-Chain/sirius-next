import { afterEach, describe, expect, test, vi } from 'vitest';
import { useEnv } from '../store';
import { pubsub } from './pubsub';
import {
  appendApiPrefix,
  fetch,
  fetchWithOpenApi,
  fetchWithPrefix,
  sendRequestChart,
  sendRequestENSInfo,
  simpleGetFetcher,
} from './request';

const jsonResponse = (data: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...init,
  });

describe('request', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    useEnv.setState({ ENV_CONFIG: {} });
  });

  test('returns result value from successful status response', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue(
      jsonResponse({ status: '1', result: { ok: true } }),
    );

    await expect(fetch('/accounts', { method: 'GET' })).resolves.toEqual({
      ok: true,
    });
  });

  test('returns data value from successful code response', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue(
      jsonResponse({ code: 0, data: { total: 1 } }),
    );

    await expect(fetch('/accounts', { method: 'GET' })).resolves.toEqual({
      total: 1,
    });
  });

  test('rejects non-json non-html content types through current response checker', async () => {
    const response = new Response('icon', {
      status: 200,
      headers: { 'content-type': 'image/x-icon' },
    });
    vi.spyOn(window, 'fetch').mockResolvedValue(response);

    await expect(
      fetch<Response>('/favicon.ico', { showErrorMessage: false }),
    ).rejects.toMatchObject({
      response,
    });
  });

  test('rejects business error response and publishes notification', async () => {
    const notifications: any[] = [];
    const unsubscribe = pubsub.subscribe('notify', data => {
      notifications.push(data);
    });
    vi.spyOn(window, 'fetch').mockResolvedValue(
      jsonResponse({ code: 10001, message: 'Invalid request' }),
    );

    await expect(fetch('/failed', { method: 'GET' })).rejects.toMatchObject({
      message: 'Invalid request',
      status: 10001,
    });

    expect(notifications).toHaveLength(1);
    expect(notifications[0]).toMatchObject({
      type: 'request',
      option: {
        code: 10001,
        message: 'Invalid request',
      },
    });
    unsubscribe();
  });

  test('rejects http status errors', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue(
      new Response('not found', { status: 404, statusText: 'Not Found' }),
    );

    await expect(fetch('/missing', { method: 'GET' })).rejects.toMatchObject({
      name: 'HttpError',
      message: 'Not Found',
      status: 404,
    });
  });

  test('handles network errors and respects showErrorMessage=false', async () => {
    const notifications: any[] = [];
    const unsubscribe = pubsub.subscribe('notify', data => {
      notifications.push(data);
    });
    vi.spyOn(window, 'fetch').mockRejectedValue(
      new TypeError('Failed to fetch'),
    );

    await expect(
      fetch('/network-error', {
        method: 'GET',
        showErrorMessage: false,
      }),
    ).rejects.toThrow('Network error');

    expect(notifications).toHaveLength(0);
    unsubscribe();
  });

  test('rejects timed out non-HEAD requests', async () => {
    vi.useFakeTimers();
    vi.spyOn(window, 'fetch').mockImplementation(
      () => new Promise<Response>(() => undefined),
    );

    const promise = fetch('/slow', {
      method: 'GET',
      timeout: 1000,
      showErrorMessage: false,
    });
    const expectation = expect(promise).rejects.toThrow('Request timeout');
    await vi.advanceTimersByTimeAsync(1000);

    await expectation;
  });

  test('rejects aborted fetch requests', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    vi.spyOn(window, 'fetch').mockRejectedValue(abortError);

    await expect(
      fetch('/aborted', {
        method: 'GET',
        showErrorMessage: false,
      }),
    ).rejects.toThrow('Fetch aborted');
  });

  test('returns response for successful HEAD requests', async () => {
    const response = new Response(null, { status: 204 });
    vi.spyOn(window, 'fetch').mockResolvedValue(response);

    await expect(
      fetch<Response>('https://example.com/check', { method: 'HEAD' }),
    ).resolves.toBe(response);
  });

  test('returns synthetic response for timed out HEAD requests', async () => {
    vi.useFakeTimers();
    vi.spyOn(window, 'fetch').mockImplementation(
      () => new Promise<Response>(() => undefined),
    );

    const promise = fetch<Response>('https://example.com/check', {
      method: 'HEAD',
      timeout: 1000,
    });
    await vi.advanceTimersByTimeAsync(1000);
    const response = await promise;

    expect(response).toBeInstanceOf(Response);
    expect(response.ok).toBe(false);
    expect(response.status).toBe(408);
    expect(response.statusText).toBe('Request timeout');
  });

  test('returns synthetic response for failed HEAD requests', async () => {
    vi.spyOn(window, 'fetch').mockRejectedValue(
      new TypeError('Failed to fetch'),
    );

    const response = await fetch<Response>('https://example.com/check', {
      method: 'HEAD',
    });

    expect(response).toBeInstanceOf(Response);
    expect(response.ok).toBe(false);
    expect(response.status).toBe(599);
    expect(response.statusText).toBe('Failed to fetch');
  });

  test('appends api prefix only when needed', () => {
    expect(appendApiPrefix('/account')).toBe('/v1/account');
    expect(appendApiPrefix('account')).toBe('/v1/account');
    expect(appendApiPrefix('/stat/gasprice/tracker')).toBe(
      '/stat/gasprice/tracker',
    );
    expect(appendApiPrefix('https://example.com/account')).toBe(
      'https://example.com/account',
    );
  });

  test('fetchWithPrefix requests prefixed urls', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue(
      jsonResponse({ code: 0, data: { ok: true } }),
    );

    await expect(fetchWithPrefix('/account')).resolves.toEqual({ ok: true });

    expect(window.fetch).toHaveBeenCalledWith(
      '/v1/account',
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });

  test('fetchWithOpenApi requires configured host and joins url paths', async () => {
    expect(() => fetchWithOpenApi('/account')).toThrow(
      'ENV_OPEN_API_HOST is not set',
    );

    useEnv.setState({
      ENV_CONFIG: { ENV_OPEN_API_HOST: 'https://openapi.example.com' },
    });
    vi.spyOn(window, 'fetch').mockResolvedValue(
      jsonResponse({ code: 0, data: { ok: true } }),
    );

    await expect(fetchWithOpenApi('account')).resolves.toEqual({ ok: true });
    expect(window.fetch).toHaveBeenCalledWith(
      'https://openapi.example.com/account',
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });

  test('simpleGetFetcher serializes query and uses GET', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue(
      jsonResponse({ code: 0, data: { ok: true } }),
    );

    await expect(
      simpleGetFetcher(['/account', { address: 'cfx:test' }]),
    ).resolves.toEqual({ ok: true });

    expect(window.fetch).toHaveBeenCalledWith(
      '/v1/account?address=cfx%3Atest',
      expect.objectContaining({
        method: 'get',
        signal: expect.any(AbortSignal),
      }),
    );
  });

  test('sendRequestChart serializes query and reverses list', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue(
      jsonResponse({ code: 0, data: { list: [1, 2, 3] } }),
    );

    await expect(
      sendRequestChart({
        url: '/stat/chart',
        query: { interval: 'day' },
      }),
    ).resolves.toEqual({ list: [3, 2, 1] });

    expect(window.fetch).toHaveBeenCalledWith(
      '/stat/chart?interval=day',
      expect.objectContaining({
        method: 'GET',
        signal: expect.any(AbortSignal),
      }),
    );
  });

  test('sendRequestENSInfo returns empty object without url and map for response', async () => {
    await expect(sendRequestENSInfo()).resolves.toEqual({});

    vi.spyOn(window, 'fetch').mockResolvedValue(
      jsonResponse({ code: 0, data: { map: { 'cfx:test': 'alice.web3' } } }),
    );

    await expect(sendRequestENSInfo('/ens')).resolves.toEqual({
      'cfx:test': 'alice.web3',
    });
  });
});
