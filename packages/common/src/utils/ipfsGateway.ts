export const IPFS_GATEWAY_LIST_URL =
  'https://raw.githubusercontent.com/ipfs/public-gateway-checker/refs/heads/main/gateways.json';
export const IPFS_GATEWAY_SAMPLE_CID =
  'bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m';

export type IPFSGatewayDetectCode = 'OK' | 'NOT_OK';

export interface IPFSGatewayDetectResult {
  code: IPFSGatewayDetectCode;
  message: string;
  data: {
    gateway: string;
    host: string;
    url: string;
    time?: number;
    status?: number;
    contentType?: string | null;
  };
}

export interface FetchIPFSGatewayListOptions {
  fetcher?: typeof globalThis.fetch;
  listUrl?: string;
  timeout?: number;
  useCache?: boolean;
}

export interface DetectIPFSGatewayOptions {
  fetcher?: typeof globalThis.fetch;
  cid?: string;
  timeout?: number;
  useDetectCache?: boolean;
}

export interface DetectIPFSGatewaysOptions extends DetectIPFSGatewayOptions {
  gateways?: string[];
  listUrl?: string;
  pageSize?: number;
  useCache?: boolean;
}

export interface DetectIPFSGatewaysResult {
  fastest?: string;
  results: IPFSGatewayDetectResult[];
  availableGateways: IPFSGatewayDetectResult[];
}

const DEFAULT_TIMEOUT = 3000;
const DEFAULT_PAGE_SIZE = 5;
export const IPFS_GATEWAY_GLOBAL_CACHE_KEY =
  '__SIRIUS_NEXT_IPFS_GATEWAY_CACHE__';
export const IPFS_GATEWAY_LIST_STORAGE_PREFIX =
  'sirius-next:ipfs-gateway:list:';
export const IPFS_GATEWAY_DETECT_STORAGE_PREFIX =
  'sirius-next:ipfs-gateway:detect:';
export const IPFS_GATEWAY_RELOAD_CLEANED_KEY =
  'sirius-next:ipfs-gateway:reload-cleaned';

interface IPFSGatewayCache {
  gatewayListPromiseMap: Map<string, Promise<string[]>>;
  gatewayDetectPromiseMap: Map<string, Promise<IPFSGatewayDetectResult>>;
}

const getIPFSGatewayCache = (): IPFSGatewayCache => {
  clearSessionCacheOnReload();
  const globalObject = globalThis as typeof globalThis & {
    [IPFS_GATEWAY_GLOBAL_CACHE_KEY]?: IPFSGatewayCache;
  };
  globalObject[IPFS_GATEWAY_GLOBAL_CACHE_KEY] ??= {
    gatewayListPromiseMap: new Map<string, Promise<string[]>>(),
    gatewayDetectPromiseMap: new Map<
      string,
      Promise<IPFSGatewayDetectResult>
    >(),
  };
  return globalObject[IPFS_GATEWAY_GLOBAL_CACHE_KEY];
};

export const clearIPFSGatewayListCache = () => {
  getIPFSGatewayCache().gatewayListPromiseMap.clear();
  clearSessionListCache();
};

export const clearIPFSGatewayDetectCache = () => {
  getIPFSGatewayCache().gatewayDetectPromiseMap.clear();
  clearSessionDetectCache();
};

export const normalizeIPFSGateway = (gateway: string) => {
  if (!gateway || typeof gateway !== 'string') {
    return undefined;
  }
  const target = gateway.trim();
  if (!target) {
    return undefined;
  }
  return target.endsWith('/') ? target.slice(0, -1) : target;
};

export const hostFromIPFSGateway = (gateway: string) => {
  try {
    return new URL(gateway).host;
  } catch (_) {
    const parts = gateway.split('://');
    const urlExcludeProtocol = (parts.length > 1 ? parts[1] : parts[0]) ?? '';
    return urlExcludeProtocol.split('/')[0] ?? '';
  }
};

export const tmplFromIPFSGateway = (
  userGateway: string,
  gatewayList: string[],
) => {
  const target = normalizeIPFSGateway(userGateway);
  if (!target) {
    return undefined;
  }
  return new Set(gatewayList.map(gateway => normalizeIPFSGateway(gateway))).has(
    target,
  )
    ? target
    : undefined;
};

const requestWithTimeout = async (
  url: string,
  fetcher: typeof globalThis.fetch,
  timeout: number,
) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetcher(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const getSessionStorage = () => {
  try {
    return globalThis.sessionStorage;
  } catch (_) {
    return undefined;
  }
};

const getNavigationType = () => {
  const navigationEntry = globalThis.performance?.getEntriesByType?.(
    'navigation',
  )?.[0] as PerformanceNavigationTiming | undefined;
  if (navigationEntry?.type) {
    return navigationEntry.type;
  }

  return globalThis.performance?.navigation?.type === 1 ? 'reload' : undefined;
};

const clearSessionCacheOnReload = () => {
  const globalObject = globalThis as typeof globalThis & {
    [IPFS_GATEWAY_RELOAD_CLEANED_KEY]?: boolean;
  };
  if (globalObject[IPFS_GATEWAY_RELOAD_CLEANED_KEY]) {
    return;
  }
  globalObject[IPFS_GATEWAY_RELOAD_CLEANED_KEY] = true;

  if (getNavigationType() === 'reload') {
    clearSessionListCache();
    clearSessionDetectCache();
  }
};

const clearSessionCacheByPrefix = (prefix: string) => {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  try {
    const keys = Array.from({ length: storage.length })
      .map((_, index) => storage.key(index))
      .filter((key): key is string => Boolean(key?.startsWith(prefix)));
    keys.forEach(key => storage.removeItem(key));
  } catch (_) {
    /* empty */
  }
};

const clearSessionListCache = () => {
  clearSessionCacheByPrefix(IPFS_GATEWAY_LIST_STORAGE_PREFIX);
};

const clearSessionDetectCache = () => {
  clearSessionCacheByPrefix(IPFS_GATEWAY_DETECT_STORAGE_PREFIX);
};

const getSessionListCache = (listUrl: string) => {
  const storage = getSessionStorage();
  if (!storage) {
    return undefined;
  }

  try {
    const item = storage.getItem(
      `${IPFS_GATEWAY_LIST_STORAGE_PREFIX}${listUrl}`,
    );
    if (!item) {
      return undefined;
    }
    const data = JSON.parse(item);
    return Array.isArray(data) &&
      data.every(gateway => typeof gateway === 'string')
      ? data
      : undefined;
  } catch (_) {
    return undefined;
  }
};

const setSessionListCache = (listUrl: string, gatewayList: string[]) => {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(
      `${IPFS_GATEWAY_LIST_STORAGE_PREFIX}${listUrl}`,
      JSON.stringify(gatewayList),
    );
  } catch (_) {
    /* empty */
  }
};

const getSessionDetectCache = (cacheKey: string) => {
  const storage = getSessionStorage();
  if (!storage) {
    return undefined;
  }

  try {
    const item = storage.getItem(
      `${IPFS_GATEWAY_DETECT_STORAGE_PREFIX}${cacheKey}`,
    );
    if (!item) {
      return undefined;
    }
    const result = JSON.parse(item) as IPFSGatewayDetectResult;
    return result?.data?.url === cacheKey ? result : undefined;
  } catch (_) {
    return undefined;
  }
};

const setSessionDetectCache = (
  cacheKey: string,
  result: IPFSGatewayDetectResult,
) => {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(
      `${IPFS_GATEWAY_DETECT_STORAGE_PREFIX}${cacheKey}`,
      JSON.stringify(result),
    );
  } catch (_) {
    /* empty */
  }
};

const fetchIPFSGatewayListWithoutCache = async ({
  fetcher = globalThis.fetch,
  listUrl = IPFS_GATEWAY_LIST_URL,
  timeout = DEFAULT_TIMEOUT,
}: FetchIPFSGatewayListOptions = {}) => {
  const response = await requestWithTimeout(listUrl, fetcher, timeout);
  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map(gateway => normalizeIPFSGateway(gateway))
    .filter((gateway): gateway is string => Boolean(gateway));
};

export const fetchIPFSGatewayList = (
  options: FetchIPFSGatewayListOptions = {},
) => {
  const listUrl = options.listUrl ?? IPFS_GATEWAY_LIST_URL;
  if (options.useCache === false) {
    return fetchIPFSGatewayListWithoutCache({ ...options, listUrl });
  }

  const { gatewayListPromiseMap } = getIPFSGatewayCache();
  let gatewayListPromise = gatewayListPromiseMap.get(listUrl);
  if (!gatewayListPromise) {
    const storedGatewayList = getSessionListCache(listUrl);
    if (storedGatewayList) {
      gatewayListPromise = Promise.resolve(storedGatewayList);
      gatewayListPromiseMap.set(listUrl, gatewayListPromise);
      return gatewayListPromise;
    }

    gatewayListPromise = fetchIPFSGatewayListWithoutCache({
      ...options,
      listUrl,
    })
      .then(gatewayList => {
        setSessionListCache(listUrl, gatewayList);
        return gatewayList;
      })
      .catch(error => {
        gatewayListPromiseMap.delete(listUrl);
        throw error;
      });
    gatewayListPromiseMap.set(listUrl, gatewayListPromise);
  }
  return gatewayListPromise;
};

export const detectIPFSGateway = async (
  gateway: string,
  {
    fetcher = globalThis.fetch,
    cid = IPFS_GATEWAY_SAMPLE_CID,
    timeout = DEFAULT_TIMEOUT,
    useDetectCache = true,
  }: DetectIPFSGatewayOptions = {},
): Promise<IPFSGatewayDetectResult> => {
  const normalizedGateway = normalizeIPFSGateway(gateway) ?? gateway;
  const host = hostFromIPFSGateway(normalizedGateway);
  const url = `${normalizedGateway}/ipfs/${cid}`;
  const cacheKey = url;

  if (useDetectCache) {
    const { gatewayDetectPromiseMap } = getIPFSGatewayCache();
    const cachedResult = gatewayDetectPromiseMap.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const storedResult = getSessionDetectCache(cacheKey);
    if (storedResult) {
      const storedPromise = Promise.resolve(storedResult);
      gatewayDetectPromiseMap.set(cacheKey, storedPromise);
      return storedPromise;
    }
  }

  const detectPromise = detectIPFSGatewayWithoutCache({
    fetcher,
    timeout,
    normalizedGateway,
    host,
    url,
  }).then(result => {
    if (useDetectCache) {
      setSessionDetectCache(cacheKey, result);
    }
    return result;
  });

  if (useDetectCache) {
    const { gatewayDetectPromiseMap } = getIPFSGatewayCache();
    gatewayDetectPromiseMap.set(cacheKey, detectPromise);
  }

  return detectPromise;
};

const detectIPFSGatewayWithoutCache = async ({
  fetcher,
  timeout,
  normalizedGateway,
  host,
  url,
}: {
  fetcher: typeof globalThis.fetch;
  timeout: number;
  normalizedGateway: string;
  host: string;
  url: string;
}): Promise<IPFSGatewayDetectResult> => {
  const startedAt = Date.now();
  const baseResult = {
    data: {
      gateway: normalizedGateway,
      host,
      url,
    },
  };

  try {
    const response = await requestWithTimeout(url, fetcher, timeout);
    const time = Date.now() - startedAt;
    const contentType = response.headers.get('content-type');
    const result = {
      data: {
        ...baseResult.data,
        time,
        status: response.status,
        contentType,
      },
    };

    if (response.ok && contentType?.startsWith('text/plain')) {
      return {
        ...result,
        code: 'OK',
        message: 'success',
      };
    }

    return {
      ...result,
      code: 'NOT_OK',
      message: 'fetch fail',
    };
  } catch (_) {
    return {
      ...baseResult,
      code: 'NOT_OK',
      message: 'fetch fail',
    };
  }
};

export const detectIPFSGateways = async ({
  gateways,
  pageSize = DEFAULT_PAGE_SIZE,
  fetcher = globalThis.fetch,
  cid = IPFS_GATEWAY_SAMPLE_CID,
  timeout = DEFAULT_TIMEOUT,
  listUrl = IPFS_GATEWAY_LIST_URL,
  useCache = true,
}: DetectIPFSGatewaysOptions = {}): Promise<DetectIPFSGatewaysResult> => {
  const gatewayList =
    gateways ??
    (await fetchIPFSGatewayList({ fetcher, listUrl, timeout, useCache }));
  const results: IPFSGatewayDetectResult[] = [];
  const normalizedGatewayList = gatewayList
    .map(gateway => normalizeIPFSGateway(gateway))
    .filter((gateway): gateway is string => Boolean(gateway));
  const safePageSize =
    Number.isFinite(pageSize) && pageSize > 0
      ? Math.max(1, Math.floor(pageSize))
      : DEFAULT_PAGE_SIZE;

  for (
    let skip = 0;
    skip < normalizedGatewayList.length;
    skip += safePageSize
  ) {
    const taskArray = normalizedGatewayList
      .slice(skip, skip + safePageSize)
      .map(gateway =>
        detectIPFSGateway(gateway, {
          fetcher,
          cid,
          timeout,
          useDetectCache: useCache,
        }),
      );
    results.push(...(await Promise.all(taskArray)));
  }

  const availableGateways = results
    .filter(result => result.code === 'OK' && result.data.time !== undefined)
    .sort((a, b) => Number(a.data.time) - Number(b.data.time));

  return {
    fastest: availableGateways[0]?.data.gateway,
    results,
    availableGateways,
  };
};
