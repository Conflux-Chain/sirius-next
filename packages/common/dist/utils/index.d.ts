/// <reference types="node" />
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
export declare const toThousands: (num: any, delimiter?: string, prevDelimiter?: string) => string;
export declare const getEllipsStr: (str: string, frontNum: number, endNum: number) => string;
export declare const tranferToLowerCase: (str: string) => string;
export declare const hex2utf8: (pStr: string) => string;
export declare const replaceAll: (str: string, find: string, replace: string) => string;
/**
 * 格式化字符串，向下取整
 * @param {number|string} num 数字或字符串，应尽量使用字符串格式，数字格式如果长度超过 Number.MAX_SAFE_INTEGER 或 Number.MIN_SAFE_INTEGER 可能会有精度损失
 * @param {object} opt 配置参数
 * @returns {string} 格式化后字符串格式数字
 * @todo: 支持四舍五入，向上取整
 * @todo: 支持整数位小数设置精度
 * @todo: 支持负数格式化
 */
export declare const formatNumber: (num: number | string | BigNumber, opt?: any) => string;
export declare const roundToFixedPrecision: (number: number | string, precision: number, method?: string) => string;
export declare const getPercent: (divisor: number | string | BigNumber, dividend: number | string | BigNumber, precision?: number) => string;
export declare const formatTimeStamp: (time: number, type?: 'standard' | 'timezone') => string;
export declare const fromGdripToDrip: (num: number | string) => BigNumber;
export declare const fromCfxToDrip: (num: number | string) => BigNumber;
export declare const formatBalance: (balance: any, decimals?: number, isShowFull?: boolean, opt?: {}, ltValue?: number | string) => any;
export declare const selectText: (element: HTMLElement) => void;
export declare const isHash: (str: string) => boolean;
export declare const isBlockHash: (str: string) => Promise<boolean>;
export declare const isTxHash: (str: string) => Promise<boolean>;
export declare function validURL(str: string): boolean;
export declare function byteToKb(bytes: number): number;
export declare function isObject(o: any): boolean;
export declare function checkInt(value: string | number, type: string): (string | number | boolean)[];
export declare function checkUint(value: string | number, type: string): (string | number | boolean)[];
export declare function isHex(num: string, withPrefix?: boolean): boolean;
export declare function isEvenLength(str: string): boolean;
export declare function checkBytes(value: string, type: string): (number | boolean)[];
export declare function checkCfxType(value: string | number): boolean;
export declare const sleep: (timeout: number) => Promise<unknown>;
export declare const getTimeByBlockInterval: (minuend?: number, subtrahend?: number) => {
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
export declare const isSafeNumberOrNumericStringInput: (data: string) => boolean;
export declare const isZeroOrPositiveInteger: (data: string) => boolean;
export declare const parseString: (v: string) => string | Buffer;
export declare const getInitialDate: (minTimestamp: number, maxTimestamp: number) => {
    minT: dayjs.Dayjs;
    maxT: dayjs.Dayjs;
    dMinT: (date: dayjs.Dayjs) => boolean;
    dMaxT: (date: dayjs.Dayjs) => boolean;
};
export declare const addIPFSGateway: (imgURL: string, IPFSGatewayURL: string) => string;
export declare const isLikeBigNumber: (obj: any) => boolean;
type NestedArray = (string | number | BigNumber | NestedArray)[];
export declare const convertBigNumbersToStrings: any;
export declare const convertObjBigNumbersToStrings: any;
export declare const constprocessResultArray: (resultArray: NestedArray) => unknown[];
export declare const formatLargeNumber: (number: string | number | BigNumber) => {
    value: string | null;
    unit: string;
};
export declare function transferRisk(riskStr: string): "" | "lv3" | "lv2" | "lv1" | "lv0";
export declare const appendApiPrefix: (url: string) => string;
export declare const simpleGetFetcher: (...args: any[]) => Promise<Response>;
export declare const useSWRWithGetFecher: (key: string | string[] | null, swrOpts?: {}) => {
    data: any;
    error: any;
    mutate: any;
};
export declare const mergeDeep: (...objects: any[]) => any;
type EventName = string;
type Callback = (data: any) => void;
export declare const pubsub: {
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
export declare const publishRequestError: (e: (Error & ErrorInfoType) | ErrorInfoType, type: 'rpc' | 'http' | 'wallet' | 'code') => void;
export declare const HIDE_IN_DOT_NET: boolean;
export {};
//# sourceMappingURL=index.d.ts.map