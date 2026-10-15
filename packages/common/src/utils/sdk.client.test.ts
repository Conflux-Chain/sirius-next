import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { Abi } from 'viem';

const getEnvConfigMock = vi.fn();
const defineEVMChainMock = vi.fn((chain: unknown) => chain);
const createPublicEVMClientMock = vi.fn();
const evmHttpMock = vi.fn();
const defineCoreChainMock = vi.fn((chain: unknown) => chain);
const createPublicCoreClientMock = vi.fn();
const coreHttpMock = vi.fn();

const evmClient = {
  estimateGas: vi.fn(),
  request: vi.fn(),
  simulateContract: vi.fn(),
};
const coreClient = {
  estimateGasAndCollateral: vi.fn(),
  simulateContract: vi.fn(),
};
const evmTransport = { space: 'evm' };
const coreTransport = { space: 'core' };

vi.mock('../store', () => ({
  getEnvConfig: (...args: unknown[]) => getEnvConfigMock(...args),
}));
vi.mock('./constants', () => ({
  NETWORK_ID: 1029,
}));
vi.mock('viem', async () => {
  const actual = await vi.importActual<typeof import('viem')>('viem');
  return {
    ...actual,
    defineChain: (chain: unknown) => defineEVMChainMock(chain),
    createPublicClient: (config: unknown) => createPublicEVMClientMock(config),
    http: () => evmHttpMock(),
  };
});
vi.mock('cive', async () => {
  const actual = await vi.importActual<typeof import('cive')>('cive');
  return {
    ...actual,
    defineChain: (chain: unknown) => defineCoreChainMock(chain),
    createPublicClient: (config: unknown) => createPublicCoreClientMock(config),
    http: () => coreHttpMock(),
  };
});

const DEFAULT_ENV_CONFIG = {
  ENV_NETWORK_ID: 1029,
  ENV_RPC_SERVER: 'https://rpc.example.com',
};
const EVM_ADDRESS = '0x1111111111111111111111111111111111111111';
const CORE_ADDRESS = 'cfx:acgtsq5m1j5m3x8x0m2j4p6h8r0v2n4b6t8y0u1s9a';
const CALL_DATA = '0x12345678' as `0x${string}`;
const functionAbi: Abi = [
  {
    type: 'function',
    name: 'getValue',
    inputs: [{ name: 'key', type: 'uint256' }],
    outputs: [{ name: 'value', type: 'uint256' }],
    stateMutability: 'view',
  },
];

const loadSdk = () => import('./sdk');

describe('sdk public clients', () => {
  beforeEach(() => {
    vi.resetModules();
    getEnvConfigMock.mockReset().mockReturnValue(DEFAULT_ENV_CONFIG);
    defineEVMChainMock.mockClear();
    createPublicEVMClientMock.mockReset().mockReturnValue(evmClient);
    evmHttpMock.mockReset().mockReturnValue(evmTransport);
    defineCoreChainMock.mockClear();
    createPublicCoreClientMock.mockReset().mockReturnValue(coreClient);
    coreHttpMock.mockReset().mockReturnValue(coreTransport);
    evmClient.estimateGas.mockReset();
    evmClient.request.mockReset();
    evmClient.simulateContract.mockReset();
    coreClient.estimateGasAndCollateral.mockReset();
    coreClient.simulateContract.mockReset();
  });

  test('estimateGas uses the EVM client and converts value to bigint', async () => {
    evmClient.estimateGas.mockResolvedValue(21000n);
    const { estimateGas } = await loadSdk();

    await expect(
      estimateGas({
        to: EVM_ADDRESS,
        data: CALL_DATA,
        value: '10',
        account: EVM_ADDRESS,
        space: 'evm',
      }),
    ).resolves.toBe(21000n);

    expect(evmClient.estimateGas).toHaveBeenCalledWith({
      to: EVM_ADDRESS,
      data: CALL_DATA,
      value: 10n,
      account: EVM_ADDRESS,
    });
    expect(createPublicEVMClientMock).toHaveBeenCalledTimes(1);
    expect(createPublicCoreClientMock).not.toHaveBeenCalled();
  });

  test('estimateGas uses Core estimateGasAndCollateral and returns gasLimit', async () => {
    coreClient.estimateGasAndCollateral.mockResolvedValue({
      gasLimit: 42000n,
      storageCollateralized: 0n,
    });
    const { estimateGas } = await loadSdk();

    await expect(
      estimateGas({
        to: CORE_ADDRESS,
        data: CALL_DATA,
        value: '20',
        account: CORE_ADDRESS,
        space: 'core',
      }),
    ).resolves.toBe(42000n);

    expect(coreClient.estimateGasAndCollateral).toHaveBeenCalledWith({
      to: CORE_ADDRESS,
      data: CALL_DATA,
      value: 20n,
      account: CORE_ADDRESS,
    });
    expect(createPublicCoreClientMock).toHaveBeenCalledTimes(1);
    expect(createPublicEVMClientMock).not.toHaveBeenCalled();
  });

  test('leaves omitted estimateGas value and account undefined', async () => {
    coreClient.estimateGasAndCollateral.mockResolvedValue({
      gasLimit: 21000n,
    });
    const { estimateGas } = await loadSdk();

    await estimateGas({ space: 'core' });

    expect(coreClient.estimateGasAndCollateral).toHaveBeenCalledWith({
      to: undefined,
      data: undefined,
      value: undefined,
      account: undefined,
    });
  });

  test('Core forwards access lists using base32 addresses and retains duplicates', async () => {
    coreClient.estimateGasAndCollateral.mockResolvedValue({ gasLimit: 42000n });
    const { estimateGas } = await loadSdk();
    const storageKey = `0x${'01'.repeat(32)}` as const;
    const entry = {
      address: CORE_ADDRESS,
      storageKeys: [storageKey, storageKey],
    };
    await expect(
      estimateGas({ space: 'core', accessList: [entry, entry] }),
    ).resolves.toBe(42000n);
    expect(coreClient.estimateGasAndCollateral).toHaveBeenCalledWith(
      expect.objectContaining({ accessList: [entry, entry] }),
    );
    expect(evmClient.request).not.toHaveBeenCalled();
  });

  test('Core rejects authorizationList before initializing or invoking any client', async () => {
    const { estimateGas } = await loadSdk();
    // @ts-expect-error Core authorization lists are also rejected at runtime.
    const result = estimateGas({ space: 'core', authorizationList: [] });
    await expect(result).rejects.toThrow('does not support authorizationList');
    expect(createPublicCoreClientMock).not.toHaveBeenCalled();
    expect(coreClient.estimateGasAndCollateral).not.toHaveBeenCalled();
    expect(evmClient.request).not.toHaveBeenCalled();
  });

  test('EVM estimates with RPC authorization quantities, access lists, fees and block', async () => {
    const { estimateGas } = await loadSdk();
    evmClient.request.mockResolvedValue('0x5208');
    const authorizationList = [
      {
        address: EVM_ADDRESS,
        chainId: '0x0',
        nonce: '0x20000000000001',
        yParity: '0x1',
        r: '0x1',
        s: '0x2',
      },
    ] as const;
    const accessList = [{ address: EVM_ADDRESS, storageKeys: [] }];
    await expect(
      estimateGas({
        space: 'evm',
        to: EVM_ADDRESS,
        account: EVM_ADDRESS,
        data: CALL_DATA,
        value: '10',
        maxFeePerGas: '30000000000',
        maxPriorityFeePerGas: '2',
        accessList,
        authorizationList,
        tag: '0x123',
      }),
    ).resolves.toBe(21000n);
    expect(evmClient.request).toHaveBeenCalledWith({
      method: 'eth_estimateGas',
      params: [
        {
          from: EVM_ADDRESS,
          to: EVM_ADDRESS,
          data: CALL_DATA,
          value: '0xa',
          maxFeePerGas: '0x6fc23ac00',
          maxPriorityFeePerGas: '0x2',
          accessList,
          authorizationList,
        },
        '0x123',
      ],
    });
    expect(evmClient.estimateGas).not.toHaveBeenCalled();
  });

  test.each([
    ['safe', { blockTag: 'safe' }],
    ['pending', { blockTag: 'pending' }],
    ['0x0', { blockNumber: 0n }],
    ['0x20000000000001', { blockNumber: 9007199254740993n }],
  ] as const)(
    'EVM uses the high-level estimator without authorizations at %s',
    async (tag, block) => {
      const { estimateGas } = await loadSdk();
      evmClient.estimateGas.mockResolvedValue(21000n);
      const accessList = [{ address: EVM_ADDRESS, storageKeys: [] }];
      await expect(
        estimateGas({
          space: 'evm',
          to: EVM_ADDRESS,
          account: EVM_ADDRESS,
          value: '0',
          accessList,
          maxFeePerGas: '9007199254740993',
          maxPriorityFeePerGas: '0x0',
          tag,
        }),
      ).resolves.toBe(21000n);
      expect(evmClient.estimateGas).toHaveBeenCalledWith({
        to: EVM_ADDRESS,
        account: EVM_ADDRESS,
        value: 0n,
        data: undefined,
        accessList,
        maxFeePerGas: 9007199254740993n,
        maxPriorityFeePerGas: 0n,
        ...block,
      });
      expect(evmClient.request).not.toHaveBeenCalled();
    },
  );

  test.each(['0x0', '9007199254740993'])(
    'EVM forwards legacy price %s through the high-level estimator',
    async gasPrice => {
      const { estimateGas } = await loadSdk();
      await estimateGas({ space: 'evm', gasPrice });
      expect(evmClient.estimateGas).toHaveBeenCalledWith(
        expect.objectContaining({ gasPrice: BigInt(gasPrice) }),
      );
      expect(evmClient.request).not.toHaveBeenCalled();
    },
  );

  test('EVM rejects malformed lists before submitting an estimate', async () => {
    const { estimateGas } = await loadSdk();
    await expect(
      estimateGas({
        space: 'evm',
        accessList: [{ address: 'bad', storageKeys: [] }],
      }),
    ).rejects.toThrow('accessList');
    expect(evmClient.request).not.toHaveBeenCalled();
    expect(evmClient.estimateGas).not.toHaveBeenCalled();
  });

  test('simulateContract delegates to the EVM client', async () => {
    const response = { result: 123n };
    evmClient.simulateContract.mockResolvedValue(response);
    const { simulateContract } = await loadSdk();

    await expect(
      simulateContract({
        address: EVM_ADDRESS,
        functionName: 'getValue',
        args: ['42'],
        abi: functionAbi,
        value: '5',
        account: EVM_ADDRESS,
        space: 'evm',
      }),
    ).resolves.toBe(response);

    expect(evmClient.simulateContract).toHaveBeenCalledWith({
      address: EVM_ADDRESS,
      functionName: 'getValue',
      args: ['42'],
      abi: functionAbi,
      value: 5n,
      account: EVM_ADDRESS,
    });
  });

  test('simulateContract delegates to the Core client', async () => {
    const response = { result: 456n };
    coreClient.simulateContract.mockResolvedValue(response);
    const { simulateContract } = await loadSdk();

    await expect(
      simulateContract({
        address: CORE_ADDRESS,
        functionName: 'getValue',
        args: ['7'],
        abi: functionAbi,
        value: '6',
        account: CORE_ADDRESS,
        space: 'core',
      }),
    ).resolves.toBe(response);

    expect(coreClient.simulateContract).toHaveBeenCalledWith({
      address: CORE_ADDRESS,
      functionName: 'getValue',
      args: ['7'],
      abi: functionAbi,
      value: 6n,
      account: CORE_ADDRESS,
    });
  });

  test('uses ENV_WALLET_CONFIG when creating an EVM client', async () => {
    const walletConfig = {
      chainId: 1029,
      chainName: 'Custom EVM',
      rpcUrls: ['https://custom-rpc.example.com'],
      blockExplorerUrls: ['https://scan.example.com'],
      nativeCurrency: {
        name: 'Custom CFX',
        symbol: 'CCFX',
        decimals: 18,
      },
    };
    getEnvConfigMock.mockReturnValue({
      ...DEFAULT_ENV_CONFIG,
      ENV_WALLET_CONFIG: walletConfig,
    });
    evmClient.estimateGas.mockResolvedValue(1n);
    const { estimateGas } = await loadSdk();

    await estimateGas({ space: 'evm' });

    expect(createPublicEVMClientMock).toHaveBeenCalledWith({
      chain: {
        id: 1029,
        name: 'Custom EVM',
        rpcUrls: {
          default: {
            http: ['https://custom-rpc.example.com'],
          },
        },
        nativeCurrency: walletConfig.nativeCurrency,
      },
      transport: evmTransport,
    });
  });

  test('builds the fallback chain from environment RPC configuration', async () => {
    getEnvConfigMock.mockReturnValue({
      ENV_NETWORK_ID: 1029,
      ENV_RPC_SERVER: 'https://fallback-rpc.example.com',
    });
    evmClient.estimateGas.mockResolvedValue(1n);
    const { estimateGas } = await loadSdk();

    await estimateGas({ space: 'evm' });

    expect(createPublicEVMClientMock).toHaveBeenCalledWith({
      chain: {
        id: 1029,
        name: 'Conflux Network',
        rpcUrls: {
          default: {
            http: ['https://fallback-rpc.example.com'],
          },
        },
        nativeCurrency: {
          name: 'Conflux',
          symbol: 'CFX',
          decimals: 18,
        },
      },
      transport: evmTransport,
    });
  });

  test('caches one client per space and reuses the cached client', async () => {
    evmClient.estimateGas.mockResolvedValue(21000n);
    evmClient.simulateContract.mockResolvedValue({ result: 1n });
    coreClient.estimateGasAndCollateral.mockResolvedValue({
      gasLimit: 42000n,
    });
    coreClient.simulateContract.mockResolvedValue({ result: 2n });
    const sdk = await loadSdk();

    await sdk.estimateGas({ space: 'evm' });
    await sdk.simulateContract({
      address: EVM_ADDRESS,
      functionName: 'getValue',
      abi: functionAbi,
      space: 'evm',
    });
    await sdk.estimateGas({ space: 'core' });
    await sdk.simulateContract({
      address: CORE_ADDRESS,
      functionName: 'getValue',
      abi: functionAbi,
      space: 'core',
    });
    await sdk.estimateGas({ space: 'evm' });
    await sdk.estimateGas({ space: 'core' });

    expect(createPublicEVMClientMock).toHaveBeenCalledTimes(1);
    expect(createPublicCoreClientMock).toHaveBeenCalledTimes(1);
    expect(evmClient.estimateGas).toHaveBeenCalledTimes(2);
    expect(coreClient.estimateGasAndCollateral).toHaveBeenCalledTimes(2);
  });
});
