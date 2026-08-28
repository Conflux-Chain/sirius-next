import { beforeEach, describe, expect, test } from 'vitest';
import { useENSStore, useEnv, useNametagCacheStore } from './index';

const ensEntry = (name: string) => ({
  name,
  expired: 0,
  delayed: 0,
});

describe('Zustand stores', () => {
  beforeEach(() => {
    useENSStore.setState({ ens: {} });
    useEnv.setState({ ENV_CONFIG: {} });
    useNametagCacheStore.setState({
      nametagCache: {},
      contractCache: {},
    });
  });

  test('merges new ENS entries without dropping existing entries', () => {
    useENSStore.getState().setENS({ alice: ensEntry('alice') });
    useENSStore.getState().setENS({ bob: ensEntry('bob') });

    expect(useENSStore.getState().ens).toEqual({
      alice: ensEntry('alice'),
      bob: ensEntry('bob'),
    });
  });

  test('merges nametag and contract cache updates independently', () => {
    useNametagCacheStore.getState().setNametagCache({ alice: 'Alice' });
    useNametagCacheStore.getState().setNametagCache({ bob: 'Bob' });
    useNametagCacheStore
      .getState()
      .setContractCache({ contract: { name: 'Token' } });

    expect(useNametagCacheStore.getState()).toMatchObject({
      nametagCache: {
        alice: 'Alice',
        bob: 'Bob',
      },
      contractCache: {
        contract: { name: 'Token' },
      },
    });
  });

  test('updates environment config while preserving the store action', () => {
    const setEnvConfig = useEnv.getState().SET_ENV_CONFIG;
    setEnvConfig({ ENV_NETWORK_ID: 1029 });

    expect(useEnv.getState().ENV_CONFIG).toEqual({ ENV_NETWORK_ID: 1029 });
    expect(useEnv.getState().SET_ENV_CONFIG).toBe(setEnvConfig);
  });
});
