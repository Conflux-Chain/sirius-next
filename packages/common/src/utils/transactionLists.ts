import type { AccessList, Hex, RpcAuthorizationList } from 'viem';

export interface TransactionLists {
  accessList?: AccessList;
  authorizationList?: RpcAuthorizationList;
}

export type TransactionListField = keyof TransactionLists;
export const MAX_TRANSACTION_LIST_URL_LENGTH = 128 * 1024;

export class TransactionListError extends Error {
  constructor(
    public readonly field: TransactionListField,
    message: string,
  ) {
    super(`${field}: ${message}`);
    this.name = 'TransactionListError';
  }
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isAddress = (value: unknown): value is Hex =>
  typeof value === 'string' && /^0x[\da-fA-F]{40}$/.test(value);

const quantity = (value: unknown, bits: number, name: string): Hex => {
  if (
    typeof value !== 'string' ||
    !/^0x[\da-fA-F]+$/.test(value) ||
    value.length > 2 + Math.ceil(bits / 4) ||
    BigInt(value) >= 1n << BigInt(bits)
  ) {
    throw new TransactionListError(
      'authorizationList',
      `${name} must be a ${bits}-bit hex quantity`,
    );
  }
  return `0x${BigInt(value).toString(16)}`;
};

/** Validate EVM lists and normalize quantities without changing list order. */
export const normalizeTransactionLists = ({
  accessList,
  authorizationList,
  to,
}: {
  accessList?: unknown;
  authorizationList?: unknown;
  to?: unknown;
}): TransactionLists => {
  const result: TransactionLists = {};
  if (accessList !== undefined) {
    if (!Array.isArray(accessList)) {
      throw new TransactionListError('accessList', 'must be an array');
    }
    result.accessList = accessList.map(entry => {
      if (
        !isObject(entry) ||
        !isAddress(entry.address) ||
        !Array.isArray(entry.storageKeys) ||
        !entry.storageKeys.every(
          key => typeof key === 'string' && /^0x[\da-fA-F]{64}$/.test(key),
        )
      ) {
        throw new TransactionListError(
          'accessList',
          'each entry requires an address and 32-byte storage keys',
        );
      }
      return { address: entry.address, storageKeys: [...entry.storageKeys] };
    });
  }
  if (authorizationList !== undefined) {
    if (!Array.isArray(authorizationList) || authorizationList.length === 0) {
      throw new TransactionListError(
        'authorizationList',
        'must be a non-empty array',
      );
    }
    if (!isAddress(to)) {
      throw new TransactionListError(
        'authorizationList',
        'requires a to address',
      );
    }
    result.authorizationList = authorizationList.map(entry => {
      if (!isObject(entry) || !isAddress(entry.address)) {
        throw new TransactionListError('authorizationList', 'invalid address');
      }
      return {
        address: entry.address,
        chainId: quantity(entry.chainId, 256, 'chainId'),
        nonce: quantity(entry.nonce, 64, 'nonce'),
        yParity: quantity(entry.yParity, 1, 'yParity'),
        r: quantity(entry.r, 256, 'r'),
        s: quantity(entry.s, 256, 's'),
      };
    });
  }
  return result;
};

/** URL values must each be a single JSON array, never repeated query keys. */
export const parseTransactionListsFromUrl = (
  params: Record<string, unknown>,
):
  | { ok: true; lists: TransactionLists }
  | { ok: false; field: TransactionListField } => {
  const parsed: Partial<Record<TransactionListField, unknown>> = {};
  for (const field of ['accessList', 'authorizationList'] as const) {
    const value = params[field];
    if (value === undefined) continue;
    if (
      typeof value !== 'string' ||
      value.length > MAX_TRANSACTION_LIST_URL_LENGTH
    ) {
      return { ok: false, field };
    }
    try {
      parsed[field] = JSON.parse(value);
    } catch {
      return { ok: false, field };
    }
  }
  try {
    return {
      ok: true,
      lists: normalizeTransactionLists({ ...parsed, to: params.to }),
    };
  } catch (error) {
    if (error instanceof TransactionListError) {
      return { ok: false, field: error.field };
    }
    throw error;
  }
};
