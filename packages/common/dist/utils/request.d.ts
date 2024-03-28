interface FetchOptions extends RequestInit {
    timeout?: number;
}
export declare const fetch: <T>(url: string, options?: FetchOptions) => Promise<T>;
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
export declare const sendRequest: (config: Config) => Promise<any>;
export {};
//# sourceMappingURL=request.d.ts.map