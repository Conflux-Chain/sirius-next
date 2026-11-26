import type { Space } from './types';

export const eventLogPageSize = 20;

export interface EventLogCursor {
  blockNumber: string;
  logIndex: string;
}

export interface EventLogPage<Log> {
  logs: Log[];
  nextCursor?: EventLogCursor;
}

function scanAdapter<From extends string, To extends string>(
  method: 'eth_scanLogs' | 'cfx_scanLogs',
  from: From,
  to: To,
  latest: 'latest' | 'latest_state',
) {
  const fields = [from, to, 'topic0'] as const;
  type Field = (typeof fields)[number];
  type Values = Partial<Record<Field, string>>;
  type ErrorCode = 'invalidHeight' | 'reversedRange' | 'invalidTopic0';

  function read(query: Record<string, unknown>) {
    const values = {} as Record<Field, string>;
    for (const field of fields) {
      const raw = query[field];
      // Preserve repeated URL parameters as one editable, invalid value.
      const value = Array.isArray(raw) ? raw.join(',') : String(raw ?? '');
      values[field] = field === 'topic0' ? value.trim() : value;
    }
    return values;
  }

  function validate(values: Values) {
    const errors: Partial<Record<Field, ErrorCode>> = {};
    const lower = values[from];
    const upper = values[to];
    if (lower && !/^\d+$/.test(lower)) errors[from] = 'invalidHeight';
    if (upper && !/^\d+$/.test(upper)) errors[to] = 'invalidHeight';
    if (
      lower &&
      upper &&
      !errors[from] &&
      !errors[to] &&
      BigInt(lower) > BigInt(upper)
    ) {
      errors[to] = 'reversedRange';
    }
    if (values.topic0 && !/^0x[\da-fA-F]{64}$/.test(values.topic0)) {
      errors.topic0 = 'invalidTopic0';
    }
    return errors;
  }

  function request(address: string, values: Values, cursor?: EventLogCursor) {
    if (!address || Object.keys(validate(values)).length) return null;
    const upper = values[to];
    const range = {
      [from]: `0x${BigInt(values[from] || '0').toString(16)}`,
      [to]: upper ? `0x${BigInt(upper).toString(16)}` : latest,
    } as Record<From | To, string>;
    return {
      filter: {
        address,
        ...range,
        ...(values.topic0 && { topic0: values.topic0 }),
      },
      limit: eventLogPageSize,
      reverse: true,
      ...(cursor && { cursor }),
    };
  }

  return { method, fields, read, validate, request };
}

export const eventLogScan = {
  evm: scanAdapter('eth_scanLogs', 'fromBlock', 'toBlock', 'latest'),
  core: scanAdapter('cfx_scanLogs', 'fromEpoch', 'toEpoch', 'latest_state'),
};

export type EventLogRequest = NonNullable<
  ReturnType<(typeof eventLogScan)[Space]['request']>
>;
