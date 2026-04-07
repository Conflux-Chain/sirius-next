import { describe, test, expect, vi, beforeAll } from 'vitest';
import {
  encodeFunctionData,
  encodeFunctionResult,
  encodeAbiParameters,
  toFunctionSelector,
} from 'viem';
import { formatAbiItem as formatCoreAbiItem } from 'cive/utils';
import type { Abi } from 'viem';

vi.mock('./constants', () => ({
  NETWORK_ID: 1029,
  LOCALSTORAGE_KEYS_MAP: {},
  COMMON_ERROR_OUTPUT_PREFIX: '0x08c379a0',
  COMMON_PANIC_OUTPUT_PREFIX: '0x4e487b71',
}));

// Dynamic import after mocking
const getSdk = () => import('./sdk');

// Helper: build error calldata = 4-byte selector + ABI-encoded params.
// viem's encodeErrorResult only returns the selector in v2, so we build it manually.
function buildErrorCalldata(
  errorName: string,
  inputTypes: { name: string; type: string }[],
  values: unknown[],
): `0x${string}` {
  // Use cive's formatAbiItem for selector computation (same as sdk.ts core path)
  const abiItem = {
    type: 'error' as const,
    name: errorName,
    inputs: inputTypes,
  };
  const selector = toFunctionSelector(formatCoreAbiItem(abiItem));
  if (values.length === 0) return selector;
  const encoded = encodeAbiParameters(inputTypes, values);
  return (selector + encoded.slice(2)) as `0x${string}`;
}

// ABI for testing – uses only non-address primitive types to avoid
// core vs. evm base32/hex address representation differences.
const testAbi: Abi = [
  {
    type: 'function',
    name: 'getValue',
    inputs: [{ name: 'key', type: 'uint256' }],
    outputs: [{ name: 'value', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setValues',
    inputs: [
      { name: 'a', type: 'uint256' },
      { name: 'b', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    name: 'InvalidValue',
    inputs: [{ name: 'value', type: 'uint256' }],
  },
  {
    type: 'error',
    name: 'Paused',
    inputs: [],
  },
];

describe('decodeFunctionData', () => {
  let decodeFunctionData: Awaited<
    ReturnType<typeof getSdk>
  >['decodeFunctionData'];

  beforeAll(async () => {
    ({ decodeFunctionData } = await getSdk());
  });

  test('evm: decodes single-param function calldata', () => {
    const calldata = encodeFunctionData({
      abi: testAbi,
      functionName: 'getValue',
      args: [42n],
    });

    const result = decodeFunctionData({
      data: calldata,
      abi: testAbi,
      space: 'evm',
    });
    expect(result.functionName).toBe('getValue');
    expect(result.args).toEqual([42n]);
  });

  test('evm: decodes multi-param function calldata', () => {
    const calldata = encodeFunctionData({
      abi: testAbi,
      functionName: 'setValues',
      args: [100n, 200n],
    });

    const result = decodeFunctionData({
      data: calldata,
      abi: testAbi,
      space: 'evm',
    });
    expect(result.functionName).toBe('setValues');
    expect(result.args).toEqual([100n, 200n]);
  });

  test('core: decodes single-param function calldata', () => {
    const calldata = encodeFunctionData({
      abi: testAbi,
      functionName: 'getValue',
      args: [99n],
    });

    const result = decodeFunctionData({
      data: calldata,
      abi: testAbi,
      space: 'core',
    });
    expect(result.functionName).toBe('getValue');
    expect(result.args).toEqual([99n]);
  });

  test('core: decodes multi-param function calldata', () => {
    const calldata = encodeFunctionData({
      abi: testAbi,
      functionName: 'setValues',
      args: [1n, 2n],
    });

    const result = decodeFunctionData({
      data: calldata,
      abi: testAbi,
      space: 'core',
    });
    expect(result.functionName).toBe('setValues');
    expect(result.args).toEqual([1n, 2n]);
  });
});

describe('decodeFunctionResult', () => {
  let decodeFunctionResult: Awaited<
    ReturnType<typeof getSdk>
  >['decodeFunctionResult'];

  beforeAll(async () => {
    ({ decodeFunctionResult } = await getSdk());
  });

  test('evm: decodes function result', () => {
    const encoded = encodeFunctionResult({
      abi: testAbi,
      functionName: 'getValue',
      result: 12345n,
    });

    const result = decodeFunctionResult({
      data: encoded,
      abi: testAbi,
      functionName: 'getValue',
      space: 'evm',
    });
    expect(result).toEqual(12345n);
  });

  test('core: decodes function result', () => {
    const encoded = encodeFunctionResult({
      abi: testAbi,
      functionName: 'getValue',
      result: 99999n,
    });

    const result = decodeFunctionResult({
      data: encoded,
      abi: testAbi,
      functionName: 'getValue',
      space: 'core',
    });
    expect(result).toEqual(99999n);
  });
});

describe('decodeErrorResult', () => {
  let decodeErrorResult: Awaited<
    ReturnType<typeof getSdk>
  >['decodeErrorResult'];

  beforeAll(async () => {
    ({ decodeErrorResult } = await getSdk());
  });

  test('evm: decodes error with inputs', () => {
    const encoded = buildErrorCalldata(
      'InvalidValue',
      [{ name: 'value', type: 'uint256' }],
      [500n],
    );

    const result = decodeErrorResult({
      data: encoded,
      abi: testAbi,
      space: 'evm',
    });
    expect(result.errorName).toBe('InvalidValue');
    expect(result.args).toEqual([500n]);
  });

  test('evm: decodes error without inputs', () => {
    const encoded = buildErrorCalldata('Paused', [], []);

    const result = decodeErrorResult({
      data: encoded,
      abi: testAbi,
      space: 'evm',
    });
    expect(result.errorName).toBe('Paused');
  });

  test('core: decodes error with inputs using selector matching', () => {
    const encoded = buildErrorCalldata(
      'InvalidValue',
      [{ name: 'value', type: 'uint256' }],
      [500n],
    );

    const result = decodeErrorResult({
      data: encoded,
      abi: testAbi,
      space: 'core',
    });
    expect(result.errorName).toBe('InvalidValue');
    expect(result.args).toEqual([500n]);
  });

  test('core: decodes error without inputs', () => {
    const encoded = buildErrorCalldata('Paused', [], []);

    const result = decodeErrorResult({
      data: encoded,
      abi: testAbi,
      space: 'core',
    });
    expect(result.errorName).toBe('Paused');
    expect(result.args).toBeUndefined();
  });

  test('core: selector is matched against ABI items', () => {
    // The core decodeErrorResult path uses toFunctionSelector(formatCoreAbiItem(x)).
    // Verify the selector embedded in the calldata matches the expected value.
    const inputs = [{ name: 'value', type: 'uint256' }];
    const encoded = buildErrorCalldata('InvalidValue', inputs, [42n]);

    // Selector is the first 10 characters ("0x" + 4 bytes)
    const embeddedSelector = encoded.slice(0, 10);
    const expectedSelector = toFunctionSelector(
      formatCoreAbiItem({ type: 'error', name: 'InvalidValue', inputs }),
    );

    expect(embeddedSelector).toBe(expectedSelector);

    const result = decodeErrorResult({
      data: encoded,
      abi: testAbi,
      space: 'core',
    });
    expect(result.errorName).toBe('InvalidValue');
    expect(result.args).toEqual([42n]);
  });

  test('core: throws for data with fewer than 10 hex characters (less than 4 bytes)', () => {
    expect(() =>
      decodeErrorResult({
        data: '0x1234' as `0x${string}`,
        abi: testAbi,
        space: 'core',
      }),
    ).toThrow('Invalid data');
  });

  test('core: throws for data not starting with 0x', () => {
    expect(() =>
      decodeErrorResult({
        data: 'deadbeef0000' as `0x${string}`,
        abi: testAbi,
        space: 'core',
      }),
    ).toThrow('Invalid data');
  });

  test('core: throws when selector does not match any ABI error', () => {
    // Use a selector that is not in the ABI
    const unknownData =
      '0xdeadbeef0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;
    expect(() =>
      decodeErrorResult({ data: unknownData, abi: testAbi, space: 'core' }),
    ).toThrow(/not found abi item for error signature/);
  });
});
