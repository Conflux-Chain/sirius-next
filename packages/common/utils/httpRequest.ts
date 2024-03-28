import qs from 'qs';

interface Config {
    url: string;
    query: any;
    type?: any;
    body?: any;
    headers?: any;
    signal?: any;

}


export const sendRequest = async (config: Config) => {
    const response = await fetch(`${config.url}?${qs.stringify(config.query)}`, {
        method: config.type || 'GET',
        body: config.body,
        headers: config.headers,
        signal: config.signal,
    });
    return response.json();
};