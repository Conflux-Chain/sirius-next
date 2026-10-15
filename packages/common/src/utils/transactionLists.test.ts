import { describe, expect, test } from 'vitest';
import {
  MAX_TRANSACTION_LIST_URL_LENGTH,
  normalizeTransactionLists,
  parseTransactionListsFromUrl,
} from './transactionLists';

const address = '0x1111111111111111111111111111111111111111';
const key = `0x${'ab'.repeat(32)}`;
const authorization = {
  address,
  chainId: '0x0',
  nonce: '0x20000000000001',
  yParity: '0x1',
  r: `0x${'0'.repeat(63)}1`,
  s: '0x2',
};

describe('transaction lists', () => {
  test('preserves access list duplicates, storage key order, and empty lists', () => {
    const entry = { address, storageKeys: [key, key] };
    expect(normalizeTransactionLists({ accessList: [entry, entry] })).toEqual({
      accessList: [entry, entry],
    });
    expect(normalizeTransactionLists({ accessList: [] })).toEqual({
      accessList: [],
    });
    expect(normalizeTransactionLists({})).toEqual({});
  });

  test('normalizes signatures without losing large nonces or reordering authorizations', () => {
    const input = [authorization, { ...authorization, nonce: '0x02' }];
    expect(
      normalizeTransactionLists({ to: address, authorizationList: input }),
    ).toEqual({
      authorizationList: [
        { ...authorization, r: '0x1' },
        { ...authorization, r: '0x1', nonce: '0x2' },
      ],
    });
    expect(input[0]?.r).toBe(authorization.r);
  });

  test.each([
    null,
    {},
    [null],
    [{ address: '0x123', storageKeys: [] }],
    [{ address, storageKeys: ['0x01'] }],
    [{ address, storageKeys: '0x0' }],
  ])('rejects malformed access lists: %j', accessList => {
    expect(() => normalizeTransactionLists({ accessList })).toThrow(
      'accessList:',
    );
  });

  test.each([
    { chainId: '0x' },
    { chainId: `0x1${'0'.repeat(64)}` },
    { nonce: '0x10000000000000000' },
    { nonce: 9007199254740992 },
    { nonce: '-1' },
    { yParity: '0x2' },
    { r: undefined },
    { s: 'not-hex' },
    { address: '0x123' },
  ])('rejects malformed authorization fields: %j', patch => {
    expect(() =>
      normalizeTransactionLists({
        to: address,
        authorizationList: [{ ...authorization, ...patch }],
      }),
    ).toThrow('authorizationList:');
  });

  test('requires a non-empty authorization list and a target', () => {
    for (const authorizationList of [null, {}, [], [null]]) {
      expect(() =>
        normalizeTransactionLists({ to: address, authorizationList }),
      ).toThrow('authorizationList:');
    }
    expect(() =>
      normalizeTransactionLists({ authorizationList: [authorization] }),
    ).toThrow('requires a to address');
  });

  test('round-trips JSON query parameters and retains both lists', () => {
    const url = new URL('https://scan.example/simulate');
    url.searchParams.set('to', address);
    url.searchParams.set(
      'accessList',
      JSON.stringify([{ address, storageKeys: [key] }]),
    );
    url.searchParams.set('authorizationList', JSON.stringify([authorization]));
    expect(
      parseTransactionListsFromUrl(Object.fromEntries(url.searchParams)),
    ).toEqual({
      ok: true,
      lists: {
        accessList: [{ address, storageKeys: [key] }],
        authorizationList: [{ ...authorization, r: '0x1' }],
      },
    });
  });

  test.each(['accessList', 'authorizationList'] as const)(
    'rejects invalid or repeated URL %s',
    field => {
      for (const value of [
        '',
        null,
        ['[]', '[]'],
        '{',
        '{}',
        'null',
        ' '.repeat(MAX_TRANSACTION_LIST_URL_LENGTH + 1),
      ]) {
        expect(
          parseTransactionListsFromUrl({ to: address, [field]: value }),
        ).toEqual({ ok: false, field });
      }
    },
  );

  test('reports missing target as an authorization error', () => {
    expect(
      parseTransactionListsFromUrl({
        authorizationList: JSON.stringify([authorization]),
      }),
    ).toEqual({ ok: false, field: 'authorizationList' });
  });
});
