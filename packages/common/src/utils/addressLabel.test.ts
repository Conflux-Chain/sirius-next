import { describe, expect, it } from 'vitest';
import { isValidAddressLabel, sanitizeAddressLabels } from './addressLabel';

describe('address label validation', () => {
  it('accepts normal text labels, including Unicode text', () => {
    expect(isValidAddressLabel('Alice')).toBe(true);
    expect(isValidAddressLabel('我的钱包 1')).toBe(true);
    expect(isValidAddressLabel('team-alpha.v2')).toBe(true);
  });

  it('rejects URL-like and HTML-like values', () => {
    [
      'http://evil.com',
      'https://evil.com',
      ['java', 'script:alert(1)'].join(''),
      '//evil.com',
      'www.evil.com',
      '<b>admin</b>',
      'safe\nlabel',
      '   ',
    ].forEach(value => {
      expect(isValidAddressLabel(value)).toBe(false);
    });
  });

  it('enforces the length limit', () => {
    expect(isValidAddressLabel('a'.repeat(20))).toBe(true);
    expect(isValidAddressLabel('a'.repeat(21))).toBe(false);
  });

  it('removes invalid records and normalizes valid labels when loading data', () => {
    expect(
      sanitizeAddressLabels([
        { a: '0x1', l: ' Alice ', t: 1, u: 1 },
        { a: '0x2', l: 'http://evil.com', t: 2, u: 2 },
        { a: '0x3', l: '<img>', t: 3, u: 3 },
      ]),
    ).toEqual([{ a: '0x1', l: 'Alice', t: 1, u: 1 }]);
  });
});
