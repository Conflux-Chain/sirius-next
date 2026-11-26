import { describe, expect, it } from 'vitest';
import { eventLogScan } from './eventLogScan';

const topic0 = '0x' + 'aB'.repeat(32);
const cursor = { blockNumber: '0x100120', logIndex: '0x3' };

it.each([
  [
    'evm',
    'eth_scanLogs',
    'fromBlock',
    'toBlock',
    'latest',
    '0x' + '1'.repeat(40),
  ],
  [
    'core',
    'cfx_scanLogs',
    'fromEpoch',
    'toEpoch',
    'latest_state',
    'cfx:acckucyy5fhzknbxmeexwtaj3bxmeg25b2b50pta6v',
  ],
] as const)(
  'builds %s first and continuation requests',
  (space, method, from, to, latest, address) => {
    const scan = eventLogScan[space];
    expect(scan.method).toBe(method);
    expect(scan.request(address, scan.read({}))).toEqual({
      filter: { address, [from]: '0x0', [to]: latest },
      reverse: true,
      limit: 20,
    });
    const height = '9007199254740993';
    const values = scan.read({
      [from]: height,
      [to]: height,
      topic0: ` ${topic0} `,
    });
    expect(scan.request(address, values, cursor)).toEqual({
      filter: {
        address,
        [from]: '0x20000000000001',
        [to]: '0x20000000000001',
        topic0,
      },
      reverse: true,
      limit: 20,
      cursor,
    });
  },
);

describe.each(['evm', 'core'] as const)('%s validation', space => {
  const scan = eventLogScan[space];
  const [from, to] = scan.fields;
  it('keeps repeated query values visible and blocks invalid requests', () => {
    const values = scan.read({
      [from]: ['1', '2'],
      [to]: '-3',
      topic0: '0xabc',
    });
    expect(values).toMatchObject({ [from]: '1,2' });
    expect(scan.validate(values)).toEqual({
      [from]: 'invalidHeight',
      [to]: 'invalidHeight',
      topic0: 'invalidTopic0',
    });
    expect(scan.request('contract', values)).toBeNull();
  });
  it('rejects an inverted range without rounding the bounds', () => {
    const values = scan.read({
      [from]: '9007199254740993',
      [to]: '9007199254740992',
    });
    expect(scan.validate(values)).toEqual({ [to]: 'reversedRange' });
    expect(scan.request('contract', values)).toBeNull();
  });
});
