import { describe, expect, test } from 'vitest';
import {
  hideProxyCallInTreeTrace,
  treeTraceToList,
  type TreeTraceForUI,
} from './useTxTrace';

const makeTrace = (
  index: string,
  extra: Partial<TreeTraceForUI> = {},
): TreeTraceForUI => ({
  index,
  type: 'call',
  from: `from-${index}`,
  to: `to-${index}`,
  value: '0',
  nameMap: {},
  ...extra,
});

describe('treeTraceToList', () => {
  test('flattens tree traces in depth-first order', () => {
    const tree = [
      makeTrace('0', {
        calls: [
          makeTrace('0_0'),
          makeTrace('0_1', {
            calls: [makeTrace('0_1_0')],
          }),
        ],
      }),
      makeTrace('1'),
    ];

    expect(treeTraceToList(tree).map(item => item.index)).toEqual([
      '0',
      '0_0',
      '0_1',
      '0_1_0',
      '1',
    ]);
  });

  test('hides proxy calls by default', () => {
    const tree = [
      makeTrace('0', {
        calls: [
          makeTrace('0_0', { isCallBeacon: true }),
          makeTrace('0_1', { isCallImpl: true }),
          makeTrace('0_2'),
        ],
      }),
    ];

    expect(treeTraceToList(tree).map(item => item.index)).toEqual(['0', '0_2']);
  });

  test('keeps proxy calls when showProxyCall is true', () => {
    const tree = [
      makeTrace('0', {
        calls: [
          makeTrace('0_0', { isCallBeacon: true }),
          makeTrace('0_1', { isCallImpl: true }),
        ],
      }),
    ];

    expect(treeTraceToList(tree, true).map(item => item.index)).toEqual([
      '0',
      '0_0',
      '0_1',
    ]);
  });
});

describe('hideProxyCallInTreeTrace', () => {
  test('removes proxy calls but keeps their visible children', () => {
    const tree = [
      makeTrace('0', {
        calls: [
          makeTrace('0_0', {
            isCallBeacon: true,
            calls: [makeTrace('0_0_0')],
          }),
          makeTrace('0_1', {
            isCallImpl: true,
            calls: [makeTrace('0_1_0')],
          }),
        ],
      }),
    ];

    expect(hideProxyCallInTreeTrace(tree)).toEqual([
      makeTrace('0', {
        calls: [makeTrace('0_0_0'), makeTrace('0_1_0')],
      }),
    ]);
  });

  test('does not mutate original traces', () => {
    const tree = [
      makeTrace('0', {
        calls: [
          makeTrace('0_0', {
            isCallImpl: true,
            calls: [makeTrace('0_0_0')],
          }),
        ],
      }),
    ];

    hideProxyCallInTreeTrace(tree);

    expect(tree[0]!.calls?.[0]?.index).toBe('0_0');
    expect(tree[0]!.calls?.[0]?.isCallImpl).toBe(true);
  });
});
