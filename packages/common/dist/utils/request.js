import qs from 'qs';
import { publishRequestError } from './index';
const TIMEOUT_TIMESTAMP = 60000;
const checkStatus = (response) => {
    if ((response.status >= 200 && response.status < 300) ||
        response.status === 600) {
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
            publishRequestError({ url, code: 408, message: 'Request timeout' }, 'http');
            reject(new Error('Request timeout'));
        }, timeout);
        window
            .fetch(url, opts)
            .then(checkStatus)
            .then(parseJSON)
            .then(data => resolve(data))
            .catch(error => {
            if (error.name === 'AbortError') {
                publishRequestError({ url, code: 0, message: 'Fetch aborted' }, 'http');
                reject(new Error('Fetch aborted'));
            }
            else {
                publishRequestError({ url, code: error.status, message: error.message }, 'http');
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
export const fetch = (url, options = {}) => {
    const { promise } = fetchWithAbort(url, options);
    return promise;
};
export const sendRequestChart = async (config) => {
    try {
        const res = await fetch(`${config.url}?${qs.stringify(config.query)}`, {
            method: config.type || 'GET',
            body: config.body,
            headers: config.headers,
            signal: config.signal,
        });
        const data = res.data;
        data.list = res?.data?.list?.reverse() || res?.result?.list?.reverse() || [];
        return data;
    }
    catch (error) {
        console.error('Request failed', error);
        throw error;
    }
};
