import { deflateRaw } from 'pako';
import { describe, expect, it } from 'vitest';
import {
  CALLDATA_URL_PASSTHROUGH_MAX_BYTES,
  decodeCalldataFromUrl,
  encodeCalldataForUrl,
  MAX_BASE64URL_PAYLOAD_LENGTH,
  MAX_CALLDATA_BYTES,
  MAX_DEFLATE_PAYLOAD_LENGTH,
} from './calldataUrl';
import encodingVectors from './test/fixtures/calldataUrlEncoding.json';
import type { Hex } from './types';

const bytesToHex = (bytes: Uint8Array): Hex =>
  `0x${Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')}` as Hex;

const bytesToBase64Url = (bytes: Uint8Array): string => {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

const createPseudoRandomBytes = (length: number): Uint8Array => {
  const bytes = new Uint8Array(length);
  let state = 0x12345678;
  for (let index = 0; index < length; index += 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    bytes[index] = state & 0xff;
  }
  return bytes;
};

const buildGeneratedCalldata = ({
  generation,
}: {
  generation: {
    byteHex?: string;
    repeat?: number;
    pattern?: string;
    byteLength?: number;
  };
}): Hex => {
  if (generation.byteHex !== undefined && generation.repeat !== undefined) {
    return `0x${generation.byteHex.repeat(generation.repeat)}` as Hex;
  }

  if (
    generation.pattern === 'sequential-byte-cycle' &&
    generation.byteLength !== undefined
  ) {
    return bytesToHex(
      Uint8Array.from(
        { length: generation.byteLength },
        (_value, index) => index & 0xff,
      ),
    );
  }

  throw new TypeError('Unsupported calldata test vector generation.');
};

describe('calldata URL encoding', () => {
  it.each(
    encodingVectors.exactEncodingVectors.map(vector => [vector.id, vector]),
  )('matches the portable vector %s', (_id, { input, expectedOutput }) => {
    expect(encodeCalldataForUrl(input as Hex)).toBe(expectedOutput);
  });

  it.each(
    encodingVectors.base64ReferenceVectors.map(vector => [vector.id, vector]),
  )(
    'matches the Base64URL reference vector %s',
    (_id, { generation, expectedOutput }) => {
      const input = buildGeneratedCalldata({ generation });
      const encoded = encodeCalldataForUrl(input);

      expect(encoded).toBe(expectedOutput);
      expect(decodeCalldataFromUrl(encoded)).toEqual({
        ok: true,
        data: input,
        codec: 'base64url',
      });
    },
  );

  it.each(
    encodingVectors.deflateReferenceVectors.map(vector => [vector.id, vector]),
  )(
    'matches the Pako DEFLATE reference vector %s',
    (_id, { generation, pakoReferenceOutput }) => {
      const input = buildGeneratedCalldata({ generation });
      const encoded = encodeCalldataForUrl(input);

      expect(encoded).toBe(pakoReferenceOutput);
      expect(decodeCalldataFromUrl(encoded)).toEqual({
        ok: true,
        data: input,
        codec: 'deflate',
      });
    },
  );

  it.each(
    encodingVectors.invalidInputVectors.map(vector => [vector.id, vector]),
  )('rejects the portable invalid input vector %s', (_id, { input }) => {
    expect(() => encodeCalldataForUrl(input as Hex)).toThrow(TypeError);
  });

  it.each([
    '0x',
    '0x12345678',
    '0xa9059cbb000000000000000000000000112233445566778899001122334455667788990000000000000000000000000000000000000000000000000000000000000001',
  ] as Hex[])('round trips %s', calldata => {
    const decoded = decodeCalldataFromUrl(encodeCalldataForUrl(calldata));

    expect(decoded).toEqual({
      ok: true,
      data: calldata.toLowerCase(),
      codec: decoded.ok ? decoded.codec : undefined,
    });
  });

  it('decodes legacy calldata and normalizes its casing', () => {
    expect(decodeCalldataFromUrl('0xAABBCCDD')).toEqual({
      ok: true,
      data: '0xaabbccdd',
      codec: 'hex',
    });
  });

  it('uses deflate for highly compressible calldata', () => {
    const calldata = bytesToHex(new Uint8Array(4096));
    const encoded = encodeCalldataForUrl(calldata);

    expect(encoded.startsWith('d1.')).toBe(true);
    expect(encoded).not.toMatch(/[+/=]/);
    expect(decodeCalldataFromUrl(encoded)).toEqual({
      ok: true,
      data: calldata,
      codec: 'deflate',
    });
  });

  it('uses raw Base64URL for incompressible calldata', () => {
    const calldata = bytesToHex(createPseudoRandomBytes(4096));
    const encoded = encodeCalldataForUrl(calldata);

    expect(encoded.startsWith('b1.')).toBe(true);
    expect(encoded).not.toMatch(/[+/=]/);
    expect(decodeCalldataFromUrl(encoded)).toEqual({
      ok: true,
      data: calldata,
      codec: 'base64url',
    });
  });

  it.each([
    ['an omitted value', undefined],
    ['an empty string', ''],
    ['empty calldata', '0x'],
  ] as const)('encodes %s as empty calldata', (_name, calldata) => {
    expect(encodeCalldataForUrl(calldata)).toBe('0x');
  });

  it('passes through selector calldata', () => {
    expect(encodeCalldataForUrl('0x12345678')).toBe('0x12345678');
  });

  it('passes through calldata at the 256-byte threshold', () => {
    const calldata = bytesToHex(
      new Uint8Array(CALLDATA_URL_PASSTHROUGH_MAX_BYTES),
    );

    expect(encodeCalldataForUrl(calldata)).toBe(calldata);
  });

  it('starts adaptive encoding above the 256-byte threshold', () => {
    const calldata = bytesToHex(
      new Uint8Array(CALLDATA_URL_PASSTHROUGH_MAX_BYTES + 1),
    );

    expect(encodeCalldataForUrl(calldata)).toBe('d1.Y2AY4QAA');
  });

  it.each([
    ['odd-length hex', '0x123', 'invalid-format'],
    ['unknown version', 'd2.AA', 'invalid-format'],
    ['padded Base64URL', 'b1.AA==', 'invalid-format'],
    ['invalid Base64URL', 'b1.A', 'invalid-format'],
    ['non-canonical Base64URL', 'b1.AB', 'invalid-format'],
    ['damaged deflate stream', 'd1.AAAA', 'invalid-format'],
  ])('rejects %s', (_name, encoded, error) => {
    expect(decodeCalldataFromUrl(encoded)).toMatchObject({
      ok: false,
      error,
    });
  });

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['an empty string', ''],
  ] as const)('decodes %s as empty calldata by default', (_name, value) => {
    expect(decodeCalldataFromUrl(value)).toEqual({
      ok: true,
      data: '0x',
      codec: 'hex',
    });
  });

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['an empty string', ''],
  ] as const)(
    'reports %s as missing when empty data is disallowed',
    (_name, value) => {
      expect(
        decodeCalldataFromUrl(value, {
          allowEmptyData: false,
        }),
      ).toEqual({
        ok: false,
        error: 'missing',
      });
    },
  );

  it('accepts canonical empty calldata when blank input is disallowed', () => {
    expect(
      decodeCalldataFromUrl('0x', {
        allowEmptyData: false,
      }),
    ).toEqual({
      ok: true,
      data: '0x',
      codec: 'hex',
    });
  });

  it('rejects a truncated deflate stream', () => {
    const compressed = deflateRaw(new Uint8Array(4096), {
      level: 9,
    });
    const encoded = `d1.${bytesToBase64Url(
      compressed.subarray(0, compressed.length - 1),
    )}`;

    expect(decodeCalldataFromUrl(encoded)).toEqual({
      ok: false,
      error: 'invalid-format',
      codec: 'deflate',
    });
  });

  it('rejects trailing bytes after a deflate stream', () => {
    const compressed = deflateRaw(Uint8Array.from([1, 2, 3]), {
      level: 9,
    });
    const withTrailingByte = new Uint8Array(compressed.length + 1);
    withTrailingByte.set(compressed);
    withTrailingByte[compressed.length] = 0;

    expect(
      decodeCalldataFromUrl(`d1.${bytesToBase64Url(withTrailingByte)}`),
    ).toEqual({
      ok: false,
      error: 'invalid-format',
      codec: 'deflate',
    });
  });

  it('accepts calldata exactly at the 1 MiB limit', () => {
    const vector = encodingVectors.generatedBoundaryVectors.find(
      item => item.id === 'exactly-one-mib',
    );
    expect(vector).toBeDefined();
    const calldata = buildGeneratedCalldata(vector!);
    const decoded = decodeCalldataFromUrl(encodeCalldataForUrl(calldata));

    expect(decoded.ok).toBe(true);
    if (decoded.ok) {
      expect((decoded.data.length - 2) / 2).toBe(
        vector!.expectedDecodedByteLength,
      );
      expect(decoded.codec).toBe(vector!.expectedCodec);
    }
  });

  it('stops inflating calldata above the 1 MiB limit', () => {
    const compressed = deflateRaw(new Uint8Array(MAX_CALLDATA_BYTES + 1), {
      level: 9,
    });
    const encoded = `d1.${bytesToBase64Url(compressed)}`;

    expect(decodeCalldataFromUrl(encoded)).toEqual({
      ok: false,
      error: 'too-large',
      codec: 'deflate',
    });
  });

  it('rejects oversized encoded payloads before decoding', () => {
    expect(
      decodeCalldataFromUrl(
        `b1.${'A'.repeat(MAX_BASE64URL_PAYLOAD_LENGTH + 1)}`,
      ),
    ).toEqual({
      ok: false,
      error: 'too-large',
      codec: 'base64url',
    });
    expect(
      decodeCalldataFromUrl(`d1.${'A'.repeat(MAX_DEFLATE_PAYLOAD_LENGTH + 1)}`),
    ).toEqual({
      ok: false,
      error: 'too-large',
      codec: 'deflate',
    });
  });

  it('rejects oversized legacy calldata and encoder input', () => {
    const vector = encodingVectors.generatedBoundaryVectors.find(
      item => item.id === 'one-byte-over-limit',
    );
    expect(vector).toBeDefined();
    const oversized = buildGeneratedCalldata(vector!);

    expect(decodeCalldataFromUrl(oversized)).toEqual({
      ok: false,
      error: 'too-large',
      codec: 'hex',
    });
    expect(() => encodeCalldataForUrl(oversized)).toThrow(RangeError);
  });
});
