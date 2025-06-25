import qs from 'query-string';
import { publishRequestError } from './pubsub';
import useSWR from 'swr';

interface FetchWithAbortType<T> {
  promise: Promise<T>;
  abort: () => void;
}

interface FetchOptions extends RequestInit {
  timeout?: number;
}

const TIMEOUT_TIMESTAMP = 60000;

const checkStatus = (response: Response) => {
  if (
    (response.status >= 200 && response.status < 300) ||
    response.status === 600
  ) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.name = 'HttpError';
    (error as any).status = response.status;
    (error as any).response = response;
    throw error;
  }
};

// 格式化 response data
const parseJSON = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  try {
    if (contentType?.includes('application/json')) {
      return { data: await response.json(), response };
    } else if (contentType?.includes('text/html')) {
      return { data: await response.text(), response };
    } else {
      // contentType 还有其他类型，目前项目中用不到
      // 不能简单的报错，比如 image/x-icon 是 favicon 请求
      // 此处直接返回 response，由业务代码处理其他类型的数据
      return { data: response, response };
    }
  } catch (error) {
    if ((error as any).name === 'AbortError') {
      return { data: response, response };
    }
    publishRequestError({ url: response.url, code: 20001 }, 'http');
    (error as any).response = response;
    throw error;
  }
};

// 检查返回值中是否包含错误
const checkResponse = function (
  url: string,
  {
    data,
    response,
  }: {
    data: any;
    response: Response;
  },
  opts: any,
) {
  // 兼容 data.code 和 data.data, 是关于 core space 的数据结构
  if (response.status === 200 && (data.status === '1' || data.code === 0)) {
    return data.result || data.data;
  } else if (/HEAD/i.test(opts?.method || '')) {
    // handle of HEAD method
    return response;
  } else {
    const code = Number(data.status ?? data.code);
    publishRequestError({ url, code, message: data.message }, 'http');
    const error: Partial<ErrorEvent> & {
      response?: ResponseType;
    } = new Error(data.message);
    error.response = data;
    throw error;
  }
};

const fetchWithAbort = <T>(
  url: string,
  options: FetchOptions = {},
): FetchWithAbortType<T> => {
  const controller = new AbortController();
  const opts: FetchOptions = { ...options, signal: controller.signal };
  const timeout = options.timeout || TIMEOUT_TIMESTAMP;

  let timeoutId: ReturnType<typeof setTimeout>;
  const promise: Promise<T> = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      publishRequestError(
        { url, code: 20002, message: 'Request timeout' },
        'http',
      );
      reject(new Error('Request timeout'));
    }, timeout);

    window
      .fetch(url, opts)
      .then(checkStatus)
      .then(parseJSON)
      .then((...args) => checkResponse(url, ...args, opts))
      .then(data => resolve(data as T))
      .catch(error => {
        if (/HEAD/i.test(opts?.method || '')) {
          return {};
        }

        // A fetch() promise will reject with a TypeError when a network error is encountered or CORS is misconfigured on the server-side,
        // although this usually means permission issues or similar — a 404 does not constitute a network error, for example.
        // For detail: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        if (error.name === 'TypeError') {
          publishRequestError({ url, code: 20004 }, 'http');
          reject(new Error('Network error'));
        } else if (error.name === 'AbortError') {
          publishRequestError(
            { url, code: 20003, message: 'Fetch aborted' },
            'http',
          );
          reject(new Error('Fetch aborted'));
        } else {
          publishRequestError(
            { url, code: (error as any).status, message: error.message },
            'http',
          );
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

export const fetch = <T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> => {
  const { promise } = fetchWithAbort<T>(url, options);
  return promise;
};

export const appendApiPrefix = (url: string) => {
  // for cfx top N
  if (url.startsWith('/stat/')) {
    return url;
  }
  if (url.startsWith('http')) {
    return url;
  }
  return `/v1${url.startsWith('/') ? url : '/' + url}`;
};

export const fetchWithPrefix = <T>(url: string, opts?: FetchOptions) => {
  return fetch<T>(appendApiPrefix(url), opts);
};

export const simpleGetFetcher = async <T>(...args: any[]) => {
  let [url, query] = args;
  if (query) {
    url = qs.stringifyUrl({ url, query });
  }
  return await fetchWithPrefix<T>(url, {
    method: 'get',
  });
};

export const useSWRWithGetFetcher = (
  key: string | string[] | null,
  swrOpts = {},
) => {
  const isTransferReq =
    (typeof key === 'string' && key.startsWith('/transfer')) ||
    (Array.isArray(key) &&
      typeof key[0] === 'string' &&
      key[0].startsWith('/transfer'));

  const { data, error, mutate }: any = useSWR(key, simpleGetFetcher, {
    ...swrOpts,
  });

  let tokenAddress: string | string[] = '';

  // deal with token info
  if (isTransferReq && data && data.list) {
    tokenAddress = data.list.reduce(
      (acc: string[], trans: { address: string }) => {
        if (trans.address && !acc.includes(trans.address))
          acc.push(trans.address);
        return acc;
      },
      [],
    );
  }

  const { data: tokenData }: any = useSWR(
    tokenAddress
      ? qs.stringifyUrl({
          url: '/token',
          query: { addressArray: tokenAddress, fields: 'iconUrl' },
        })
      : null,
    simpleGetFetcher,
  );

  if (tokenData && tokenData.list) {
    const newTransferList = data.list.map((trans: { address: string }) => {
      if (tokenAddress.includes(trans.address)) {
        const tokenInfo = tokenData.list.find(
          (t: { address: string }) => t.address === trans.address,
        );
        if (tokenInfo) return { ...trans, token: { ...tokenInfo } };
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

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
interface QueryParams {
  [key: string]: string;
}
interface Config {
  url: string;
  query: QueryParams;
  type?: RequestMethod;
  body?: any;
  headers?: Headers;
  signal?: AbortSignal;
}

const queryAddress = (address: string[]) => {
  return address.reduce((prev, curr, index) => {
    return !index ? `address=${curr}` : `${prev}&address=${curr}`;
  }, '');
};

export const sendRequestChart = async (config: Config) => {
  try {
    const res: any = await fetch(
      qs.stringifyUrl({ url: config.url, query: config.query }),
      {
        method: config.type || 'GET',
        body: config.body,
        headers: config.headers,
        signal: config.signal,
      },
    );
    const data = res;
    data.list = [...(data.list || [])].reverse();
    return data;
  } catch (error) {
    console.error('Request failed', error);
    throw error;
  }
};

export const sendRequestENSInfo = async (url?: string | null) => {
  if (!url) return {};
  try {
    const res: any = await fetch(url, {
      method: 'GET',
    });

    return res?.map;
  } catch (error) {
    console.error('Request failed', error);
    throw error;
  }
};

export const sendRequestGasPrice = async () => {
  try {
    const res: any = await fetch(`/stat/gasprice/tracker`, {
      method: 'GET',
    });
    return res;
  } catch (error) {
    console.error('Request failed', error);
    throw error;
  }
};

export const reqNametag = async (address: string[]) => {
  const query = queryAddress(address);

  const res: any = await fetch(`/v1/nametag?${query}`, {
    method: 'GET',
  });
  return res?.map;
};

export const reqContractAndToken = async (address: string[]) => {
  const query = queryAddress(address);

  const res: any = await fetch(`/v1/contract-and-token?${query}`, {
    method: 'GET',
  });
  return res?.map;
};

export const reqContractInfo = (
  contractAddress?: string,
  fields: string[] = [],
) => {
  const url = qs.stringifyUrl({
    url: `/v1/contract/${contractAddress}`,
    query: { fields },
  });

  return fetch(url, {
    method: 'GET',
  });
};
