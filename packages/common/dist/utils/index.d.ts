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
export declare const formatNumber: (num: number | string, opt?: any) => string;
//# sourceMappingURL=index.d.ts.map