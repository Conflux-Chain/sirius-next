import { describe, expect, it } from 'vitest';
import qs, { type ParsedQuery } from './queryString';

describe('queryString compatibility', () => {
  it('keeps repeated values, bare flags, empty values and sorted null-prototype keys', () => {
    const parsed: ParsedQuery<string> = qs.parse('?z=2&a&a=&a=one&z=1');
    expect(Object.getPrototypeOf(parsed)).toBeNull();
    expect(Object.keys(parsed)).toEqual(['a', 'z']);
    expect(parsed.a).toEqual([null, '', 'one']);
    expect(parsed.z).toEqual(['2', '1']);
    expect(qs.stringify(parsed)).toBe('a&a=&a=one&z=2&z=1');
  });

  it('encodes defaults, omits undefined, and retains null and empty array members', () => {
    expect(
      qs.stringify({
        z: undefined,
        a: [null, '', undefined, 'x'],
        empty: [],
        b: true,
        n: 2,
      }),
    ).toBe('a&a=&a=x&b=true&n=2');
    expect(qs.stringify({ q: " !'()*雪" })).toBe(
      'q=%20%21%27%28%29%2A%E9%9B%AA',
    );
    expect(qs.parse('n=02&b=true')).toEqual({ b: 'true', n: '02' });
  });

  it('decodes separators only after splitting and handles unicode and plus', () => {
    expect(qs.parse('a%26b=x%3Dy%26z&q=%E9%9B%AA+%2B')).toEqual({
      'a&b': 'x=y&z',
      q: '雪 +',
    });
    expect(qs.parse('bad=%E0%A4%A&ok=%E9%9B%AA').ok).toBe('雪');
    expect(qs.parse('__proto__=safe').__proto__).toBe('safe');
  });

  it('preserves empty ampersand segments and explicit empty keys', () => {
    expect(qs.parse('a=1&&b&')).toEqual({ '': [null, null], a: '1', b: null });
    expect(qs.parse('=x&=')).toEqual({ '': ['x', ''] });
    expect(qs.parse('=x&&=y')).toEqual({ '': ['x', null, 'y'] });
    expect(qs.parse('__sirius_empty_key__=safe&&')).toEqual({
      __sirius_empty_key__: 'safe',
      '': [null, null],
    });
    expect(Object.keys(qs.parse('z=1&&a=2', { sort: false }))).toEqual([
      'z',
      '',
      'a',
    ]);
    expect(qs.parseUrl('/x?a=1&&').query['']).toEqual([null, null]);
    expect(
      qs.parseUrl('/x#one+%2B', { parseFragmentIdentifier: true })
        .fragmentIdentifier,
    ).toBe('one +');
    expect(
      qs.parseUrl('/x#one+%2B', {
        parseFragmentIdentifier: true,
        decode: false,
      }).fragmentIdentifier,
    ).toBe('one+%2B');
  });

  it('extracts relative URLs and parses fragments only when requested', () => {
    expect(qs.extract('../path?a=1#hash?ignored=2')).toBe('a=1');
    expect(qs.parseUrl('../path?a=1#%E9%9B%AA')).toEqual({
      url: '../path',
      query: { a: '1' },
    });
    expect(
      qs.parseUrl('../path?a=1#%E9%9B%AA', { parseFragmentIdentifier: true }),
    ).toEqual({ url: '../path', query: { a: '1' }, fragmentIdentifier: '雪' });
    expect(
      qs.parseUrl('/x#', { parseFragmentIdentifier: true }),
    ).not.toHaveProperty('fragmentIdentifier');
  });

  it('replaces existing values, removes undefined overrides and preserves existing raw hashes', () => {
    expect(
      qs.stringifyUrl({
        url: '../path?b=2&a=old&a=older#raw%20hash',
        query: { a: ['new', 'next'], b: undefined, flag: null },
      }),
    ).toBe('../path?a=new&a=next&flag#raw%20hash');
    expect(
      qs.stringifyUrl({ url: '?a=1#old', fragmentIdentifier: '雪 !' }),
    ).toBe('?a=1#%E9%9B%AA%20%21');
    expect(qs.stringifyUrl({ url: '/x?#old', fragmentIdentifier: '' })).toBe(
      '/x#old',
    );
    expect(qs.stringifyUrl({ url: '/x?b=1', query: { a: '' } })).toBe(
      '/x?a=&b=1',
    );
  });
});
