import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  devTargetId,
  getTrackId,
  prodTargetId,
  testTargetId,
  trackConfig,
} from './ga';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getTrackId', () => {
  test.each([
    ['confluxscan.org', prodTargetId],
    ['evm.confluxscan.org', prodTargetId],
    ['testnet.confluxscan.org', prodTargetId],
    ['evmtestnet.confluxscan.org', prodTargetId],
    ['nested.app.confluxscan.org', prodTargetId],
    ['confluxnetwork.org', testTargetId],
    ['testnet.confluxnetwork.org', testTargetId],
    ['nested.app.confluxnetwork.org', testTargetId],
    ['confluxscan.org.confluxnetwork.org', testTargetId],
    ['confluxnetwork.org.confluxscan.org', prodTargetId],
  ])('selects the configured target for %s', (hostname, targetId) => {
    vi.stubGlobal('window', { location: { hostname } });

    expect(getTrackId()).toBe(targetId);
  });

  test.each([
    'localhost',
    '127.0.0.1',
    'example.org',
    'notconfluxscan.org',
    'notconfluxnetwork.org',
    'confluxscan.org.attacker.example',
    'confluxnetwork.org.attacker.example',
    'app.confluxscan.org.attacker.example',
    'app.confluxnetwork.org.attacker.example',
    'confluxscanXorg',
    'confluxnetworkXorg',
  ])('uses the development target for unrelated host %s', hostname => {
    vi.stubGlobal('window', { location: { hostname } });

    expect(getTrackId()).toBe(devTargetId);
  });
});

describe('trackConfig', () => {
  test.each([
    ['evm.confluxscan.org', prodTargetId],
    ['testnet.confluxnetwork.org', testTargetId],
    ['confluxscan.org.attacker.example', devTargetId],
    ['confluxnetwork.org.attacker.example', devTargetId],
  ])('configures the selected target for %s', (hostname, targetId) => {
    const gtag = vi.fn();
    const config = { send_page_view: false };
    vi.stubGlobal('window', { location: { hostname }, gtag });

    trackConfig(config);

    expect(gtag).toHaveBeenCalledExactlyOnceWith('config', targetId, config);
  });

  test('does not throw when gtag is unavailable', () => {
    vi.stubGlobal('window', { location: { hostname: 'confluxscan.org' } });

    expect(() => trackConfig()).not.toThrow();
  });
});
