import { roundToFixedPrecision } from './index';

describe('roundToFixedPrecision', () => {
  // Test default rounding
  it('rounds to the nearest value with default rounding', () => {
    expect(roundToFixedPrecision(1.005, 2)).toBe('1.01');
  });

  // Test string input with '<'
  it('returns the original string if it includes "<"', () => {
    expect(roundToFixedPrecision('<1.005', 2)).toBe('<1.005');
  });

  // Test rounding down with FLOOR
  it('rounds down to the nearest value with FLOOR method', () => {
    expect(roundToFixedPrecision(1.007, 2, 'FLOOR')).toBe('1.00');
  });

  // Test rounding up with CEIL
  it('rounds up to the nearest value with CEIL method', () => {
    expect(roundToFixedPrecision(1.001, 2, 'CEIL')).toBe('1.01');
  });

  // Test negative number rounding
  it('correctly rounds a negative number', () => {
    expect(roundToFixedPrecision(-1.005, 2)).toBe('-1.00');
  });

  // Test rounding with no decimals
  it('handles numbers with no decimal places', () => {
    expect(roundToFixedPrecision(1, 2)).toBe('1.00');
  });

  // Test zero precision
  it('handles zero precision', () => {
    expect(roundToFixedPrecision(1.7777, 0)).toBe('2');
  });

  // Test high precision
  it('handles high precision', () => {
    expect(roundToFixedPrecision(1.7777777, 5)).toBe('1.77778');
  });

  // Test string with suffix
  it('preserves non-numeric suffix in strings', () => {
    expect(roundToFixedPrecision('123K', 2)).toBe('123.00K');
  });

  // Test string with prefix and suffix
  it('handles strings with both prefix and suffix', () => {
    expect(roundToFixedPrecision('+123abc', 2)).toBe('123.00abc');
  });

  // Test incorrect rounding method
  it('defaults to ROUND method when an incorrect method is provided', () => {
    expect(roundToFixedPrecision(1.005, 2, 'INVALID')).toBe('1.01');
  });

  // Test empty string
  it('returns zero with specified precision for an empty string', () => {
    expect(roundToFixedPrecision('', 2)).toBe('--');
  });

  // Test non-numeric string
  it('returns NaN when the string is non-numeric', () => {
    expect(roundToFixedPrecision('abc', 2)).toBe('NaN');
  });

});