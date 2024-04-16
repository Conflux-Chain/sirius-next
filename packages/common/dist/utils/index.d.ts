import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';

declare const toThousands: (num: any, delimiter?: string, prevDelimiter?: string) => string;
declare const getEllipsStr: (str: string, frontNum: number, endNum: number) => string;
declare const tranferToLowerCase: (str: string) => string;
declare const hex2utf8: (pStr: string) => string;
declare const replaceAll: (str: string, find: string, replace: string) => string;
/**
 * 格式化字符串，向下取整
 * @param {number|string} num 数字或字符串，应尽量使用字符串格式，数字格式如果长度超过 Number.MAX_SAFE_INTEGER 或 Number.MIN_SAFE_INTEGER 可能会有精度损失
 * @param {object} opt 配置参数
 * @returns {string} 格式化后字符串格式数字
 * @todo: 支持四舍五入，向上取整
 * @todo: 支持整数位小数设置精度
 * @todo: 支持负数格式化
 */
declare const formatNumber: (num: number | string | BigNumber, opt?: any) => string;
declare const roundToFixedPrecision: (number: number | string, precision: number, method?: string) => string;
declare const getPercent: (divisor: number | string | BigNumber, dividend: number | string | BigNumber, precision?: number) => string;
declare const formatTimeStamp: (time: number, type?: 'standard' | 'timezone') => string;
declare const fromGdripToDrip: (num: number | string) => BigNumber;
declare const fromCfxToDrip: (num: number | string) => BigNumber;
declare const formatBalance: (balance: any, decimals?: number, isShowFull?: boolean, opt?: {}, ltValue?: number | string) => any;
declare const selectText: (element: HTMLElement) => void;
declare const isHash: (str: string) => boolean;
declare const isBlockHash: (str: string) => Promise<boolean>;
declare const isTxHash: (str: string) => Promise<boolean>;
declare function validURL(str: string): boolean;
declare function byteToKb(bytes: number): number;
declare function isObject(o: any): boolean;
declare function checkInt(value: string | number, type: string): (string | number | boolean)[];
declare function checkUint(value: string | number, type: string): (string | number | boolean)[];
declare function isHex(num: string, withPrefix?: boolean): boolean;
declare function isEvenLength(str: string): boolean;
declare function checkBytes(value: string, type: string): (number | boolean)[];
declare function checkCfxType(value: string | number): boolean;
declare const sleep: (timeout: number) => Promise<unknown>;
declare const getTimeByBlockInterval: (minuend?: number, subtrahend?: number) => {
    days: number;
    hours: number;
    seconds: number;
};
/**
 *
 * @param {number|string} data
 * @returns {boolean}
 * @example
 * 0    -> true
 * .    -> true
 * 0.   -> true
 * .0   -> true
 * 0.0  -> true
 * 0..0 -> false
 * x    -> false
 * e    -> false
 * @todo support config, such as negative and exponential notation
 */
/**
 *
 * @param {number|string} data
 * @returns {boolean}
 * @example
 * 0    -> true
 * .    -> false
 * 11   -> true
 * 011  -> false
 * -1   -> false
 */
declare const isSafeNumberOrNumericStringInput: (data: string) => boolean;
declare const isZeroOrPositiveInteger: (data: string) => boolean;
declare const parseString: (v: string) => string | Buffer;
declare const getInitialDate: (minTimestamp: number, maxTimestamp: number) => {
    minT: dayjs.Dayjs;
    maxT: dayjs.Dayjs;
    dMinT: (date: dayjs.Dayjs) => boolean;
    dMaxT: (date: dayjs.Dayjs) => boolean;
};
declare const addIPFSGateway: (imgURL: string, IPFSGatewayURL: string) => string;
declare const isLikeBigNumber: (obj: any) => boolean;
type NestedArray = (string | number | BigNumber | NestedArray)[];
declare const convertBigNumbersToStrings: any;
declare const convertObjBigNumbersToStrings: any;
declare const constprocessResultArray: (resultArray: NestedArray) => unknown[];
declare const formatLargeNumber: (number: string | number | BigNumber) => {
    value: string | null;
    unit: string;
};
declare function transferRisk(riskStr: string): "" | "lv3" | "lv2" | "lv1" | "lv0";
declare const appendApiPrefix: (url: string) => string;
declare const simpleGetFetcher: (...args: any[]) => Promise<Response>;
declare const useSWRWithGetFecher: (key: string | string[] | null, swrOpts?: {}) => {
    data: any;
    error: any;
    mutate: any;
};
declare const mergeDeep: (...objects: any[]) => any;
type EventName = string;
type Callback = (data: any) => void;
declare const pubsub: {
    publish: (eventName: EventName, data: any) => void;
    subscribe: (eventName: EventName, callback: Callback) => () => void;
};
interface ErrorInfoType {
    url?: string;
    code?: number;
    message?: string;
    data?: string;
    method?: string;
}
declare const publishRequestError: (e: (Error & ErrorInfoType) | ErrorInfoType, type: 'rpc' | 'http' | 'wallet' | 'code') => void;
declare const HIDE_IN_DOT_NET: boolean;

export { HIDE_IN_DOT_NET, addIPFSGateway, appendApiPrefix, byteToKb, checkBytes, checkCfxType, checkInt, checkUint, constprocessResultArray, convertBigNumbersToStrings, convertObjBigNumbersToStrings, formatBalance, formatLargeNumber, formatNumber, formatTimeStamp, fromCfxToDrip, fromGdripToDrip, getEllipsStr, getInitialDate, getPercent, getTimeByBlockInterval, hex2utf8, isBlockHash, isEvenLength, isHash, isHex, isLikeBigNumber, isObject, isSafeNumberOrNumericStringInput, isTxHash, isZeroOrPositiveInteger, mergeDeep, parseString, publishRequestError, pubsub, replaceAll, roundToFixedPrecision, selectText, simpleGetFetcher, sleep, toThousands, tranferToLowerCase, transferRisk, useSWRWithGetFecher, validURL };
