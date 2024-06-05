import { useEffect, useState, useRef } from 'react';

interface TxnLoopOptsType {
  callback?: (data: any) => void;
  timeout?: number;
  method?: string;
}

const promiseCache: { [key: string]: Promise<any> } = {};
const callbacksCache: Record<string, ((response: any) => void)[]> = {};

export const getTransactionLoop = function (
  hash: string,
  outOptions: TxnLoopOptsType,
) {
  const options = {
    callback: () => {},
    timeout: 2000,
    method: 'getTransactionByHash',
    ...outOptions,
  };

  if (!callbacksCache[hash]) {
    callbacksCache[hash] = [];
  }
  if (options.callback) {
    callbacksCache[hash]?.push(options.callback);
  }

  if (promiseCache[hash]) {
    return promiseCache[hash];
  }

  promiseCache[hash] = new Promise<any>((resolve, reject) => {
    const loop = function () {
      const t: number = options.timeout;
      const CFX = (window as any).CFX;
      CFX.cfx[options.method](hash)
        .then((resp: any) => {
          try {
            if (resp) {
              let status: number | null = null;
              if (options.method === 'getTransactionByHash') {
                status = resp && resp.status;
              } else if (options.method === 'getTransactionReceipt') {
                status = resp && resp.outcomeStatus;
              }

              callbacksCache[hash]?.forEach(cb => cb(resp));

              if (status !== 0) {
                setTimeout(() => {
                  loop();
                }, t);
              } else {
                resolve(resp);
                delete promiseCache[hash];
                delete callbacksCache[hash];
                return resp;
              }
            } else {
              setTimeout(() => {
                loop();
              }, t);
            }
          } catch (e) {
            reject(e);
            delete promiseCache[hash];
            delete callbacksCache[hash];
          }
        })
        .catch(() => {
          try {
            setTimeout(() => {
              loop();
            }, t);
          } catch (e) {
            reject(e);
            delete promiseCache[hash];
            delete callbacksCache[hash];
          }
        });
    };
    loop();
  });

  return promiseCache[hash];
};

export const useGetTxnStatus = (
  txnHashs: Array<string>,
  timeout?: number, // timeout to polling txn status,
  method?: any, // getTransactionByHash or getTransactionReceipt,
) => {
  // 0 for success, 1 for error occured, null when the transaction is skipped or not packed.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [status, setStatus] = useState<{ [key: string]: any }>({});
  const markedHashs = useRef<{ [key: string]: boolean }>({});

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const newHashs = txnHashs.filter(h => !markedHashs.current[h]);
    if (newHashs.length) {
      newHashs.forEach(h => {
        markedHashs.current[h] = true;

        getTransactionLoop(h, {
          callback: resp => {
            setStatus((statusMap: { [key: string]: any }) => {
              const markedHashsKeys = Object.keys(markedHashs.current);
              const updatedStatusMap = markedHashsKeys.reduce(
                (prev: { [key: string]: any }, curr) => {
                  prev[curr] = statusMap[curr];
                  return prev;
                },
                {},
              );
              updatedStatusMap[h] = resp?.status;
              return updatedStatusMap;
            });
          },
          timeout: timeout || 2000,
          method: method || 'getTransactionByHash',
        });
      });
    }
  }, [txnHashs]);

  return {
    status,
  };
};
