"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRequestChart = exports.fetch = void 0;
const qs_1 = __importDefault(require("qs"));
const index_1 = require("./index");
const TIMEOUT_TIMESTAMP = 60000;
const checkStatus = (response) => {
    if ((response.status >= 200 && response.status < 300) || response.status === 600) {
        return response;
    }
    else {
        const error = new Error(response.statusText);
        error.name = 'HttpError';
        error.status = response.status;
        error.response = response;
        throw error;
    }
};
const parseJSON = async (response) => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    else {
        return response;
    }
};
const fetchWithAbort = (url, options = {}) => {
    const controller = new AbortController();
    const opts = { ...options, signal: controller.signal };
    const timeout = options.timeout || TIMEOUT_TIMESTAMP;
    let timeoutId;
    const promise = new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
            controller.abort();
            (0, index_1.publishRequestError)({ url, code: 408, message: 'Request timeout' }, 'http');
            reject(new Error('Request timeout'));
        }, timeout);
        window.fetch(url, opts)
            .then(checkStatus)
            .then(parseJSON)
            .then((data) => resolve(data))
            .catch((error) => {
            if (error.name === 'AbortError') {
                (0, index_1.publishRequestError)({ url, code: 0, message: 'Fetch aborted' }, 'http');
                reject(new Error('Fetch aborted'));
            }
            else {
                (0, index_1.publishRequestError)({ url, code: error.status, message: error.message }, 'http');
                reject(error);
            }
        })
            .finally(() => clearTimeout(timeoutId));
    });
    return {
        promise,
        abort: () => {
            clearTimeout(timeoutId);
            controller.abort();
        },
    };
};
const fetch = (url, options = {}) => {
    const { promise } = fetchWithAbort(url, options);
    return promise;
};
exports.fetch = fetch;
const sendRequestChart = async (config) => {
    try {
        const res = await (0, exports.fetch)(`${config.url}?${qs_1.default.stringify(config.query)}`, {
            method: config.type || 'GET',
            body: config.body,
            headers: config.headers,
            signal: config.signal,
        });
        const data = {
            list: res?.data?.list.reverse() || res?.result?.list.reverse() || []
        };
        return data;
    }
    catch (error) {
        console.error('Request failed', error);
        throw error;
    }
};
exports.sendRequestChart = sendRequestChart;
