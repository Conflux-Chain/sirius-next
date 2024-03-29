"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetTxnStatus = exports.getTransactionLoop = void 0;
const react_1 = require("react");
const CFX = window.CFX;
const getTransactionLoop = function (hash, outOptions) {
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
                .then((resp) => {
                try {
                    if (resp) {
                        let status = null;
                        if (options.method === 'getTransactionByHash') {
                            status = resp && resp.status;
                        }
                        else if (options.method === 'getTransactionReceipt') {
                            status = resp && resp.outcomeStatus;
                        }
                        options.callback(resp);
                        if (status !== 0) {
                            setTimeout(() => {
                                loop();
                            }, t);
                        }
                        else {
                            resolve(resp);
                            return resp;
                        }
                    }
                    else {
                        setTimeout(() => {
                            loop();
                        }, t);
                    }
                }
                catch (e) {
                    reject(e);
                }
            })
                .catch(() => {
                try {
                    setTimeout(() => {
                        loop();
                    }, t);
                }
                catch (e) {
                    throw e;
                }
            });
        };
        loop();
    });
};
exports.getTransactionLoop = getTransactionLoop;
const useGetTxnStatus = (txnHashs, timeout, // timeout to polling txn status,
method) => {
    // 0 for success, 1 for error occured, null when the transaction is skipped or not packed.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [status, setStatus] = (0, react_1.useState)({});
    const markedHashs = (0, react_1.useRef)({});
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (0, react_1.useEffect)(() => {
        const newHashs = txnHashs.filter(h => !markedHashs.current[h]);
        if (newHashs.length) {
            newHashs.forEach(h => {
                markedHashs.current[h] = true;
                (0, exports.getTransactionLoop)(h, {
                    callback: resp => {
                        setStatus((statusMap) => {
                            const markedHashsKeys = Object.keys(markedHashs.current);
                            const updatedStatusMap = markedHashsKeys.reduce((prev, curr) => {
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
exports.useGetTxnStatus = useGetTxnStatus;
