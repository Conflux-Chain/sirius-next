// import { useEffect, useState, useRef } from 'react';
import { Conflux } from "js-conflux-sdk";

interface TxnLoopOptsType {
    callback?: (data: any) => void;
    timeout?: number;
    method?: string;
}

export const getTransactionLoop = function (
    CFX: Conflux,
    hash: string,
    outOptions: TxnLoopOptsType,
) {
    const options = {
        callback: () => { },
        timeout: 2000,
        method: 'getTransactionByHash',
        ...outOptions,
    };
    return new Promise((resolve, reject) => {
        const loop = function () {
            const t = options.timeout;
            CFX.cfx[options.method](hash)
                .then((resp: any) => {
                    try {
                        if (resp) {
                            let status = null;
                            if (options.method === 'getTransactionByHash') {
                                status = resp && resp.status;
                            } else if (options.method === 'getTransactionReceipt') {
                                status = resp && resp.outcomeStatus;
                            }
                            options.callback(resp);
                            if (status !== 0) {
                                setTimeout(() => {
                                    loop();
                                }, t);
                            } else {
                                resolve(resp);
                                return resp;
                            }
                        } else {
                            setTimeout(() => {
                                loop();
                            }, t);
                        }
                    } catch (e) {
                        reject(e);
                    }
                })
                .catch(() => {
                    try {
                        setTimeout(() => {
                            loop();
                        }, t);
                    } catch (e) {
                        throw e;
                    }
                });
        };
        loop();
    });
};

export const useGetTxnStatus = (
    { useEffect, useState, useRef }: any,
    CFX: any,
    txnHashs: Array<string>,
    timeout?: number, // timeout to polling txn status,
    method?: any, // getTransactionByHash or getTransactionReceipt,
) => {
    // 0 for success, 1 for error occured, null when the transaction is skipped or not packed.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [status, setStatus] = useState({});
    const markedHashs: any = useRef({});

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const newHashs = txnHashs.filter(h => !markedHashs.current[h]);
        if (newHashs.length) {
            newHashs.forEach(h => {
                markedHashs.current[h] = true;
                getTransactionLoop(CFX, h, {
                    callback: resp => {
                        setStatus((statusMap: { [key: string]: any }) => {
                            const markedHashsKeys = Object.keys(markedHashs.current);
                            const updatedStatusMap = markedHashsKeys.reduce((prev: { [key: string]: any }, curr) => {
                                prev[curr] = statusMap[curr];
                                return prev;
                            }, {});
                            updatedStatusMap[h] = resp?.status;
                            return updatedStatusMap;
                        });
                    },
                    timeout: timeout || 2000,
                    method: method || 'getTransactionByHash',
                });
            });
        }
    });

    return {
        status,
    };
};
