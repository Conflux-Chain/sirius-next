import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, afterEach, beforeEach, test, vi } from 'vitest';
import { SWRConfig } from 'swr';

const fetchWithPrefix = vi.fn();
const estimateGas = vi.fn();

vi.mock('../request', () => ({
  fetch: vi.fn(),
  fetchWithPrefix: (...args: unknown[]) => fetchWithPrefix(...args),
}));

vi.mock('../sdk', () => ({
  estimateGas: (...args: unknown[]) => estimateGas(...args),
}));

import {
  querySimulateTrace,
  useSimulateTrace,
  type SimulateTraceResponse,
  type SimulateTraceTxParams,
} from './useSimulateTrace';

const ROOT = '0x1111111111111111111111111111111111111111' as const;
const PROXY = '0x2222222222222222222222222222222222222222' as const;
const IMPL = '0x3333333333333333333333333333333333333333' as const;
const BEACON = '0x4444444444444444444444444444444444444444' as const;
const BEACON_IMPL = '0x5555555555555555555555555555555555555555' as const;
const TARGET = '0x6666666666666666666666666666666666666666' as const;
const CREATED = '0x7777777777777777777777777777777777777777' as const;
const METHOD_ID = '0x12345678' as const;

const baseTx: SimulateTraceTxParams = {
  from: ROOT,
  to: TARGET,
  data: METHOD_ID,
  gas: '0x100',
  space: 'evm',
};

const makeCall = (
  overrides: Partial<SimulateTraceResponse['traceCall']> = {},
): SimulateTraceResponse['traceCall'] => ({
  from: ROOT,
  to: TARGET,
  gas: '0x10',
  gasUsed: '0x8',
  input: '0x',
  value: '0',
  type: 'CALL',
  ...overrides,
});

const makeResponse = (
  traceCall: SimulateTraceResponse['traceCall'],
  overrides: Partial<SimulateTraceResponse> = {},
): SimulateTraceResponse => ({
  traceCall,
  addressArray: [],
  ...overrides,
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
);

const renderTrace = async (response: SimulateTraceResponse) => {
  fetchWithPrefix.mockResolvedValue(response);

  const { result } = renderHook(() => useSimulateTrace({ tx: baseTx }), {
    wrapper,
  });

  await waitFor(() => expect(result.current.data).toBeDefined());
  return result.current.data!;
};

describe('useSimulateTrace', () => {
  beforeEach(() => {
    fetchWithPrefix.mockReset();
    estimateGas.mockReset();
    estimateGas.mockResolvedValue(100n);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('formats nested calls, outcomes, proxy calls, and contract creation', async () => {
    const response = makeResponse(
      makeCall({
        to: PROXY,
        calls: [
          makeCall({
            from: PROXY,
            to: IMPL,
            type: 'DELEGATECALL',
            input: METHOD_ID,
          }),
          makeCall({
            from: PROXY,
            to: TARGET,
            error: 'Reverted',
            calls: [makeCall({ from: TARGET, to: CREATED })],
          }),
          makeCall({
            from: PROXY,
            to: CREATED,
            type: 'CREATE',
          }),
          makeCall({
            from: PROXY,
            to: TARGET,
            error: 'OutOfGas',
          }),
        ],
      }),
      {
        proxyMap: { [PROXY]: 'Proxy' },
        methodMap: {
          [METHOD_ID]: {
            [IMPL]: 'function transfer(address recipient, uint256 amount)',
          },
        },
      },
    );

    const data = await renderTrace(response);
    const root = data.list[0]!;
    const calls = root.calls!;

    expect(data.total).toBe(6);
    expect(root).toMatchObject({
      index: '0',
      type: 'call',
      gas: '16',
      gasUsed: '8',
      outcome: 'success',
      proxy: { type: 'Proxy', implAddress: IMPL },
    });
    expect(calls.map(call => call.index)).toEqual(['0_0', '0_1', '0_2', '0_3']);
    expect(calls[0]).toMatchObject({
      type: 'delegatecall',
      method: 'transfer',
      isCallImpl: true,
      abi: [{ name: 'transfer' }],
    });
    expect(calls[1]).toMatchObject({ outcome: 'reverted' });
    expect(calls[1]?.calls?.[0]).toMatchObject({
      index: '0_1_0',
      outcome: 'success',
    });
    expect(calls[2]).toMatchObject({
      type: 'create',
      to: undefined,
      contractCreated: CREATED,
    });
    expect(calls[3]).toMatchObject({ outcome: 'fail' });
  });

  test('formats beacon proxy and implementation calls', async () => {
    const response = makeResponse(
      makeCall({
        to: PROXY,
        calls: [
          makeCall({
            from: PROXY,
            to: BEACON,
            type: 'STATICCALL',
          }),
          makeCall({
            from: PROXY,
            to: BEACON_IMPL,
            type: 'DELEGATECALL',
          }),
        ],
      }),
      { proxyMap: { [PROXY]: 'BeaconProxy' } },
    );

    const data = await renderTrace(response);
    const root = data.list[0]!;
    const [beaconCall, implementationCall] = root.calls!;

    expect(root.proxy).toEqual({
      type: 'BeaconProxy',
      beaconAddress: BEACON,
      implAddress: BEACON_IMPL,
    });
    expect(beaconCall).toMatchObject({
      type: 'staticcall',
      isCallBeacon: true,
    });
    expect(implementationCall).toMatchObject({
      type: 'delegatecall',
      isCallImpl: true,
    });
  });

  test('keeps the method id when method ABI parsing fails', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const response = makeResponse(makeCall({ input: METHOD_ID }), {
      methodMap: { [METHOD_ID]: { [TARGET]: 'not-an-abi' } },
    });

    const data = await renderTrace(response);

    expect(data.list[0]).toMatchObject({
      method: METHOD_ID,
      abi: undefined,
    });
    expect(logSpy).toHaveBeenCalledWith(
      'parse method abi error: ',
      'not-an-abi',
      expect.anything(),
    );
  });

  test('estimates gas and adds the default max fee to the trace request', async () => {
    const response = makeResponse(makeCall());
    fetchWithPrefix.mockResolvedValue(response);
    estimateGas.mockResolvedValue(21000n);

    await querySimulateTrace(
      {
        from: ROOT,
        to: TARGET,
        data: METHOD_ID,
        value: '7',
        space: 'evm',
      },
      'safe',
      { tracer: 'callTracer', tracerConfig: { withLog: true } },
    );

    expect(estimateGas).toHaveBeenCalledWith({
      account: ROOT,
      to: TARGET,
      value: '7',
      data: METHOD_ID,
      space: 'evm',
    });
    const [url, options] = fetchWithPrefix.mock.calls[0] as [
      string,
      { body: string },
    ];
    const request = JSON.parse(options.body) as {
      params: [Record<string, unknown>, string, unknown];
    };

    expect(url).toBe('/traceCallView');
    expect(request.params[0]).toMatchObject({
      from: ROOT,
      to: TARGET,
      data: METHOD_ID,
      value: '7',
      gas: '0x5208',
      maxFeePerGas: '0x51f4d5c00',
    });
    expect(request.params[0]).not.toHaveProperty('space');
    expect(request.params[1]).toBe('safe');
    expect(request.params[2]).toEqual({
      tracer: 'callTracer',
      tracerConfig: { withLog: true },
    });
  });

  test('continues without gas when gas estimation fails', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    estimateGas.mockRejectedValue(new Error('estimate failed'));
    fetchWithPrefix.mockResolvedValue(makeResponse(makeCall()));

    await querySimulateTrace({
      from: ROOT,
      to: TARGET,
      data: METHOD_ID,
      space: 'evm',
    });

    const [, options] = fetchWithPrefix.mock.calls[0] as [
      string,
      { body: string },
    ];
    const request = JSON.parse(options.body) as {
      params: [Record<string, unknown>];
    };

    expect(request.params[0]).not.toHaveProperty('gas');
    expect(request.params[0]).toMatchObject({
      maxFeePerGas: '0x51f4d5c00',
    });
    expect(logSpy).toHaveBeenCalledWith(
      'estimate gas failed:',
      expect.any(Error),
    );
  });
});
