import { deflateRaw, Inflate } from 'pako';
import type { Hex } from './types';

export const MAX_CALLDATA_BYTES = 1024 * 1024;
export const CALLDATA_URL_PASSTHROUGH_MAX_BYTES = 256;
export const MAX_BASE64URL_PAYLOAD_LENGTH = Math.ceil(
  (MAX_CALLDATA_BYTES * 4) / 3,
);
export const MAX_DEFLATE_BYTES = MAX_CALLDATA_BYTES + 1024;
export const MAX_DEFLATE_PAYLOAD_LENGTH = Math.ceil(
  (MAX_DEFLATE_BYTES * 4) / 3,
);

export const BASE64URL_PATTERN = /^[A-Za-z0-9_-]*$/;
export const HEX_PATTERN = /^0x(?:[0-9a-fA-F]{2})*$/;
export const BASE64URL_PREFIX = 'b1.';
export const DEFLATE_PREFIX = 'd1.';
const BINARY_STRING_CHUNK_SIZE = 0x8000;
const EMPTY_CALLDATA: Hex = '0x';

export type CalldataCodec = 'hex' | 'base64url' | 'deflate';
export type CalldataDecodeError = 'missing' | 'invalid-format' | 'too-large';

export type CalldataDecodeResult =
  | {
      ok: true;
      data: Hex;
      codec: CalldataCodec;
    }
  | {
      ok: false;
      error: CalldataDecodeError;
      codec?: CalldataCodec;
    };

export interface DecodeCalldataFromUrlOptions {
  /** Treat a missing, null, or blank URL value as canonical empty calldata. */
  allowEmptyData?: boolean;
}

export const hexToBytes = (hex: string): Uint8Array => {
  const bytes = new Uint8Array((hex.length - 2) / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2 + 2, index * 2 + 4), 16);
  }
  return bytes;
};

export const bytesToHex = (bytes: Uint8Array): Hex => {
  let hex = '0x';
  for (let index = 0; index < bytes.length; index += 1) {
    hex += bytes[index]!.toString(16).padStart(2, '0');
  }
  return hex as Hex;
};

export const bytesToBase64Url = (bytes: Uint8Array): string => {
  let binary = '';
  for (
    let offset = 0;
    offset < bytes.length;
    offset += BINARY_STRING_CHUNK_SIZE
  ) {
    binary += String.fromCharCode(
      ...bytes.subarray(offset, offset + BINARY_STRING_CHUNK_SIZE),
    );
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

export const base64UrlToBytes = (value: string): Uint8Array | undefined => {
  if (!BASE64URL_PATTERN.test(value) || value.length % 4 === 1) {
    return undefined;
  }

  const paddingLength = (4 - (value.length % 4)) % 4;
  const base64 = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(value.length + paddingLength, '=');

  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytesToBase64Url(bytes) === value ? bytes : undefined;
  } catch {
    return undefined;
  }
};

export const concatBytes = (
  chunks: Uint8Array[],
  length: number,
): Uint8Array => {
  const bytes = new Uint8Array(length);
  let offset = 0;
  chunks.forEach(chunk => {
    bytes.set(chunk, offset);
    offset += chunk.length;
  });
  return bytes;
};

export const encodeCalldataForUrl = (
  data: Hex | '' = EMPTY_CALLDATA,
): string => {
  const calldata = data === '' ? EMPTY_CALLDATA : data;
  if (!HEX_PATTERN.test(calldata)) {
    throw new TypeError(
      'Calldata must be an even-length 0x-prefixed hex value.',
    );
  }

  if ((calldata.length - 2) / 2 > MAX_CALLDATA_BYTES) {
    throw new RangeError('Calldata exceeds the 1 MiB limit.');
  }
  const bytes = hexToBytes(calldata);

  const hexCandidate = calldata.toLowerCase();
  if (bytes.length <= CALLDATA_URL_PASSTHROUGH_MAX_BYTES) {
    return hexCandidate;
  }

  const candidates = [
    hexCandidate,
    `${BASE64URL_PREFIX}${bytesToBase64Url(bytes)}`,
    `${DEFLATE_PREFIX}${bytesToBase64Url(
      deflateRaw(bytes, {
        level: 9,
      }),
    )}`,
  ];

  return candidates.reduce((shortest, candidate) =>
    candidate.length < shortest.length ? candidate : shortest,
  );
};

const INFLATE_CHUNK_SIZE = 64 * 1024;
const OUTPUT_LIMIT_EXCEEDED = {};
type InflateWithInputState = Inflate & {
  strm: {
    avail_in: number;
  };
};

const inflateRawWithLimit = (
  compressed: Uint8Array,
): Uint8Array | 'invalid-format' | 'too-large' => {
  const chunks: Uint8Array[] = [];
  let outputLength = 0;
  let inflateStatus: number | undefined;
  const inflater = new Inflate({
    raw: true,
    chunkSize: INFLATE_CHUNK_SIZE,
  }) as InflateWithInputState;

  inflater.onEnd = status => {
    inflateStatus = status;
  };

  inflater.onData = (chunk: Uint8Array) => {
    outputLength += chunk.length;
    if (outputLength > MAX_CALLDATA_BYTES) {
      throw OUTPUT_LIMIT_EXCEEDED;
    }
    chunks.push(chunk);
  };

  try {
    inflater.push(compressed, true);
  } catch (error) {
    return error === OUTPUT_LIMIT_EXCEEDED ? 'too-large' : 'invalid-format';
  }

  if (inflateStatus !== 0 || inflater.strm.avail_in !== 0) {
    return 'invalid-format';
  }

  return concatBytes(chunks, outputLength);
};

export const decodeCalldataFromUrl = (
  value?: string | null,
  { allowEmptyData = true }: DecodeCalldataFromUrlOptions = {},
): CalldataDecodeResult => {
  if (value === undefined || value === null || value === '') {
    if (allowEmptyData) {
      return {
        ok: true,
        data: EMPTY_CALLDATA,
        codec: 'hex',
      };
    }
    return {
      ok: false,
      error: 'missing',
    };
  }

  if (value.startsWith('0x')) {
    if (!HEX_PATTERN.test(value)) {
      return {
        ok: false,
        error: 'invalid-format',
        codec: 'hex',
      };
    }
    if ((value.length - 2) / 2 > MAX_CALLDATA_BYTES) {
      return {
        ok: false,
        error: 'too-large',
        codec: 'hex',
      };
    }
    return {
      ok: true,
      data: value.toLowerCase() as Hex,
      codec: 'hex',
    };
  }

  if (value.startsWith(BASE64URL_PREFIX)) {
    const payload = value.slice(BASE64URL_PREFIX.length);
    if (payload.length > MAX_BASE64URL_PAYLOAD_LENGTH) {
      return {
        ok: false,
        error: 'too-large',
        codec: 'base64url',
      };
    }
    const bytes = base64UrlToBytes(payload);
    if (!bytes) {
      return {
        ok: false,
        error: 'invalid-format',
        codec: 'base64url',
      };
    }
    if (bytes.length > MAX_CALLDATA_BYTES) {
      return {
        ok: false,
        error: 'too-large',
        codec: 'base64url',
      };
    }
    return {
      ok: true,
      data: bytesToHex(bytes),
      codec: 'base64url',
    };
  }

  if (value.startsWith(DEFLATE_PREFIX)) {
    const payload = value.slice(DEFLATE_PREFIX.length);
    if (payload.length > MAX_DEFLATE_PAYLOAD_LENGTH) {
      return {
        ok: false,
        error: 'too-large',
        codec: 'deflate',
      };
    }
    const compressed = base64UrlToBytes(payload);
    if (!compressed) {
      return {
        ok: false,
        error: 'invalid-format',
        codec: 'deflate',
      };
    }
    if (compressed.length > MAX_DEFLATE_BYTES) {
      return {
        ok: false,
        error: 'too-large',
        codec: 'deflate',
      };
    }

    const bytes = inflateRawWithLimit(compressed);
    if (typeof bytes === 'string') {
      return {
        ok: false,
        error: bytes,
        codec: 'deflate',
      };
    }
    return {
      ok: true,
      data: bytesToHex(bytes),
      codec: 'deflate',
    };
  }

  return {
    ok: false,
    error: 'invalid-format',
  };
};
