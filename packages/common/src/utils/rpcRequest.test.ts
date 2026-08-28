import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

const publishRequestErrorMock = vi.fn();

vi.mock('./pubsub', () => ({
  publishRequestError: (...args: unknown[]) => publishRequestErrorMock(...args),
}));

import { getAccount } from './rpcRequest';

describe('rpcRequest', () => {
  let previousCFX: unknown;

  beforeEach(() => {
    previousCFX = (window as any).CFX;
    delete (window as any).CFX;
    publishRequestErrorMock.mockReset();
  });

  afterEach(() => {
    if (previousCFX === undefined) {
      delete (window as any).CFX;
    } else {
      (window as any).CFX = previousCFX;
    }
  });

  test('dispatches an RPC method through window.CFX', async () => {
    const getAccountMock = vi.fn().mockResolvedValue({
      address: 'cfx:account',
    });
    (window as any).CFX = {
      cfx: {
        getAccount: getAccountMock,
      },
    };

    await expect(getAccount('cfx:address', 'latest')).resolves.toEqual({
      address: 'cfx:account',
    });
    expect(getAccountMock).toHaveBeenCalledWith('cfx:address', 'latest');
    expect(publishRequestErrorMock).not.toHaveBeenCalled();
  });

  test('publishes and rethrows when window.CFX is unavailable', async () => {
    const result = getAccount('cfx:address');

    await expect(result).rejects.toThrow();
    expect(publishRequestErrorMock).toHaveBeenCalledTimes(1);
    const [error, source] = publishRequestErrorMock.mock.calls[0]!;
    expect(error).toBeInstanceOf(Error);
    expect(source).toBe('rpc');
  });
});
