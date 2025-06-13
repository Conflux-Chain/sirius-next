import SDK from 'js-conflux-sdk';
import { gzip } from 'pako';
import { parseString } from './index';

type AnyFunction = (...args: any[]) => any;

// fix js-conflux-sdk types
const SDKFormat: (
  schema: Record<string, unknown> | Record<string, unknown>[],
  options?: {
    pick?: boolean;
    strict?: boolean;
  },
) => AnyFunction = SDK.format;
const SDKContract: new (
  {
    abi,
    address,
    bytecode,
    decodeByteToHex,
  }: {
    abi: any[];
    address?: string;
    bytecode?: string;
    decodeByteToHex?: boolean;
  },
  conflux?: any,
) => SDK.Contract = SDK.Contract;

const zipContractAndToken = SDKFormat(
  {
    address: SDK.format.hexAddress, // cip-37
    name: SDK.format.bytes.$before(parseString).$or(undefined),
    website: SDK.format.bytes.$before(parseString).$or(undefined),
    abi: SDK.format.bytes
      .$before(parseString)
      .$parse(JSON.stringify, Array.isArray)
      .$after(gzip)
      .$or(undefined),
    sourceCode: SDK.format.bytes
      .$before(parseString)
      .$after(gzip)
      .$or(undefined),
    optimizeRuns: SDK.format.uInt.$after(String).$or(undefined),
    icon: SDK.format.bytes.$before(parseString).$after(gzip).$or(undefined),
    tokenIcon: SDK.format.bytes
      .$before(parseString)
      .$after(gzip)
      .$or(undefined),
    tokenWebsite: SDK.format.bytes.$before(parseString).$or(undefined),
    ipfsGateway: SDK.format.bytes.$before(parseString).$or(undefined),
  },
  { pick: true, strict: true },
);

const formatAnnounceArray = SDKFormat([
  {
    key: SDK.format.bytes.$before(parseString),
    value: SDK.format.bytes.$before(parseString),
  },
]);

const announcement = new SDKContract({
  abi: [
    {
      type: 'function',
      name: 'announce',
      inputs: [
        {
          type: 'tuple[]',
          components: [
            { name: 'key', type: 'bytes' },
            { name: 'value', type: 'bytes' },
          ],
        },
      ],
      outputs: [{ name: 'count', type: 'uint256' }],
    },
  ],
});

function chunk(array: { key: string; value: string }[], maxSize = 150 * 1000) {
  const groupArray: { key: string; value: string }[][] = [];

  let group: { key: string; value: string }[] = [];
  let groupSize = 0;
  array.forEach(({ key, value }) => {
    const size = key.length + value.length;
    if (size > maxSize) {
      throw new Error(
        `key "${key}" and data size ${size} > maximum bytes ${maxSize}`,
      );
    }

    if (groupSize + size > maxSize) {
      groupArray.push(group);
      group = [];
      groupSize = 0;
    }

    group.push({ key, value });
    groupSize += size;
  });
  groupArray.push(group);

  return groupArray;
}
/**
 * Format, zip, split and encode contract&token register information as Announcement transaction data
 *
 * @param options {object}
 * @param options.address {string} - contract address hex
 * @param [options.name] {string} - contract name
 * @param [options.website] {string}
 * @param [options.abi] {object} - contract abi json or array object (will be gzip)
 * @param [options.sourceCode] {string} - contract source code (will be gzip)
 * @param [options.optimizeRuns] {number} - contract code compile optimize runs times
 * @param [options.icon] {Buffer} - contract icon bytes (will be gzip)
 * @param [options.tokenIcon] {Buffer} - token icon bytes (will be gzip)
 * @param [options.tokenWebsite] {string}
 * @param [options.ipfsGateway] {string}
 * @return {string[]} encoded transaction data, spilt by max transaction size
 *
 * @example
 * > packContractAndToken({
    address: '0x01234567890123456789012345678901A3456789',
    name: 'MiniERC20',
    abi: [
      {
        type: 'function',
        name: 'decimals',
        inputs: [],
        outputs: [{ type: 'uint8' }],
      },
    ],
    optimizeRuns: 10,
    icon: Buffer.from([1, 2, 3, 4, 5]),
    tokenIcon: Buffer.from([1, 2, 3, 4, 5]),
  })
 [
 '0xcf7bb3090000...'
 ]
 */
export function packContractAndToken(options: {
  address: string;
  name?: string;
  website?: string;
  abi?: object;
  sourceCode?: string;
  optimizeRuns?: number;
  icon?: string;
  tokenIcon?: string;
  tokenWebsite?: string;
  ipfsGateway?: string;
}): string[] {
  const { address, tokenIcon, tokenWebsite, ipfsGateway, ...object } =
    zipContractAndToken(options);
  const array = [{ key: `contract/list/${address}`, value: address }];
  Object.entries(object).forEach(([field, value]) => {
    array.push({ key: `contract/${address}/${field}`, value });
  });
  // push token info
  array.push({ key: `token/list/${address}`, value: address });
  array.push({ key: `token/${address}/icon`, value: tokenIcon });
  array.push({ key: `token/${address}/website`, value: tokenWebsite });
  array.push({ key: `token/${address}/ipfsGateway`, value: ipfsGateway });

  const announceArray = formatAnnounceArray(array);
  return chunk(announceArray).map(
    group => (announcement as any).announce(group).data,
  );
}

const zipContractABI = SDKFormat(
  {
    abi: SDK.format.bytes
      .$before(parseString)
      .$parse(JSON.stringify, Array.isArray),
  },
  { pick: true, strict: true },
);

/**
 * Format, zip, split and encode contract abi as Announcement transaction data
 *
 * @param options {object}
 * @param options.abi {string[]} - contract abi array object
 * @return {string[]} encoded transaction data, spilt by max transaction size
 *
 * @example
 * > packContractAbi({
    abi: ["function transfer(address, uint256)", "event Transfer(address indexed from, address indexed to, address value)"],
  })
 [
 '0xcf7bb3090000...'
 ]
 */
export function packContractABI(options: { abi?: string[] }): string[] {
  const { abi } = zipContractABI(options);
  const array = [{ key: `contract/abi`, value: abi }];
  const announceArray = formatAnnounceArray(array);
  return chunk(announceArray).map(
    group => (announcement as any).announce(group).data,
  );
}
