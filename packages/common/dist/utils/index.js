import BigNumber from "bignumber.js";
import dayjs from 'dayjs';
import useSWR from 'swr';
import qs from 'qs';
export const toThousands = (num, delimiter = ",", prevDelimiter = ",") => {
    if ((typeof num !== "number" || isNaN(num)) && typeof num !== "string")
        return "";
    let str = num + "";
    return str
        .replace(new RegExp(prevDelimiter, "igm"), "")
        .split(".")
        .reduce((acc, cur, index) => {
        if (index) {
            return `${acc}.${cur}`;
        }
        else {
            return cur.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, `$1${delimiter}`);
        }
    }, "");
};
export const getEllipsStr = (str, frontNum, endNum) => {
    if (str) {
        const length = str.length;
        if (endNum === 0 && length <= frontNum) {
            return str.substring(0, frontNum);
        }
        return (str.substring(0, frontNum) +
            "..." +
            str.substring(length - endNum, length));
    }
    return "";
};
export const tranferToLowerCase = (str) => {
    return str ? str.toLowerCase() : "";
};
function hex2asc(pStr) {
    let tempstr = "";
    for (let b = 0; b < pStr.length; b += 2) {
        tempstr += String.fromCharCode(parseInt(pStr.substr(b, 2), 16));
    }
    return tempstr;
}
export const hex2utf8 = (pStr) => {
    let tempstr = "";
    try {
        tempstr = decodeURIComponent(pStr.replace(/\s+/g, "").replace(/[0-9a-f]{2}/g, "%$&"));
    }
    catch (err) {
        tempstr = hex2asc(pStr);
    }
    return tempstr;
};
// alternative of String.prototype.replaceAll
export const replaceAll = (str, find, replace) => {
    return str.replace(new RegExp(find.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"), "g"), replace);
};
/**
 * 格式化字符串，向下取整
 * @param {number|string} num 数字或字符串，应尽量使用字符串格式，数字格式如果长度超过 Number.MAX_SAFE_INTEGER 或 Number.MIN_SAFE_INTEGER 可能会有精度损失
 * @param {object} opt 配置参数
 * @returns {string} 格式化后字符串格式数字
 * @todo: 支持四舍五入，向上取整
 * @todo: 支持整数位小数设置精度
 * @todo: 支持负数格式化
 */
export const formatNumber = (num, opt) => {
    // 无法通过 bignumber.js 格式化的不处理
    let bNum = new BigNumber(num).toFixed();
    if (bNum === "NaN") {
        return "";
    }
    const option = {
        precision: 3, // 保留小数精度数（注意整数位小数的精度固定为 3，原因是受千分符影响）
        keepDecimal: true, // 是否保留小数位（注意如果整数部分带有小数位，则不保留实际小数位，原因是会显示两个小数点，会误解）
        keepZero: false, // 是否保留小数位的 0（注意此配置优先级高于 precision，会清除 precision 添加的 0）
        delimiter: ",", // 自定义分隔符
        withUnit: true, // 是否显示单位
        unit: "", // 指定单位
        ...opt,
    };
    // 0. 定义返回值
    let int = "";
    let decimal = "";
    let result = "";
    /**
     * 1. 定义单位
     * K - kilo, 10³
     * M - mega, 10⁶
     * G - giga, 10⁹
     * T - tera, 10¹²
     * P - peta, 10¹⁵
     * E - exa, 10¹⁸
     * Z - zetta, 10²¹
     * Y - yotta, 10²⁴
     */
    const UNITS = ["", "K", "M", "G", "T", "P", "E", "Z", "Y"];
    // 2. 拆分出整数和小数，小数默认值为 0
    const [intStr, decimalStr = "0"] = bNum.split(".");
    // 3. 只能处理 27 位数的单位，大于 27 位的字符串从头部截断保留
    // 3.1 获取大于小数点前 27 位的数字 intStrFront
    let intStrFront = intStr ? intStr.slice(-Infinity, -27) : 0;
    // 3.2 获取小数点前 27 位数字 intStrEnd
    let intStrEnd = intStr ? intStr.slice(-27) : 0;
    // 4. intStrEnd 转千分符形式
    const intStrEndAfterToThousands = toThousands(intStrEnd, option.delimiter);
    // 5. intStrEnd 添加单位，此处不对数字有效性做验证，即可能值为 100.000，100.000k 或 000.000Y
    let intStrEndWithUnit = "";
    if (option.withUnit === false) {
        intStrEndWithUnit = intStrEndAfterToThousands;
    }
    else {
        let unitIndex = 1;
        if (option.unit !== "" && UNITS.includes(option.unit)) {
            unitIndex =
                intStrEndAfterToThousands.split(option.delimiter).length -
                    UNITS.findIndex((u) => u === option.unit);
        }
        if (unitIndex > 0) {
            intStrEndWithUnit = intStrEndAfterToThousands
                .split(option.delimiter)
                .reduce((prev, curr, index, arr) => {
                const len = arr.length;
                // 无单位整数，为了后面方便处理统一格式
                if (len === 1) {
                    return `${curr}.000`;
                }
                if (index === 0) {
                    return curr;
                }
                else if (index === unitIndex) {
                    return `${prev}.${curr}${UNITS[len - index]}`;
                }
                else if (index < unitIndex) {
                    return `${prev},${curr}`;
                }
                else {
                    return prev;
                }
            }, "");
        }
        else {
            intStrEndWithUnit = intStrEndAfterToThousands;
        }
    }
    // 6. 格式化整数
    if (intStrFront) {
        // 如果数字长度超过 27 位，则前面的数字用千分符分割
        int = `${toThousands(intStrFront, option.delimiter)}${option.delimiter}${intStrEndWithUnit}`;
    }
    else {
        int = intStrEndWithUnit;
    }
    // 7. 格式化小数
    decimal = new BigNumber(`0.${decimalStr}`).toPrecision(option.precision, 1);
    // 8. 拼接整数，小数和单位
    let unit = int.slice(-1);
    let intWithoutUnit = int;
    if (int && UNITS.includes(unit)) {
        // 8.1 整数位包含单位，则不显示实际小数部分
        if (option.keepDecimal) {
            // 保留整数位整数 + 整数位小数
            intWithoutUnit = int.slice(-Infinity, -1);
        }
        else {
            // 仅保留整数位整数
            intWithoutUnit = intWithoutUnit.split(".")[0] || "";
        }
        result = `${intWithoutUnit}${unit}`;
    }
    else {
        unit = "";
        // 8.2 整数位为 0 或无单位整数，拼接小数位
        if (option.keepDecimal) {
            result = new BigNumber(int.toString().replace(/,/g, ""))
                .plus(new BigNumber(decimal))
                .toFixed(option.precision, 1);
        }
        else {
            result = int.split(".")[0] || "";
        }
        intWithoutUnit = result;
    }
    // 9. 处理小数部分的 0
    if (!option.keepZero) {
        result = `${new BigNumber(replaceAll(intWithoutUnit, option.delimiter, "")).toFormat()}${unit}`;
    }
    // 10. 格式化千分符
    result = toThousands(result);
    return result;
};
export const roundToFixedPrecision = (number, precision, method = "ROUND") => {
    if (number === "") {
        return "--";
    }
    if (typeof number === "string" && number.includes("<")) {
        return number;
    }
    const regex = /^([+-]?[0-9]*\.?[0-9]+)(\D*)$/;
    let matches = String(number).match(regex);
    if (!matches) {
        matches = [String(number), ""];
    }
    const suffix = matches[2] || "";
    const numberFormat = parseFloat(matches[1] ?? "");
    const factor = Math.pow(10, precision);
    let resultNum;
    switch (method) {
        case "FLOOR":
            resultNum = Math.floor(numberFormat * factor) / factor;
            break;
        case "CEIL":
            resultNum = Math.ceil(numberFormat * factor) / factor;
            break;
        case "ROUND":
        default:
            resultNum = Math.round((numberFormat + Number.EPSILON) * factor) / factor;
    }
    return resultNum.toFixed(precision) + suffix;
};
export const getPercent = (divisor, dividend, precision) => {
    if (Number(dividend) === 0)
        return 0 + '%';
    const bnDivisor = new BigNumber(divisor);
    const bnDividend = new BigNumber(dividend);
    const percentageNum = formatNumber(bnDivisor.dividedBy(bnDividend).multipliedBy(100).toNumber());
    if (precision || precision === 0) {
        const percentageNumPrecision = roundToFixedPrecision(percentageNum, precision);
        if (percentageNumPrecision === '100.00') {
            return '100%';
        }
        else if (percentageNumPrecision === '0.00') {
            return '0%';
        }
        return roundToFixedPrecision(percentageNum, precision) + '%';
    }
    return `${percentageNum}%`;
};
export const formatTimeStamp = (time, type) => {
    let result;
    try {
        switch (type) {
            case 'standard':
                result = dayjs(time).format('YYYY-MM-DD HH:mm:ss');
                break;
            case 'timezone':
                result = dayjs(time).format('YYYY-MM-DD HH:mm:ss Z');
                break;
            default:
                result = dayjs(time).format('YYYY-MM-DD HH:mm:ss');
        }
    }
    catch (error) {
        result = '';
    }
    return result;
};
export const fromGdripToDrip = (num) => new BigNumber(num).multipliedBy(10 ** 9);
export const fromCfxToDrip = (num) => new BigNumber(num).multipliedBy(10 ** 18);
export const formatBalance = (balance, decimals = 18, isShowFull = false, opt = {}, ltValue) => {
    try {
        const balanceValue = typeof balance === 'string' || typeof balance === 'number' ? new BigNumber(balance) : balance;
        const num = balanceValue.div(new BigNumber(10).pow(decimals));
        if (num.eq(0)) {
            return num.toFixed();
        }
        if (isShowFull) {
            return toThousands(num.toFixed());
        }
        if (ltValue && num.lt(ltValue)) {
            return `<${ltValue}`;
        }
        return formatNumber(num.toString(), opt);
    }
    catch {
        return '';
    }
};
export const selectText = (element) => {
    var range, selection, body = document.body;
    if (body.createTextRange) {
        range = body.createTextRange();
        range.moveToElementText(element);
        range.select();
    }
    else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};
export const isHash = (str) => {
    return /^0x[0-9a-fA-F]{64}$/.test(str);
};
export const isBlockHash = async (str) => {
    if (!isHash(str))
        return false;
    let isBlock = true;
    try {
        const block = await fetch(`/v1/block/${str}`);
        // server side will return {} when no block found
        if (!block.hash || block.code !== undefined)
            isBlock = false;
    }
    catch (err) {
        isBlock = false;
    }
    return isBlock;
};
export const isTxHash = async (str) => {
    if (!isHash(str))
        return false;
    return !isBlockHash(str);
};
export function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}
export function byteToKb(bytes) {
    return bytes / 1024;
}
export function isObject(o) {
    return o !== null && typeof o === 'object' && Array.isArray(o) === false;
}
export function checkInt(value, type) {
    const num = Number(type.substr(3));
    const min = new BigNumber(2).pow(num - 1).multipliedBy(-1);
    const max = new BigNumber(2).pow(num - 1).minus(1);
    let isType = false;
    if (typeof value === 'number' && !isNaN(value)) {
        const valNum = new BigNumber(value);
        if (valNum.isInteger() &&
            valNum.isGreaterThanOrEqualTo(min) &&
            valNum.isLessThanOrEqualTo(max)) {
            isType = true;
        }
        else {
            isType = false;
        }
    }
    else {
        isType = false;
    }
    return [isType, num, min.toString(), max.toString()];
}
export function checkUint(value, type) {
    const num = Number(type.substr(4));
    const min = new BigNumber(0);
    const max = new BigNumber(Math.pow(2, num)).minus(1);
    let isType = false;
    if (typeof value === 'number' && !isNaN(value)) {
        const valNum = new BigNumber(value);
        if (valNum.isInteger() &&
            valNum.isGreaterThanOrEqualTo(min) &&
            valNum.isLessThanOrEqualTo(max)) {
            isType = true;
        }
        else {
            isType = false;
        }
    }
    else {
        isType = false;
    }
    return [isType, num, min.toFixed(), max.toFixed()];
}
export function isHex(num, withPrefix = true) {
    const reg = withPrefix ? /^0x[0-9a-f]*$/i : /^(0x)?[0-9a-f]*$/i;
    return Boolean(num.match(reg));
}
export function isEvenLength(str) {
    const length = str.length;
    return length > 0 && length % 2 === 0;
}
export function checkBytes(value, type) {
    if (type === 'byte') {
        type = 'bytes1';
    }
    const num = Number(type.substr(5));
    let isBytes = false;
    if (!value)
        return [isBytes, num];
    if (isHex(value) && isEvenLength(value)) {
        if (num > 0) {
            const str = value.substr(2);
            const buffer = Buffer.from(str, 'hex');
            if (buffer.length === num) {
                isBytes = true;
            }
            else {
                isBytes = false;
            }
        }
        else {
            isBytes = true;
        }
    }
    else {
        isBytes = false;
    }
    return [isBytes, num];
}
export function checkCfxType(value) {
    if (isNaN(Number(value))) {
        return false;
    }
    const valNum = new BigNumber(value);
    if (valNum.isNegative()) {
        return false;
    }
    let index = String(value).indexOf('.');
    if (index !== -1) {
        if (String(value).substr(index + 1).length > 18) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}
export const sleep = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));
// get two block interval time
export const getTimeByBlockInterval = (minuend = 0, subtrahend = 0) => {
    const seconds = new BigNumber(minuend)
        .minus(subtrahend)
        .dividedBy(2)
        .toNumber();
    const dayBase = 86400;
    const hourBase = 3600;
    const days = Math.floor(seconds / dayBase);
    const deltaSecond = seconds - days * 86400;
    const hours = Math.floor(deltaSecond / hourBase);
    return { days, hours, seconds };
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
export const isSafeNumberOrNumericStringInput = (data) => /^\d+\.?\d*$|^\.\d*$/.test(data);
export const isZeroOrPositiveInteger = (data) => /^(0|[1-9]\d*)$/.test(data);
export const parseString = (v) => {
    if (typeof v === 'string' && !v.startsWith('0x')) {
        return Buffer.from(v);
    }
    return v;
};
// process datepicker initial value
export const getInitialDate = (minTimestamp, maxTimestamp) => {
    const startDate = dayjs('2020-10-29T00:00:00+08:00');
    const endDate = dayjs();
    const innerMinTimestamp = minTimestamp
        ? dayjs(new Date(parseInt((minTimestamp + '000'))))
        : startDate;
    const innerMaxTimestamp = maxTimestamp
        ? dayjs(new Date(parseInt((maxTimestamp + '000'))))
        : endDate;
    const disabledDateD1 = (date) => date &&
        (date > innerMaxTimestamp.endOf('day') ||
            date < startDate.subtract(1, 'day').endOf('day'));
    const disabledDateD2 = (date) => date &&
        (date < innerMinTimestamp.subtract(1, 'day').endOf('day') ||
            date > endDate.endOf('day'));
    return {
        minT: innerMinTimestamp,
        maxT: innerMaxTimestamp,
        dMinT: disabledDateD1,
        dMaxT: disabledDateD2,
    };
};
export const addIPFSGateway = (imgURL, IPFSGatewayURL) => {
    if (typeof imgURL === 'string' &&
        typeof IPFSGatewayURL === 'string' &&
        imgURL.startsWith('ipfs://')) {
        imgURL = `${IPFSGatewayURL}/${imgURL.replace('ipfs://', 'ipfs/')}`;
    }
    return imgURL;
};
export const isLikeBigNumber = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return false;
    }
    return 's' in obj && 'e' in obj && 'c' in obj && Array.isArray(obj.c);
};
export const convertBigNumbersToStrings = (input) => {
    return input.map((item) => {
        if (item instanceof Uint8Array) {
            return item;
        }
        if (Array.isArray(item)) {
            return convertBigNumbersToStrings(item);
        }
        else if (item !== null &&
            typeof item === 'object' &&
            !isLikeBigNumber(item)) {
            return convertObjBigNumbersToStrings(item);
        }
        else if (isLikeBigNumber(item)) {
            return item.toString(10);
        }
        else {
            return item;
        }
    });
};
export const convertObjBigNumbersToStrings = (input) => {
    const newObj = {};
    if (Array.isArray(input)) {
        return convertBigNumbersToStrings(input);
    }
    for (let key in input) {
        if (isLikeBigNumber(input[key])) {
            newObj[key] = input[key].toString(10);
        }
        else if (Array.isArray(input[key])) {
            newObj[key] = convertBigNumbersToStrings(input[key]);
        }
        else if (typeof input[key] === 'object') {
            newObj[key] = convertObjBigNumbersToStrings(input[key]);
        }
        else {
            newObj[key] = input[key];
        }
    }
    return newObj;
};
export const constprocessResultArray = (resultArray) => {
    if (typeof resultArray === 'string') {
        return resultArray;
    }
    const processElement = (element) => {
        if (Array.isArray(element)) {
            return element.map(processElement);
        }
        else if (element.type && element.type === 'Buffer') {
            let result = element.data
                .map((byte) => ('00' + byte.toString(16)).slice(-2))
                .join('');
            if (!result.startsWith('0x')) {
                result = '0x' + result;
            }
            return result;
        }
        else {
            return element;
        }
    };
    const inputArray = Array.isArray(resultArray) ? resultArray : [resultArray];
    return inputArray.map(processElement);
};
export const formatLargeNumber = (number) => {
    const num = new BigNumber(number);
    if (num.isNaN()) {
        return { value: null, unit: '' };
    }
    const T = new BigNumber(10).pow(12);
    const P = new BigNumber(10).pow(15);
    const E = new BigNumber(10).pow(18);
    if (num.isGreaterThanOrEqualTo(E)) {
        const result = num.dividedBy(E);
        return {
            value: result.isNaN() ? null : result.toString(),
            unit: 'E',
        };
    }
    else if (num.isGreaterThanOrEqualTo(P)) {
        const result = num.dividedBy(P);
        return {
            value: result.isNaN() ? null : result.toString(),
            unit: 'P',
        };
    }
    else if (num.isGreaterThanOrEqualTo(T)) {
        const result = num.dividedBy(T);
        return {
            value: result.isNaN() ? null : result.toString(),
            unit: 'T',
        };
    }
    else {
        return {
            value: num.toString(),
            unit: '',
        };
    }
};
const EPS = new BigNumber(1e-6);
export function transferRisk(riskStr) {
    const riskNum = new BigNumber(riskStr);
    if (riskNum.isNaN()) {
        return '';
    }
    // risk > 1e-4*(1+EPS)
    if (riskNum.isGreaterThan(new BigNumber(1e-4).times(EPS.plus(1)))) {
        return 'lv3';
    }
    // risk > 1e-6*(1+EPS)
    if (riskNum.isGreaterThan(new BigNumber(1e-6).times(EPS.plus(1)))) {
        return 'lv2';
    }
    // risk > 1e-8*(1+EPS)
    if (riskNum.isGreaterThan(new BigNumber(1e-8).times(EPS.plus(1)))) {
        return 'lv1';
    }
    return 'lv0';
}
export const appendApiPrefix = (url) => {
    // for cfx top N
    if (url.startsWith('/stat/')) {
        return url;
    }
    return `/v1${url}`;
};
export const simpleGetFetcher = async (...args) => {
    let [url, query] = args;
    if (query) {
        url = qs.stringify({ url, query });
    }
    return await fetch(appendApiPrefix(url), {
        method: 'get',
    });
};
export const useSWRWithGetFecher = (key, swrOpts = {}) => {
    const isTransferReq = (typeof key === 'string' && key.startsWith('/transfer')) ||
        (Array.isArray(key) &&
            typeof key[0] === 'string' &&
            key[0].startsWith('/transfer'));
    const { data, error, mutate } = useSWR(key, simpleGetFetcher, { ...swrOpts });
    let tokenAddress = '';
    // deal with token info
    if (isTransferReq && data && data.list) {
        tokenAddress = data.list.reduce((acc, trans) => {
            if (trans.address && !acc.includes(trans.address))
                acc.push(trans.address);
            return acc;
        }, []);
    }
    const { data: tokenData } = useSWR(qs.stringify({
        url: '/token',
        query: { addressArray: tokenAddress, fields: 'iconUrl' },
    }), simpleGetFetcher);
    if (tokenData && tokenData.list) {
        const newTransferList = data.list.map((trans) => {
            if (tokenAddress.includes(trans.address)) {
                const tokenInfo = tokenData.list.find((t) => t.address === trans.address);
                if (tokenInfo)
                    return { ...trans, token: { ...tokenInfo } };
            }
            return trans;
        });
        return {
            data: {
                ...data,
                list: newTransferList,
            },
            error,
            mutate,
        };
    }
    return { data, error, mutate };
};
export const mergeDeep = (...objects) => {
    return objects.reduce((prev, obj) => {
        if (isObject(obj)) {
            Object.keys(obj).forEach((key) => {
                const pVal = prev[key];
                const oVal = obj[key];
                if (Array.isArray(pVal) && Array.isArray(oVal)) {
                    prev[key] = pVal.concat(oVal);
                }
                else if (isObject(pVal) && isObject(oVal)) {
                    prev[key] = mergeDeep(pVal, oVal);
                }
                else {
                    prev[key] = oVal;
                }
            });
        }
        return prev;
    }, {});
};
const pubSubLib = () => {
    const subscribers = {};
    function publish(eventName, data) {
        const eventSubscribers = subscribers[eventName];
        if (!Array.isArray(eventSubscribers)) {
            return;
        }
        eventSubscribers.forEach((callback) => {
            callback(data);
        });
    }
    function subscribe(eventName, callback) {
        if (!Array.isArray(subscribers[eventName])) {
            subscribers[eventName] = [];
        }
        const eventSubscribers = subscribers[eventName] || [];
        eventSubscribers.push(callback);
        const index = eventSubscribers.length - 1;
        return () => {
            eventSubscribers.splice(index, 1);
        };
    }
    return {
        publish,
        subscribe,
    };
};
export const pubsub = pubSubLib();
const isNil = (value) => value === null || value === undefined;
export const publishRequestError = (e, type) => {
    let detail = '';
    if (e.code && e.message) {
        if (type === 'code') {
            detail = e.message;
        }
        else {
            detail = `Error Code: ${e.code} \n`;
            if (type === 'http') {
                const origin = window.location.origin;
                detail += `Rest Api Url: ${e.url?.includes('https://') ? e.url : origin + e.url} \n`;
            }
            if (type === 'rpc') {
                // detail += `RPC Url: ${RPC_SERVER} \n`;
                if (!isNil(e.method)) {
                    detail += `Method: ${e.method} \n`;
                }
                if (!isNil(e.data)) {
                    detail += `Data: ${e.data} \n`;
                }
            }
            detail += `Error Message: ${e.message} \n`;
        }
    }
    pubsub.publish('notify', {
        type: 'request',
        option: {
            code: type === 'rpc' ? 30001 : e.code || 20000, // code is used for title, 20000 means unknown issue
            message: e.message,
            detail: detail,
        },
    });
};
