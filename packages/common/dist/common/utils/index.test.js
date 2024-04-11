"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const index_1 = require("./index");
describe('toThousands', () => {
    test('should format numbers with no decimals correctly', () => {
        expect((0, index_1.toThousands)(1234567)).toBe('1,234,567');
    });
    test('should format string numbers with no decimals correctly', () => {
        expect((0, index_1.toThousands)('1234567')).toBe('1,234,567');
    });
    test('should format numbers with decimals correctly', () => {
        expect((0, index_1.toThousands)(1234567.89)).toBe('1,234,567.89');
    });
    test('should format string numbers with decimals correctly', () => {
        expect((0, index_1.toThousands)('1234567.89')).toBe('1,234,567.89');
    });
    test('should handle empty string', () => {
        expect((0, index_1.toThousands)('')).toBe('');
    });
    test('should handle null', () => {
        expect((0, index_1.toThousands)(null)).toBe('');
    });
    test('should handle undefined', () => {
        expect((0, index_1.toThousands)(undefined)).toBe('');
    });
    test('should handle objects', () => {
        expect((0, index_1.toThousands)({})).toBe('');
    });
    test('should handle arrays', () => {
        expect((0, index_1.toThousands)([1234567])).toBe('');
    });
    test('should handle zero', () => {
        expect((0, index_1.toThousands)(0)).toBe('0');
    });
});
describe('getEllipsStr', () => {
    test('should return the full string when the length is less than or equal to frontNum and endNum is 0', () => {
        expect((0, index_1.getEllipsStr)('12345', 5, 0)).toBe('12345');
    });
    test('should return the frontNum characters followed by ellipsis and the last endNum characters', () => {
        expect((0, index_1.getEllipsStr)('1234567890', 3, 2)).toBe('123...90');
    });
    test('should return an empty string when input is empty', () => {
        expect((0, index_1.getEllipsStr)('', 3, 2)).toBe('');
    });
    test('should handle strings where frontNum is 0', () => {
        expect((0, index_1.getEllipsStr)('1234567890', 0, 5)).toBe('...67890');
    });
    test('should return the string with ellipsis when frontNum is negative', () => {
        expect((0, index_1.getEllipsStr)('1234567890', -3, 2)).toBe('...90');
    });
    test('should return the string with ellipsis when endNum is negative', () => {
        expect((0, index_1.getEllipsStr)('1234567890', 3, -2)).toBe('123...');
    });
    test('should handle strings where both frontNum and endNum are 0', () => {
        expect((0, index_1.getEllipsStr)('1234567890', 0, 0)).toBe('...');
    });
});
describe('hex2utf8', () => {
    test('should convert hex string to utf-8 string', () => {
        expect((0, index_1.hex2utf8)('68656c6c6f')).toBe('hello'); // 'hello' in hex
    });
    test('should handle hex string with spaces', () => {
        expect((0, index_1.hex2utf8)('68 65 6c 6c 6f')).toBe('hello'); // 'hello' with spaces
    });
    test('should decode multibyte utf-8 characters', () => {
        expect((0, index_1.hex2utf8)('e38182')).toBe('あ'); // 'あ' in hex (Japanese character)
    });
    test('should return empty string for an empty input', () => {
        expect((0, index_1.hex2utf8)('')).toBe('');
    });
});
describe('formatNumber', () => {
    test('returns empty string for invalid number', () => {
        expect((0, index_1.formatNumber)('not-a-number')).toBe('');
    });
    test('formats integer without options correctly', () => {
        expect((0, index_1.formatNumber)(123456)).toBe('123.456K'); // Assuming toThousands works correctly
    });
    test('formats decimal number without options correctly', () => {
        expect((0, index_1.formatNumber)(1234.567)).toBe('1.234K'); // Assuming toThousands works correctly
    });
    // TODO
    // test('respects precision option', () => {
    //   expect(formatNumber(1234.567, { precision: 2 })).toBe('1.23K');
    // });
    test('respects keepDecimal option when false', () => {
        expect((0, index_1.formatNumber)(1234, { keepDecimal: false })).toBe('1K');
    });
    test('respects keepZero option when false', () => {
        expect((0, index_1.formatNumber)(1234.000, { keepZero: false })).toBe('1.234K');
    });
    test('respects delimiter option', () => {
        expect((0, index_1.formatNumber)(123456, { delimiter: ' ' })).toBe('123.456K');
    });
    test('respects withUnit option when false', () => {
        expect((0, index_1.formatNumber)(123456, { withUnit: false })).toBe('123,456');
    });
    test('respects unit option', () => {
        expect((0, index_1.formatNumber)(123456789, { unit: 'M' })).toBe('123.456M');
    });
    test('handles large numbers correctly', () => {
        expect((0, index_1.formatNumber)('123456789012345678901234567890')).toBe('123,456.789Y');
    });
    test('handles BigNumber as input', () => {
        expect((0, index_1.formatNumber)(new bignumber_js_1.default(123456))).toBe('123.456K');
    });
});
describe('roundToFixedPrecision', () => {
    // Test default rounding
    it('rounds to the nearest value with default rounding', () => {
        expect((0, index_1.roundToFixedPrecision)(1.005, 2)).toBe('1.01');
    });
    // Test string input with '<'
    it('returns the original string if it includes "<"', () => {
        expect((0, index_1.roundToFixedPrecision)('<1.005', 2)).toBe('<1.005');
    });
    // Test rounding down with FLOOR
    it('rounds down to the nearest value with FLOOR method', () => {
        expect((0, index_1.roundToFixedPrecision)(1.007, 2, 'FLOOR')).toBe('1.00');
    });
    // Test rounding up with CEIL
    it('rounds up to the nearest value with CEIL method', () => {
        expect((0, index_1.roundToFixedPrecision)(1.001, 2, 'CEIL')).toBe('1.01');
    });
    // Test negative number rounding
    it('correctly rounds a negative number', () => {
        expect((0, index_1.roundToFixedPrecision)(-1.005, 2)).toBe('-1.00');
    });
    // Test rounding with no decimals
    it('handles numbers with no decimal places', () => {
        expect((0, index_1.roundToFixedPrecision)(1, 2)).toBe('1.00');
    });
    // Test zero precision
    it('handles zero precision', () => {
        expect((0, index_1.roundToFixedPrecision)(1.7777, 0)).toBe('2');
    });
    // Test high precision
    it('handles high precision', () => {
        expect((0, index_1.roundToFixedPrecision)(1.7777777, 5)).toBe('1.77778');
    });
    // Test string with suffix
    it('preserves non-numeric suffix in strings', () => {
        expect((0, index_1.roundToFixedPrecision)('123K', 2)).toBe('123.00K');
    });
    // Test string with prefix and suffix
    it('handles strings with both prefix and suffix', () => {
        expect((0, index_1.roundToFixedPrecision)('+123abc', 2)).toBe('123.00abc');
    });
    // Test incorrect rounding method
    it('defaults to ROUND method when an incorrect method is provided', () => {
        expect((0, index_1.roundToFixedPrecision)(1.005, 2, 'INVALID')).toBe('1.01');
    });
    // Test empty string
    it('returns zero with specified precision for an empty string', () => {
        expect((0, index_1.roundToFixedPrecision)('', 2)).toBe('--');
    });
    // Test non-numeric string
    it('returns NaN when the string is non-numeric', () => {
        expect((0, index_1.roundToFixedPrecision)('abc', 2)).toBe('NaN');
    });
});
describe('getPercent', () => {
    test('returns 0% when dividend is 0', () => {
        expect((0, index_1.getPercent)(1, 0)).toBe('0%');
    });
    test('calculates percentage correctly without precision', () => {
        const divisor = 25;
        const dividend = 200;
        expect((0, index_1.getPercent)(divisor, dividend)).toBe('12.5%');
    });
    test('calculates percentage correctly with precision', () => {
        const divisor = 25;
        const dividend = 200;
        const precision = 2;
        expect((0, index_1.getPercent)(divisor, dividend, precision)).toBe('12.50%');
    });
    test('returns 100% when percentage is exactly 100 with precision', () => {
        const divisor = 200;
        const dividend = 200;
        const precision = 2;
        expect((0, index_1.getPercent)(divisor, dividend, precision)).toBe('100%');
    });
    test('returns 0% when percentage is exactly 0 with precision', () => {
        const divisor = 0;
        const dividend = 200;
        const precision = 2;
        expect((0, index_1.getPercent)(divisor, dividend, precision)).toBe('0%');
    });
    test('handles string inputs', () => {
        expect((0, index_1.getPercent)('50', '100')).toBe('50%');
    });
    test('handles BigNumber inputs', () => {
        const divisor = new bignumber_js_1.default(1);
        const dividend = new bignumber_js_1.default(2);
        expect((0, index_1.getPercent)(divisor, dividend)).toBe('50%');
    });
    test('handles precision when percentage is less than 1%', () => {
        const divisor = 1;
        const dividend = 200;
        const precision = 2;
        expect((0, index_1.getPercent)(divisor, dividend, precision)).toBe('0.50%');
    });
});
describe('getTimeByBlockInterval', () => {
    test('returns 0 for all values when minuend and subtrahend are 0', () => {
        const result = (0, index_1.getTimeByBlockInterval)(0, 0);
        expect(result).toEqual({ days: 0, hours: 0, seconds: 0 });
    });
    test('calculates time correctly for positive intervals', () => {
        const minuend = 180000; // 50 hours in seconds
        const subtrahend = 0;
        const result = (0, index_1.getTimeByBlockInterval)(minuend, subtrahend);
        expect(result).toEqual({ days: 1, hours: 1, seconds: 90000 });
    });
    test('calculates time correctly when minuend is less than subtrahend', () => {
        const minuend = 0;
        const subtrahend = 180000; // 50 hours in seconds
        const result = (0, index_1.getTimeByBlockInterval)(minuend, subtrahend);
        expect(result).toEqual({ days: -2, hours: 23, seconds: -90000 });
    });
});
describe('isLikeBigNumber', () => {
    test('returns false for null', () => {
        expect((0, index_1.isLikeBigNumber)(null)).toBe(false);
    });
    test('returns false for undefined', () => {
        expect((0, index_1.isLikeBigNumber)(undefined)).toBe(false);
    });
    test('returns false for a number', () => {
        expect((0, index_1.isLikeBigNumber)(123)).toBe(false);
    });
    test('returns false for a string', () => {
        expect((0, index_1.isLikeBigNumber)('123')).toBe(false);
    });
    test('returns false for an array', () => {
        expect((0, index_1.isLikeBigNumber)([1, 2, 3])).toBe(false);
    });
    test('returns false for a non-BigNumber object', () => {
        expect((0, index_1.isLikeBigNumber)({ a: 1, b: 2 })).toBe(false);
    });
    test('returns false for an object missing BigNumber properties', () => {
        expect((0, index_1.isLikeBigNumber)({ s: 1, e: 2 })).toBe(false);
    });
    test('returns true for an object with BigNumber-like properties', () => {
        expect((0, index_1.isLikeBigNumber)({ s: 1, e: 2, c: [1, 2, 3] })).toBe(true);
    });
    test('returns false for a function', () => {
        expect((0, index_1.isLikeBigNumber)(() => { })).toBe(false);
    });
    test('returns false for a BigNumber-like object with non-array c', () => {
        expect((0, index_1.isLikeBigNumber)({ s: 1, e: 2, c: 'not-an-array' })).toBe(false);
    });
    test('returns true for a BigNumber instance', () => {
        const bigNumberInstance = new bignumber_js_1.default(123);
        expect((0, index_1.isLikeBigNumber)(bigNumberInstance)).toBe(true);
    });
});
describe('Conversion functions', () => {
    const bigNumber1 = new bignumber_js_1.default('123456789012345678901234567890');
    const bigNumber2 = new bignumber_js_1.default('987654321098765432109876543210');
    const nestedArrayInput = [1, 'string', bigNumber1, [2, bigNumber2]];
    const nestedObjectInput = {
        num: 1,
        str: 'string',
        bNum: bigNumber1,
        arr: [2, bigNumber2],
        obj: {
            bNum: bigNumber2
        }
    };
    describe('convertBigNumbersToStrings', () => {
        test('converts BigNumber elements in an array to strings', () => {
            const expectedOutput = [1, 'string', bigNumber1.toString(10), [2, bigNumber2.toString(10)]];
            expect((0, index_1.convertBigNumbersToStrings)(nestedArrayInput)).toEqual(expectedOutput);
        });
        test('handles nested arrays', () => {
            const nestedInput = [bigNumber1, [bigNumber2]];
            const expectedOutput = [bigNumber1.toString(10), [bigNumber2.toString(10)]];
            expect((0, index_1.convertBigNumbersToStrings)(nestedInput)).toEqual(expectedOutput);
        });
    });
    describe('convertObjBigNumbersToStrings', () => {
        test('converts BigNumber elements in an object to strings', () => {
            const expectedOutput = {
                num: 1,
                str: 'string',
                bNum: bigNumber1.toString(10),
                arr: [2, bigNumber2.toString(10)],
                obj: {
                    bNum: bigNumber2.toString(10)
                }
            };
            expect((0, index_1.convertObjBigNumbersToStrings)(nestedObjectInput)).toEqual(expectedOutput);
        });
        test('handles nested objects', () => {
            const nestedInput = { bNum: bigNumber1, obj: { bNum: bigNumber2 } };
            const expectedOutput = { bNum: bigNumber1.toString(10), obj: { bNum: bigNumber2.toString(10) } };
            expect((0, index_1.convertObjBigNumbersToStrings)(nestedInput)).toEqual(expectedOutput);
        });
    });
});
describe('formatLargeNumber', () => {
    test('handles invalid number and returns null value with empty unit', () => {
        expect((0, index_1.formatLargeNumber)('invalid')).toEqual({ value: null, unit: '' });
    });
    test('formats number less than T (tera) without unit', () => {
        expect((0, index_1.formatLargeNumber)('1234567890')).toEqual({ value: '1234567890', unit: '' });
    });
    test('formats number in T (tera) with unit', () => {
        expect((0, index_1.formatLargeNumber)('1000000000000')).toEqual({ value: '1', unit: 'T' });
    });
    test('formats number in P (peta) with unit', () => {
        expect((0, index_1.formatLargeNumber)('1000000000000000')).toEqual({ value: '1', unit: 'P' });
    });
    test('formats number in E (exa) with unit', () => {
        expect((0, index_1.formatLargeNumber)('1000000000000000000')).toEqual({ value: '1', unit: 'E' });
    });
    test('formats large BigNumber with unit', () => {
        const number = new bignumber_js_1.default('1e21');
        expect((0, index_1.formatLargeNumber)(number)).toEqual({ value: '1000', unit: 'E' });
    });
    test('formats string representing a large number with unit', () => {
        const number = '1e21';
        expect((0, index_1.formatLargeNumber)(number)).toEqual({ value: '1000', unit: 'E' });
    });
    test('formats negative numbers correctly', () => {
        expect((0, index_1.formatLargeNumber)('-1000000000000')).toEqual({ value: '-1000000000000', unit: '' });
    });
    test('formats fractional numbers correctly', () => {
        expect((0, index_1.formatLargeNumber)('1234567890123.4567')).toEqual({ value: '1.2345678901234567', unit: 'T' });
    });
});
describe('mergeDeep', () => {
    test('should return an empty object when no arguments are provided', () => {
        expect((0, index_1.mergeDeep)()).toEqual({});
    });
    test('should merge two flat objects', () => {
        const obj1 = { a: 1, b: 2 };
        const obj2 = { b: 3, c: 4 };
        expect((0, index_1.mergeDeep)(obj1, obj2)).toEqual({ a: 1, b: 3, c: 4 });
    });
    test('should not change the original objects', () => {
        const obj1 = { a: 1, b: 2 };
        const obj2 = { b: 3, c: 4 };
        (0, index_1.mergeDeep)(obj1, obj2);
        expect(obj1).toEqual({ a: 1, b: 2 });
        expect(obj2).toEqual({ b: 3, c: 4 });
    });
    test('should merge nested objects', () => {
        const obj1 = { a: { x: 1 }, b: 2 };
        const obj2 = { a: { y: 2 }, b: 3 };
        expect((0, index_1.mergeDeep)(obj1, obj2)).toEqual({ a: { x: 1, y: 2 }, b: 3 });
    });
    test('should merge objects with array values', () => {
        const obj1 = { a: [1, 2], b: 2 };
        const obj2 = { a: [3, 4], b: 3 };
        expect((0, index_1.mergeDeep)(obj1, obj2)).toEqual({ a: [1, 2, 3, 4], b: 3 });
    });
    test('should merge multiple source objects', () => {
        const obj1 = { a: 1 };
        const obj2 = { b: 2 };
        const obj3 = { c: 3 };
        expect((0, index_1.mergeDeep)(obj1, obj2, obj3)).toEqual({ a: 1, b: 2, c: 3 });
    });
    test('should handle non-object arguments', () => {
        const obj1 = { a: 1 };
        const obj2 = null;
        const obj3 = undefined;
        const obj4 = { b: 2 };
        expect((0, index_1.mergeDeep)(obj1, obj2, obj3, obj4)).toEqual({ a: 1, b: 2 });
    });
    test('should override values in the order they are provided', () => {
        const obj1 = { a: { x: 1, y: 1 }, b: 1 };
        const obj2 = { a: { x: 2 }, b: 2 };
        const obj3 = { a: { y: 3 }, b: 3 };
        expect((0, index_1.mergeDeep)(obj1, obj2, obj3)).toEqual({ a: { x: 2, y: 3 }, b: 3 });
    });
    test('should merge objects with different structures', () => {
        const obj1 = { a: { x: 1 }, b: [1, 2] };
        const obj2 = { a: 1, b: { x: 1 } };
        expect((0, index_1.mergeDeep)(obj1, obj2)).toEqual({ a: 1, b: { x: 1 } });
    });
});
