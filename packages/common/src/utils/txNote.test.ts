import { describe, expect, it } from 'vitest';
import { isValidTxNote, sanitizeTxNotes } from './txNote';

describe('transaction note validation', () => {
  it('accepts normal text notes, including Unicode text', () => {
    expect(isValidTxNote('Alice')).toBe(true);
    expect(isValidTxNote('我的交易 1')).toBe(true);
    expect(isValidTxNote('team-alpha.v2')).toBe(true);
  });

  it('rejects URL-like, HTML-like, and control-character values', () => {
    [
      'http://evil.com',
      'https://evil.com',
      ['java', 'script:alert(1)'].join(''),
      '//evil.com',
      'www.evil.com',
      '<b>admin</b>',
      'safe\nnote',
      '   ',
    ].forEach(value => {
      expect(isValidTxNote(value)).toBe(false);
    });
  });

  it('enforces the length limit', () => {
    expect(isValidTxNote('a'.repeat(20))).toBe(true);
    expect(isValidTxNote('a'.repeat(21))).toBe(false);
  });

  it('removes invalid records and normalizes valid notes when loading data', () => {
    const hash = `0x${'1'.repeat(64)}`;

    expect(
      sanitizeTxNotes([
        { h: hash, n: ' Alice ', t: 1, u: 1 },
        { h: `0x${'2'.repeat(64)}`, n: 'http://evil.com', t: 2, u: 2 },
        { h: `0x${'3'.repeat(64)}`, n: '<img>', t: 3, u: 3 },
        { h: 'not-a-hash', n: 'valid', t: 4, u: 4 },
      ]),
    ).toEqual([{ h: hash, n: 'Alice', t: 1, u: 1 }]);
  });
});
