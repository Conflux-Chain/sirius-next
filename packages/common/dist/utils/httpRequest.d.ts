interface Config {
    url: string;
    query: any;
    type?: any;
    body?: any;
    headers?: any;
    signal?: any;
}
export declare const sendRequest: (config: Config) => Promise<any>;
export {};
//# sourceMappingURL=httpRequest.d.ts.map