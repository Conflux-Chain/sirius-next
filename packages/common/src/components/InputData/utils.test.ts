import { describe, expect, test } from 'vitest';
import { parseArgs } from './utils';

describe('parseArgs', () => {
  test('converts bigint args to string', () => {
    expect(parseArgs([1n], [{ type: 'uint256' }] as any)).toEqual(['1']);
  });

  test('converts bigint values inside array args to string', () => {
    expect(parseArgs([[1n, 2n]], [{ type: 'uint256[]' }] as any)).toEqual([
      ['1', '2'],
    ]);
  });

  test('parses tuple args by component names', () => {
    const args = [{ owner: '0xabc', amount: 100n }];
    const abiParams = [
      {
        type: 'tuple',
        components: [
          { name: 'owner', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
      },
    ];

    expect(parseArgs(args, abiParams as any)).toEqual([['0xabc', '100']]);
  });

  test('parses tuple args by index when component name is missing', () => {
    const args = [['0xabc', 100n]];
    const abiParams = [
      {
        type: 'tuple',
        components: [{ type: 'address' }, { type: 'uint256' }],
      },
    ];

    expect(parseArgs(args, abiParams as any)).toEqual([['0xabc', '100']]);
  });

  test('parses tuple array args', () => {
    const args = [
      [
        { owner: '0xabc', amount: 100n },
        { owner: '0xdef', amount: 200n },
      ],
    ];
    const abiParams = [
      {
        type: 'tuple[]',
        components: [
          { name: 'owner', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
      },
    ];

    expect(parseArgs(args, abiParams as any)).toEqual([
      [
        ['0xabc', '100'],
        ['0xdef', '200'],
      ],
    ]);
  });
});
