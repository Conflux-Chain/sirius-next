import {
  publishRequestError
} from "./chunk-4LQWWDGW.js";

// src/utils/rpcRequest.ts
var request = async (method, ...args) => {
  const CFX = window.CFX;
  try {
    const [namespace, m] = method.split("_");
    if (namespace && m && typeof CFX[namespace][m] === "function") {
      return await CFX[namespace][m](...args);
    } else {
      throw new Error(
        `Method ${m} is not a function in namespace ${namespace}`
      );
    }
  } catch (e) {
    if (e instanceof Error) {
      publishRequestError(e, "rpc");
    } else {
      console.error("Unexpected error", e);
    }
    throw e;
  }
};
var getAccount = async (...args) => {
  try {
    return request("cfx_getAccount", ...args);
  } catch (e) {
    throw e;
  }
};

export {
  getAccount
};
//# sourceMappingURL=chunk-PIWYBVLY.js.map