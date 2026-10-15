import { beforeEach, describe, expect, test, vi } from 'vitest';

const rpc = vi.hoisted(() => ({ evm: vi.fn(), core: vi.fn() }));
vi.mock('../store', () => ({
  getEnvConfig: () => ({
    ENV_NETWORK_ID: 1029,
    ENV_RPC_SERVER: 'https://rpc.example',
  }),
}));
vi.mock('./constants', () => ({ NETWORK_ID: 1029 }));
vi.mock('viem', async () => {
  const actual = await vi.importActual<typeof import('viem')>('viem');
  return {
    ...actual,
    http: () => actual.custom({ request: rpc.evm }, { retryCount: 0 }),
  };
});
vi.mock('cive', async () => {
  const actual = await vi.importActual<typeof import('cive')>('cive');
  return {
    ...actual,
    http: () => actual.custom({ request: rpc.core }, { retryCount: 0 }),
  };
});

import { estimateGas, type CoreEstimateGasTag } from './sdk';

describe('gas estimation RPC serialization', () => {
  beforeEach(() => {
    rpc.evm.mockReset().mockResolvedValue('0x5208');
    rpc.core.mockReset().mockResolvedValue({
      gasLimit: '0x5208',
      gasUsed: '0x5000',
      storageCollateralized: '0x0',
    });
  });

  test('cive sends the Core access list on the wire', async () => {
    const address = 'cfx:acdrd6ahf4fmdj6rgw4n9k4wdxrzfe6ex6jc7pw50m';
    const accessList = [
      { address, storageKeys: [`0x${'01'.repeat(32)}` as const] },
    ];
    await expect(
      estimateGas({ space: 'core', to: address, value: '1', accessList }),
    ).resolves.toBe(21000n);
    expect(rpc.core).toHaveBeenCalledWith({
      method: 'cfx_estimateGasAndCollateral',
      params: [{ to: address, value: '0x1', accessList }, 'latest_state'],
    });
    expect(rpc.evm).not.toHaveBeenCalled();
  });

  test.each([
    [undefined, 'latest_state'],
    ['earliest', 'earliest'],
    ['latest_state', 'latest_state'],
    ['latest_checkpoint', 'latest_checkpoint'],
    ['latest_confirmed', 'latest_confirmed'],
    ['0x0', 'earliest'],
    ['0x00', 'earliest'],
    ['0x123', '0x123'],
    ['0x20000000000001', '0x20000000000001'],
  ] as const)(
    'Core estimates at epoch %s using RPC epoch %s',
    async (tag, epoch) => {
      await expect(
        estimateGas({
          space: 'core',
          tag,
          accessList: [],
          maxFeePerGas: '2',
          maxPriorityFeePerGas: '0',
        }),
      ).resolves.toBe(21000n);
      expect(rpc.core).toHaveBeenCalledWith({
        method: 'cfx_estimateGasAndCollateral',
        params: [
          { accessList: [], maxFeePerGas: '0x2', maxPriorityFeePerGas: '0x0' },
          epoch,
        ],
      });
      expect(rpc.evm).not.toHaveBeenCalled();
    },
  );

  test.each([
    'latest',
    'safe',
    'pending',
    'latest_mined',
    'latest_finalized',
    '0x',
    '0x-1',
    '123',
    '',
  ])('Core rejects unsupported epoch %s before RPC', async tag => {
    await expect(
      estimateGas({ space: 'core', tag: tag as CoreEstimateGasTag }),
    ).rejects.toThrow('Unsupported Core gas estimation tag');
    expect(rpc.core).not.toHaveBeenCalled();
    expect(rpc.evm).not.toHaveBeenCalled();
  });

  test('Core tag types exclude EVM tags and unsupported cive epochs', async () => {
    await expect(
      // @ts-expect-error Core does not accept the EVM latest tag.
      estimateGas({ space: 'core', tag: 'latest' }),
    ).rejects.toThrow();
    await expect(
      // @ts-expect-error This cive estimator excludes latest_finalized.
      estimateGas({ space: 'core', tag: 'latest_finalized' }),
    ).rejects.toThrow();
    await expect(
      // @ts-expect-error A Core epoch does not enable EIP-7702 authorizations.
      estimateGas({
        space: 'core',
        tag: 'latest_state',
        authorizationList: [],
      }),
    ).rejects.toThrow('does not support authorizationList');
    expect(rpc.core).not.toHaveBeenCalled();
  });

  test('viem sends EVM authorization quantities without number conversion', async () => {
    const address = '0x1111111111111111111111111111111111111111';
    const authorizationList = [
      {
        address,
        chainId: '0x0',
        nonce: '0xffffffffffffffff',
        yParity: '0x1',
        r: '0x1',
        s: '0x2',
      },
    ] as const;
    await expect(
      estimateGas({
        space: 'evm',
        to: address,
        authorizationList,
        accessList: [],
        tag: 'safe',
      }),
    ).resolves.toBe(21000n);
    const request = JSON.parse(JSON.stringify(rpc.evm.mock.calls[0]![0]));
    expect(request).toEqual({
      method: 'eth_estimateGas',
      params: [{ to: address, authorizationList, accessList: [] }, 'safe'],
    });
  });

  test.each(['latest', 'safe', 'pending', '0x0', '0x20000000000001'] as const)(
    'viem serializes access lists and fees at EVM block %s',
    async tag => {
      const address = '0x1111111111111111111111111111111111111111';
      const accessList = [
        { address, storageKeys: [`0x${'ab'.repeat(32)}` as const] },
      ];
      await expect(
        estimateGas({
          space: 'evm',
          to: address,
          account: address,
          accessList,
          tag,
          maxFeePerGas: '9007199254740993',
          maxPriorityFeePerGas: '0x0',
        }),
      ).resolves.toBe(21000n);
      expect(rpc.evm).toHaveBeenCalledWith({
        method: 'eth_estimateGas',
        params: [
          {
            from: address,
            to: address,
            accessList,
            maxFeePerGas: '0x20000000000001',
            maxPriorityFeePerGas: '0x0',
          },
          tag,
        ],
      });
    },
  );

  test('viem serializes explicit zero legacy fees without authorization', async () => {
    await estimateGas({ space: 'evm', gasPrice: '0', accessList: [] });
    expect(rpc.evm).toHaveBeenCalledWith({
      method: 'eth_estimateGas',
      params: [{ gasPrice: '0x0', accessList: [] }],
    });
  });

  test.each([
    { maxFeePerGas: `0x1${'0'.repeat(64)}` },
    { maxFeePerGas: '1', maxPriorityFeePerGas: '2' },
  ])('viem validates invalid EVM fees %j before RPC', async fees => {
    await expect(estimateGas({ space: 'evm', ...fees })).rejects.toThrow();
    expect(rpc.evm).not.toHaveBeenCalled();
  });

  test('viem retains mixed legacy and EIP-1559 fees for node validation', async () => {
    await estimateGas({ space: 'evm', gasPrice: '1', maxFeePerGas: '2' });
    expect(rpc.evm).toHaveBeenCalledWith({
      method: 'eth_estimateGas',
      params: [{ gasPrice: '0x1', maxFeePerGas: '0x2' }],
    });
  });

  test.each([
    [{ gasPrice: '9007199254740993' }, { gasPrice: '0x20000000000001' }],
    [{ gasPrice: '0x0' }, { gasPrice: '0x0' }],
    [{ maxFeePerGas: '0' }, { maxFeePerGas: '0x0' }],
    [{ maxPriorityFeePerGas: '0x0' }, { maxPriorityFeePerGas: '0x0' }],
    [
      { maxFeePerGas: '9007199254740993', maxPriorityFeePerGas: '0x2' },
      { maxFeePerGas: '0x20000000000001', maxPriorityFeePerGas: '0x2' },
    ],
    [
      { gasPrice: '1', maxFeePerGas: '2', maxPriorityFeePerGas: '3' },
      { gasPrice: '0x1', maxFeePerGas: '0x2', maxPriorityFeePerGas: '0x3' },
    ],
  ])(
    'Core serializes explicit fees %j without defaulting or losing precision',
    async (fees, expected) => {
      await expect(
        estimateGas({ space: 'core', accessList: [], ...fees }),
      ).resolves.toBe(21000n);
      expect(rpc.core).toHaveBeenCalledWith({
        method: 'cfx_estimateGasAndCollateral',
        params: [{ accessList: [], ...expected }, 'latest_state'],
      });
      expect(rpc.evm).not.toHaveBeenCalled();
    },
  );

  test('Core propagates fee validation errors returned by the node', async () => {
    rpc.core.mockRejectedValue({
      code: -32602,
      message: 'conflicting fee fields',
    });
    await expect(
      estimateGas({ space: 'core', gasPrice: '1', maxFeePerGas: '2' }),
    ).rejects.toThrow('conflicting fee fields');
  });
});
