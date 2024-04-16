// src/utils/hooks/useGetTxnStatus.ts
import { useEffect, useState, useRef } from "react";
var CFX = window.CFX;
var getTransactionLoop = function(hash, outOptions) {
  const options = {
    callback: () => {
    },
    timeout: 2e3,
    method: "getTransactionByHash",
    ...outOptions
  };
  return new Promise((resolve, reject) => {
    const loop = function() {
      const t = options.timeout;
      CFX.cfx[options.method](hash).then((resp) => {
        try {
          if (resp) {
            let status = null;
            if (options.method === "getTransactionByHash") {
              status = resp && resp.status;
            } else if (options.method === "getTransactionReceipt") {
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
      }).catch(() => {
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
var useGetTxnStatus = (txnHashs, timeout, method) => {
  const [status, setStatus] = useState({});
  const markedHashs = useRef({});
  useEffect(() => {
    const newHashs = txnHashs.filter((h) => !markedHashs.current[h]);
    if (newHashs.length) {
      newHashs.forEach((h) => {
        markedHashs.current[h] = true;
        getTransactionLoop(h, {
          callback: (resp) => {
            setStatus((statusMap) => {
              const markedHashsKeys = Object.keys(markedHashs.current);
              const updatedStatusMap = markedHashsKeys.reduce(
                (prev, curr) => {
                  prev[curr] = statusMap[curr];
                  return prev;
                },
                {}
              );
              updatedStatusMap[h] = resp?.status;
              return updatedStatusMap;
            });
          },
          timeout: timeout || 2e3,
          method: method || "getTransactionByHash"
        });
      });
    }
  });
  return {
    status
  };
};
export {
  getTransactionLoop,
  useGetTxnStatus
};
//# sourceMappingURL=useGetTxnStatus.js.map