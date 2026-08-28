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
