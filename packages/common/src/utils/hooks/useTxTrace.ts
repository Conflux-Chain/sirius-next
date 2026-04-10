import useSWRImmutable from 'swr/immutable';
import { fetchWithPrefix } from 'src/utils/request';
import { publishRequestError } from '../pubsub';
import type { AbiFunctionWithoutGas } from 'src/utils/sdk';
import { formatABI } from '..';
import { formatAddress } from '../address';
import { Pocket } from '../request.types';

export interface TraceAction {
  createType: string;
  callType: string;
  from: string;
  to?: string;
  input?: `0x${string}`;
  value: string;
  gas?: string;
  space: string;

  // ↓↓↓↓↓↓↓↓ only for core space ↓↓↓↓↓↓↓↓
  fromPocket?: Pocket;
  toPocket?: Pocket;
  fromSpace?: 'evm' | 'none' | 'native';
  toSpace?: 'evm' | 'none' | 'native';
}
export interface TraceResult {
  addr?: string;
  gasLeft: string;
  outcome: 'success' | 'fail' | 'reverted';
  returnData: `0x${string}`;
}

interface ContractInfo {
  address: string;
  isVirtual: boolean;
  verify: {
    result: number;
  };
}
interface TokenInfo {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  tokenType: string;
}

interface NameTagInfo {
  nameTag: string;
  website?: string;
  desc?: string;
  labels?: string[];
  caution?: number;
}

export interface OriginTreeTrace {
  calls: OriginTreeTrace[];
  action: TraceAction;
  result?: TraceResult;
  blockHash: string;
  epochHash: string;
  epochNumber: number;
  transactionHash: string;
  transactionPosition: number;
  type: string;
  valid: boolean;
  // added by frontend
  isCallImpl?: boolean;
}

export type ProxyType = 'BeaconProxy' | 'Proxy';

export interface OriginTraceData {
  addressArray: string[];
  contractMap: Record<string, ContractInfo>;
  tokenMap: Record<string, TokenInfo>;
  proxyMap: Record<string, ProxyType>;
  methodMap: Record<string, Record<string, string>>;
  ensMap: Record<
    string,
    {
      name?: string;
    }
  >;
  nameTagMap: Record<string, NameTagInfo>;
  traceTree: OriginTreeTrace[];
}

export interface ListTraceForUI {
  index: string;
  type: string;
  from: string;
  to?: string;
  value: string;
  input?: `0x${string}`;
  result?: TraceResult;
  gas?: string;
  isProxyCall?: boolean;
  method?: string;
  contractCreated?: string;
  abi?: AbiFunctionWithoutGas[];
  fromContractInfo: ContractInfo | {};
  toContractInfo: ContractInfo | {};
  fromTokenInfo: TokenInfo | {};
  toTokenInfo: TokenInfo | {};
  fromNameTagInfo?: NameTagInfo;
  toNameTagInfo?: NameTagInfo;
  fromENSInfo?: {
    name?: string;
  };
  toENSInfo?: {
    name?: string;
  };
  proxy?: {
    type: ProxyType;
    beaconAddress?: string;
    implAddress: string;
  };
  isCallBeacon?: boolean;
  isCallImpl?: boolean;
  // only for core space ↓↓↓↓↓↓↓↓
  toESpaceInfo?: {
    address?: string;
  };
  fromESpaceInfo?: {
    address?: string;
  };
  fromPocket?: Pocket;
  toPocket?: Pocket;
}

export interface TreeTraceForUI extends ListTraceForUI {
  calls?: TreeTraceForUI[];
}

const formatTraceData = (data: OriginTraceData, space: 'evm' | 'core') => {
  const addressType = space === 'core' ? 'base32' : 'hex';
  const contractInfo = data.contractMap || {};
  const tokenInfo = data.tokenMap || {};
  const proxyMap = data.proxyMap || {};
  const nameTagMap = data.nameTagMap || {};
  const ensMap = data.ensMap || {};
  const methodMap = data.methodMap || {};

  let total = 0;

  const formatList = (
    t: OriginTreeTrace[],
    parent?: TreeTraceForUI,
  ): TreeTraceForUI[] => {
    total += t.length;
    return t.map((item, index) => formatItem(item, index, parent, t));
  };
  const formatItem = (
    t: OriginTreeTrace,
    index: number,
    parent: TreeTraceForUI | undefined,
    list: OriginTreeTrace[],
  ): TreeTraceForUI => {
    const methodId = t.action.input?.slice(0, 10);
    const from = formatAddress(t.action.from, addressType);
    const to = formatAddress(t.action.to, addressType);
    let method = methodId;
    let abi: AbiFunctionWithoutGas[] | undefined = undefined;
    const methodABI = methodId && to ? methodMap[methodId]?.[to] : undefined;
    if (methodABI) {
      try {
        const result = formatABI(`["${methodABI}"]`, {
          json: true,
          allowEmpty: true,
        });
        abi = JSON.parse(result) as AbiFunctionWithoutGas[];
        const jsonABI = abi[0];
        method = jsonABI?.name || methodId;
      } catch (error) {
        console.log('parse method abi error: ', methodABI, error);
      }
    }

    const isContractCreated = !!t.action.createType;

    const item: TreeTraceForUI = {
      index: `${parent?.index ? `${parent.index}_` : ''}${index}`,
      type: `${t.action.callType || t.type}`,
      from: from,
      to: to,
      input: t.action.input,
      value: t.action.value,
      result: t.result,
      gas: t.action.gas,
      method,
      abi,
      contractCreated: isContractCreated ? t.result?.addr : undefined,
      fromContractInfo: contractInfo[from] || {},
      toContractInfo: contractInfo[to ?? ''] || {},
      fromTokenInfo: tokenInfo[from] || {},
      toTokenInfo: tokenInfo[to ?? ''] || {},
      fromNameTagInfo: nameTagMap[from],
      toNameTagInfo: nameTagMap[to ?? ''],
      fromENSInfo: ensMap[from],
      toENSInfo: ensMap[to ?? ''],
      isCallImpl: t.isCallImpl,
      fromPocket: t.action.fromPocket,
      toPocket: t.action.toPocket,
    };
    if (t.action.fromSpace === 'evm') {
      item.fromESpaceInfo = {
        address: formatAddress(from, 'hex'),
      };
    }
    if (t.action.toSpace === 'evm') {
      item.toESpaceInfo = {
        address: formatAddress(to, 'hex'),
      };
    }
    if (
      parent &&
      parent.to &&
      proxyMap[parent.to] &&
      from === parent.to &&
      to
    ) {
      // proxy call
      if (
        index === 0 &&
        proxyMap[parent.to] === 'Proxy' &&
        t.action.callType === 'delegatecall'
      ) {
        parent.proxy = {
          type: 'Proxy',
          implAddress: to,
        };
        item.isCallImpl = true;
      }
      // beacon proxy call
      const second = list[1];
      if (
        index === 0 &&
        proxyMap[parent.to] === 'BeaconProxy' &&
        t.action.callType === 'staticcall' &&
        second &&
        second.action.to &&
        second.action.from === parent.to &&
        second.action.callType === 'delegatecall'
      ) {
        parent.proxy = {
          type: 'BeaconProxy',
          beaconAddress: to,
          implAddress: second.action.to,
        };
        item.isCallBeacon = true;
        second.isCallImpl = true;
      }
    }
    if (t.calls) {
      item.calls = formatList(t.calls, item);
    }
    return item;
  };
  const list = formatList(data.traceTree);
  return {
    total,
    list,
  };
};

export const treeTraceToList = (
  data: TreeTraceForUI[],
  showProxyCall = false,
) => {
  const result: ListTraceForUI[] = [];
  const handler = (list: TreeTraceForUI[]) => {
    list.forEach(item => {
      if (showProxyCall || (!item.isCallBeacon && !item.isCallImpl)) {
        result.push(item);
      }
      if (item.calls) {
        handler(item.calls);
      }
    });
  };
  handler(data);
  return result;
};

export const hideProxyCallInTreeTrace = (data: TreeTraceForUI[]) => {
  const handler = (list: TreeTraceForUI[]) => {
    const result: TreeTraceForUI[] = [];
    list.forEach(item => {
      const newTrace = { ...item };
      if (!newTrace.isCallBeacon && !newTrace.isCallImpl) {
        result.push(newTrace);
        if (newTrace.calls) {
          newTrace.calls = handler(newTrace.calls);
        }
      } else if (newTrace.calls) {
        result.push(...handler(newTrace.calls));
      }
    });
    return result;
  };
  return handler(data);
};

export const useTxTrace = (hash: string, space: 'evm' | 'core') => {
  const url = `/transferTree/${hash}`;

  return useSWRImmutable([url, space], () =>
    fetchWithPrefix(url)
      .then((resp: any) => {
        if (resp?.traceTree) {
          const { list, total } = formatTraceData(resp, space);
          return { list, total };
        }
      })
      .catch(e => {
        publishRequestError({ code: 60002, message: e.message }, 'code');
      }),
  );
};
