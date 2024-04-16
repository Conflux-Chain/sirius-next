interface FetchOptions extends RequestInit {
    timeout?: number;
}
declare const fetch: <T>(url: string, options?: FetchOptions) => Promise<T>;
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
declare const sendRequestChart: (config: Config) => Promise<any>;

export { fetch, sendRequestChart };
