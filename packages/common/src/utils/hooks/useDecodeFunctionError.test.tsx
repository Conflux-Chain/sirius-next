import { renderHook } from '@testing-library/react';
import { encodeAbiParameters, toFunctionSelector } from 'viem';
import type { AbiItem } from '../sdk';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

const useContractDetail = vi.fn();
const useAbiItemById = vi.fn();

vi.mock('./useContractDetail', () => ({
  useContractDetail: (...args: unknown[]) => useContractDetail(...args),
}));
vi.mock('./useAbiItemById', () => ({
  useAbiItemById: (...args: unknown[]) => useAbiItemById(...args),
}));

import { useDecodeFunctionError } from './useDecodeFunctionError';

const CONTRACT = '0x1111111111111111111111111111111111111111';
const IMPLEMENTATION = '0x2222222222222222222222222222222222222222';

const errorInputs = [{ name: 'value', type: 'uint256' }] as const;
const errorAbi: AbiItem[] = [
  {
    type: 'error',
    name: 'InvalidValue',
    inputs: errorInputs,
  },
];
const errorSelector = toFunctionSelector('InvalidValue(uint256)');
const customErrorData = (errorSelector +
  encodeAbiParameters(errorInputs, [42n]).slice(2)) as `0x${string}`;
const standardErrorData = ('0x08c379a0' +
  encodeAbiParameters([{ type: 'string' }], ['execution reverted']).slice(
    2,
  )) as `0x${string}`;

const baseOptions = {
  errorData: customErrorData,
  to: CONTRACT,
  space: 'evm' as const,
};

type ErrorOptions = Partial<Parameters<typeof useDecodeFunctionError>[0]>;

const renderError = (options: ErrorOptions = {}) =>
  renderHook(() =>
    useDecodeFunctionError({
      ...baseOptions,
      ...options,
    }),
  ).result.current;

const expectInvalidValue = (decoded: {
  errorName: string;
  args?: readonly unknown[];
}) => {
  expect(decoded.errorName).toBe('InvalidValue');
  expect(decoded.args).toEqual([42n]);
};

describe('useDecodeFunctionError', () => {
  beforeEach(() => {
    useContractDetail.mockReset().mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    useAbiItemById.mockReset().mockReturnValue({
      data: undefined,
      isLoading: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('decodes standard Error before lower-priority loading state', () => {
    useContractDetail
      .mockReset()
      .mockReturnValueOnce({ data: undefined, isLoading: true })
      .mockReturnValueOnce({ data: undefined, isLoading: true });
    useAbiItemById.mockReturnValue({ data: undefined, isLoading: true });

    const [decoded, isLoading] = renderError({
      errorData: standardErrorData,
    });

    expect(decoded).toMatchObject({
      errorName: 'Error',
      args: ['execution reverted'],
    });
    expect(isLoading).toBe(false);
  });

  test('decodes from the external error ABI first', () => {
    const [decoded, isLoading] = renderError({ abi: errorAbi });

    expectInvalidValue(decoded!);
    expect(isLoading).toBe(false);
    expect(useAbiItemById).toHaveBeenCalledWith(errorSelector, 'error', false);
  });

  test('falls back to the implementation error ABI', () => {
    useContractDetail
      .mockReset()
      .mockReturnValueOnce({
        data: { implementation: { address: IMPLEMENTATION } },
        isLoading: false,
      })
      .mockReturnValueOnce({
        data: { abi: JSON.stringify(errorAbi) },
        isLoading: false,
      });

    const [decoded, isLoading] = renderError();

    expectInvalidValue(decoded!);
    expect(isLoading).toBe(false);
    expect(useContractDetail).toHaveBeenNthCalledWith(
      2,
      IMPLEMENTATION,
      ['abi'],
      true,
    );
  });

  test('falls back to the contract error ABI', () => {
    useContractDetail
      .mockReset()
      .mockReturnValueOnce({
        data: { abi: JSON.stringify(errorAbi) },
        isLoading: false,
      })
      .mockReturnValueOnce({ data: undefined, isLoading: false });

    const [decoded, isLoading] = renderError();

    expectInvalidValue(decoded!);
    expect(isLoading).toBe(false);
  });

  test('falls back to a single error ABI result', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    useContractDetail
      .mockReset()
      .mockReturnValueOnce({ data: { abi: 'not-json' }, isLoading: false })
      .mockReturnValueOnce({ data: undefined, isLoading: false });
    useAbiItemById.mockReturnValue({
      data: {
        error: {
          [errorSelector]: [
            {
              signature: 'InvalidValue(uint256)',
              fullFormat: 'error InvalidValue(uint256 value)',
            },
          ],
        },
      },
      isLoading: false,
    });

    const [decoded, isLoading] = renderError({ supportErrorAbi: true });

    expectInvalidValue(decoded!);
    expect(isLoading).toBe(false);
    expect(useAbiItemById).toHaveBeenCalledWith(errorSelector, 'error', true);
    expect(logSpy).toHaveBeenCalledWith(
      'decode error data with contract abi failed',
      expect.anything(),
    );
  });

  test('keeps loading while the implementation error ABI is pending', () => {
    useContractDetail
      .mockReset()
      .mockReturnValueOnce({
        data: { implementation: { address: IMPLEMENTATION } },
        isLoading: false,
      })
      .mockReturnValueOnce({ data: undefined, isLoading: true });

    const [decoded, isLoading] = renderError({ supportErrorAbi: true });

    expect(decoded).toBeNull();
    expect(isLoading).toBe(true);
    expect(useAbiItemById).toHaveBeenCalledWith(errorSelector, 'error', false);
  });

  test('returns a failed result after all error ABI sources fail', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    useContractDetail
      .mockReset()
      .mockReturnValueOnce({ data: { abi: 'not-json' }, isLoading: false })
      .mockReturnValueOnce({ data: undefined, isLoading: false });

    const [decoded, isLoading] = renderError();

    expect(decoded).toMatchObject({
      errorName: 'unknown',
      noAbi: false,
      failed: true,
    });
    expect(isLoading).toBe(false);
    expect(logSpy).toHaveBeenCalledWith(
      'decode error data with contract abi failed',
      expect.anything(),
    );
  });

  test('returns noAbi when no error ABI source is available', () => {
    const [decoded, isLoading] = renderError({
      errorData: '0xdeadbeef' as `0x${string}`,
    });

    expect(decoded).toMatchObject({
      errorName: 'unknown',
      noAbi: true,
    });
    expect(isLoading).toBe(false);
  });
});
