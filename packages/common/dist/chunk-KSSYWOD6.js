import {
  publishRequestError
} from "./chunk-4LQWWDGW.js";

// src/utils/request.ts
import qs from "qs";
var TIMEOUT_TIMESTAMP = 6e4;
var checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300 || response.status === 600) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.name = "HttpError";
    error.status = response.status;
    error.response = response;
    throw error;
  }
};
var parseJSON = async (response) => {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return response;
  }
};
var fetchWithAbort = (url, options = {}) => {
  const controller = new AbortController();
  const opts = { ...options, signal: controller.signal };
  const timeout = options.timeout || TIMEOUT_TIMESTAMP;
  let timeoutId;
  const promise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      publishRequestError(
        { url, code: 408, message: "Request timeout" },
        "http"
      );
      reject(new Error("Request timeout"));
    }, timeout);
    window.fetch(url, opts).then(checkStatus).then(parseJSON).then((data) => resolve(data)).catch((error) => {
      if (error.name === "AbortError") {
        publishRequestError(
          { url, code: 0, message: "Fetch aborted" },
          "http"
        );
        reject(new Error("Fetch aborted"));
      } else {
        publishRequestError(
          { url, code: error.status, message: error.message },
          "http"
        );
        reject(error);
      }
    }).finally(() => clearTimeout(timeoutId));
  });
  return {
    promise,
    abort: () => {
      clearTimeout(timeoutId);
      controller.abort();
    }
  };
};
var fetch = (url, options = {}) => {
  const { promise } = fetchWithAbort(url, options);
  return promise;
};
var sendRequestChart = async (config) => {
  try {
    const res = await fetch(
      `${config.url}?${qs.stringify(config.query)}`,
      {
        method: config.type || "GET",
        body: config.body,
        headers: config.headers,
        signal: config.signal
      }
    );
    const data = res.data || res.result || {};
    data.list = [...data.list || []].reverse();
    return data;
  } catch (error) {
    console.error("Request failed", error);
    throw error;
  }
};

export {
  fetch,
  sendRequestChart
};
//# sourceMappingURL=chunk-KSSYWOD6.js.map