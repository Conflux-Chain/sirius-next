import { publishRequestError } from './pubsub';

const request = async <T>(method: string, ...args: any[]): Promise<T> => {
  const CFX = (window as any).CFX;

  try {
    const [namespace, m] = method.split('_');
    // 断言 CFX[namespace][m] 为一个函数，并调用它
    if (namespace && m && typeof CFX[namespace][m] === 'function') {
      return await CFX[namespace][m](...args);
    } else {
      throw new Error(
        `Method ${m} is not a function in namespace ${namespace}`,
      );
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      publishRequestError(e, 'rpc');
    } else {
      console.error('Unexpected error', e);
    }
    throw e;
  }
};

export const getAccount = async (...args: any[]) => {
  try {
    return request('cfx_getAccount', ...args);
  } catch (e) {
    throw e;
  }
};
