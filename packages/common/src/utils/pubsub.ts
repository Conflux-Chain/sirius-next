import { getEnvConfig } from '../store';

type EventName = string;
type Callback = (data: any) => void;

interface Subscribers {
  [eventName: string]: Callback[];
}

const pubSubLib = () => {
  const subscribers: Subscribers = {};

  function publish(eventName: EventName, data: any): void {
    const eventSubscribers = subscribers[eventName];
    if (!Array.isArray(eventSubscribers)) {
      return;
    }
    eventSubscribers.forEach(callback => {
      callback(data);
    });
  }

  function subscribe(eventName: EventName, callback: Callback): () => void {
    if (!Array.isArray(subscribers[eventName])) {
      subscribers[eventName] = [];
    }
    const eventSubscribers = subscribers[eventName] || [];
    eventSubscribers.push(callback);
    const index = eventSubscribers.length - 1;
    return () => {
      eventSubscribers.splice(index, 1);
    };
  }

  return {
    publish,
    subscribe,
  };
};

export const pubsub = pubSubLib();

interface ErrorInfoType {
  url?: string;
  code?: number;
  message?: string;
  data?: string;
  method?: string;
}

const isNil = (value: any) => value === null || value === undefined;
export const publishRequestError = (
  e: (Error & ErrorInfoType) | ErrorInfoType,
  type: 'rpc' | 'http' | 'wallet' | 'code',
) => {
  let detail = '';
  if (e.code && e.message) {
    if (type === 'code') {
      detail = e.message;
    } else {
      detail = `Error Code: ${e.code} \n`;
      if (type === 'http') {
        const origin = window.location.origin;
        detail += `Rest Api Url: ${
          e.url?.includes('https://') ? e.url : origin + e.url
        } \n`;
      }
      if (type === 'rpc') {
        const RPC_SERVER = getEnvConfig().ENV_RPC_SERVER;
        if (RPC_SERVER) {
          detail += `RPC Url: ${RPC_SERVER} \n`;
        }
        if (!isNil(e.method)) {
          detail += `Method: ${e.method} \n`;
        }
        if (!isNil(e.data)) {
          detail += `Data: ${e.data} \n`;
        }
      }
      detail += `Error Message: ${e.message} \n`;
    }
  }

  pubsub.publish('notify', {
    type: 'request',
    option: {
      code: type === 'rpc' ? 30001 : e.code || 20000, // code is used for title, 20000 means unknown issue
      message: e.message,
      detail: detail,
    },
  });
};
