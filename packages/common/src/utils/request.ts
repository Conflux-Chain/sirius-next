import qs from 'qs';
import { publishRequestError } from './index';

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

const parseJSON = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return response;
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
        { url, code: 408, message: 'Request timeout' },
        'http',
      );
      reject(new Error('Request timeout'));
    }, timeout);

    window
      .fetch(url, opts)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => resolve(data as T))
      .catch(error => {
        if (error.name === 'AbortError') {
          publishRequestError(
            { url, code: 0, message: 'Fetch aborted' },
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

interface CustomResponse {
  code: number;
  data: any;
  result: any;
  message: string;
  status: string;
}

const compatibleResult = (res: CustomResponse) => {
  return res.data || res.result || {};
};

const queryAddress = (address: string[]) => {
  return address.reduce((prev, curr, index) => {
    return !index ? `address=${curr}` : `${prev}&address=${curr}`;
  }, '');
};

export const sendRequestChart = async (config: Config) => {
  try {
    const res: CustomResponse = await fetch(
      `${config.url}?${qs.stringify(config.query)}`,
      {
        method: config.type || 'GET',
        body: config.body,
        headers: config.headers,
        signal: config.signal,
      },
    );
    const data = compatibleResult(res);
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
    const res: CustomResponse = await fetch(url, {
      method: 'GET',
    });

    return compatibleResult(res)?.map;
  } catch (error) {
    console.error('Request failed', error);
    throw error;
  }
};

export const sendRequestGasPrice = async () => {
  try {
    const res: CustomResponse = await fetch(`/stat/gasprice/tracker`, {
      method: 'GET',
    });
    return compatibleResult(res);
  } catch (error) {
    console.error('Request failed', error);
    throw error;
  }
};

export const reqNametag = async (address: string[]) => {
  const query = queryAddress(address);

  const res: CustomResponse = await fetch(`/v1/nametag?${query}`, {
    method: 'GET',
  });
  return compatibleResult(res)?.map;
};

export const reqContractAndToken = async (address: string[]) => {
  const query = queryAddress(address);

  const res: CustomResponse = await fetch(`/v1/contract-and-token?${query}`, {
    method: 'GET',
  });
  return compatibleResult(res)?.map;
};
