interface Cache {
  createdAt: number;
  maxAge?: number;
  data: unknown;
}

const cacheMap = new Map<string, Cache>();

const mapStorage = {
  getItem: (key: string) => {
    const item = cacheMap.get(key);
    if (!item) {
      return {
        cache: false,
      };
    }
    const { data, createdAt, maxAge } = item;
    if (maxAge !== undefined && Date.now() - createdAt > maxAge) {
      cacheMap.delete(key);
      return {
        cache: false,
      };
    }
    return {
      data,
      cache: true,
    };
  },
  setItem: (key: string, value: Cache) => {
    cacheMap.set(key, value);
  },
  removeItem: (key: string) => {
    cacheMap.delete(key);
  },
};

export const fetchWithCache = <T extends (...params: any[]) => unknown>(
  fetcher: T,
  options: {
    key?: string;
    generateKey?: (...params: any[]) => string;
    maxAge?: number;
  } = {},
) => {
  return ((...args: any[]) => {
    const { key, generateKey, maxAge } = options;
    let cacheKey: string | null = null;
    try {
      cacheKey = generateKey
        ? generateKey(...args)
        : key
          ? key + JSON.stringify(args)
          : JSON.stringify(args);
    } catch (_) {
      return fetcher(...args);
    }
    const { cache, data } = mapStorage.getItem(cacheKey);
    if (cache) {
      return data;
    }
    const res = fetcher(...args);
    mapStorage.setItem(cacheKey, {
      data: res as any,
      maxAge,
      createdAt: Date.now(),
    });
    return res;
  }) as T;
};
