import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { encodeFunctionData, encodeFunctionResult } from 'viem';
import type { Abi } from 'viem';
import type { AbiFunctionWithoutGas } from '../sdk';

const useContractDetail = vi.fn();
const useMethodAbi = vi.fn();

vi.mock('./useContractDetail', () => ({
  useContractDetail: (...args: unknown[]) => useContractDetail(...args),
}));
vi.mock('./useMethodAbi', () => ({
  useMethodAbi: (...args: unknown[]) => useMethodAbi(...args),
}));

import {
  useDecodeFunctionData,
  type DecodedFunctionData,
} from './useDecodeFunctionData';

const CONTRACT = '0x1111111111111111111111111111111111111111';
const IMPLEMENTATION = '0x2222222222222222222222222222222222222222';

const functionAbi: AbiFunctionWithoutGas[] = [
  {
    type: 'function',
    name: 'getValue',
    inputs: [{ name: 'key', type: 'uint256' }],
    outputs: [{ name: 'value', type: 'uint256' }],
    stateMutability: 'view',
  },
];

const input = encodeFunctionData({
  abi: functionAbi as Abi,
  functionName: 'getValue',
  args: [42n],
});
const output = encodeFunctionResult({
  abi: functionAbi as Abi,
  functionName: 'getValue',
  result: 123n,
});

const baseOptions = {
  to: CONTRACT,
  input,
  output,
  space: 'evm' as const,
  success: true,
  withOutput: true,
};

type DataOptions = Partial<Parameters<typeof useDecodeFunctionData>[0]>;

const renderData = (options: DataOptions = {}) =>
  renderHook(() =>
    useDecodeFunctionData({
      ...baseOptions,
      ...options,
    }),
  ).result.current;

const expectDecodedValue = (decoded: DecodedFunctionData) => {
  expect(decoded.decodedParams).toEqual({
    args: [42n],
    functionName: 'getValue',
  });
  expect(decoded.decodedResults).toEqual([123n]);
  expect(decoded.abiItem?.name).toBe('getValue');
};

describe('useDecodeFunctionData', () => {
  beforeEach(() => {
    useContractDetail.mockReset().mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    useMethodAbi.mockReset().mockReturnValue({
      data: undefined,
      isLoading: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('decodes from the external ABI before lower-priority sources', () => {
    const [decoded, isLoading] = renderData({ abi: functionAbi });

    expectDecodedValue(decoded);
    expect(isLoading).toBe(false);
    expect(useMethodAbi).toHaveBeenCalledWith(input.slice(0, 10), false);
  });

  test('keeps the external ABI result while contract data is loading', () => {
    useContractDetail
      .mockReset()
      .mockReturnValueOnce({ data: undefined, isLoading: true })
      .mockReturnValueOnce({ data: undefined, isLoading: true });

    const [decoded, isLoading] = renderData({ abi: functionAbi });

    expectDecodedValue(decoded);
    expect(isLoading).toBe(false);
  });

  test('falls back to the implementation ABI', () => {
    useContractDetail
      .mockReset()
      .mockReturnValueOnce({
        data: { implementation: { address: IMPLEMENTATION } },
        isLoading: false,
      })
      .mockReturnValueOnce({
        data: { abi: JSON.stringify(functionAbi) },
        isLoading: false,
      });

    const [decoded, isLoading] = renderData();

    expectDecodedValue(decoded);
    expect(isLoading).toBe(false);
    expect(useContractDetail).toHaveBeenNthCalledWith(
      2,
      IMPLEMENTATION,
      ['abi'],
      true,
    );
  });

  test('falls back to the contract ABI when implementation ABI is unavailable', () => {
    useContractDetail
      .mockReset()
      .mockReturnValueOnce({
        data: { abi: JSON.stringify(functionAbi) },
        isLoading: false,
      })
      .mockReturnValueOnce({ data: undefined, isLoading: false });

    const [decoded, isLoading] = renderData();

    expectDecodedValue(decoded);
    expect(isLoading).toBe(false);
  });

  test('falls back to a single method ABI and marks it as similar', () => {
    useMethodAbi.mockReturnValue({
      data: {
        list: [
          {
            fullName: 'getValue(uint256)',
            formatWithArg:
              'function getValue(uint256 key) view returns (uint256 value)',
          },
        ],
      },
      isLoading: false,
    });

    const [decoded, isLoading] = renderData({ supportMethodAbi: true });

    expectDecodedValue(decoded);
    expect(decoded.similarWarning).toBe(true);
    expect(isLoading).toBe(false);
    expect(useMethodAbi).toHaveBeenCalledWith(input.slice(0, 10), true);
  });

  test('returns loading while the implementation ABI is still pending', () => {
    useContractDetail
      .mockReset()
      .mockReturnValueOnce({
        data: { implementation: { address: IMPLEMENTATION } },
        isLoading: false,
      })
      .mockReturnValueOnce({ data: undefined, isLoading: true });

    const [decoded, isLoading] = renderData({ supportMethodAbi: true });

    expect(decoded).toEqual({});
    expect(isLoading).toBe(true);
    expect(useMethodAbi).toHaveBeenCalledWith(input.slice(0, 10), false);
  });

  test('returns a decode error after all ABI sources fail', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    useContractDetail
      .mockReset()
      .mockReturnValueOnce({ data: { abi: 'not-json' }, isLoading: false })
      .mockReturnValueOnce({ data: undefined, isLoading: false });

    const [decoded, isLoading] = renderData();

    expect(decoded).toMatchObject({ failed: true });
    expect(isLoading).toBe(false);
    expect(logSpy).toHaveBeenCalledWith(
      'decode function data and result error',
      expect.anything(),
    );
  });
});
