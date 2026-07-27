import useSWRImmutable from 'swr/immutable';
import { fetchWithPrefix } from '../request';
import { formatABI, generateRandomId } from '..';
import {
  isCreateCall,
  isDelegateCall,
  isStaticCall,
  ProxyType,
  TreeTraceForUI,
} from './useTxTrace';
import { AddressNameMap } from '../request.types';
import { AbiFunctionWithoutGas, estimateGas, Space } from '../sdk';
import { formatAddress } from '../address';
import BigNumber from 'bignumber.js';

export interface SimulateLog {
  address: string;
  topics: string[];
  data: string;
  transactionLogIndex?: number;
}

interface SimulateTraceCall {
  from: string;
  to: string;
  gas: string;
  gasUsed: string;
  input: `0x${string}`;
  output?: `0x${string}`;
  value: string;
  type: string;
  error?: string;
  calls?: SimulateTraceCall[];
  isCallImpl?: boolean;
  logs?: SimulateLog[];
}

export interface SimulateTraceResponse {
  traceCall: SimulateTraceCall;
  addressArray: string[];
  authMap?: Record<string, string>;
  proxyMap?: Record<string, ProxyType>;
  methodMap?: Record<string, Record<string, string>>;
  nameMap?: Record<string, AddressNameMap>;
}

export interface SimulateTraceTxParams {
  from?: string;
  to?: string;
  value?: string;
  data?: string;
  gas?: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  // simulate trace not support core space now
  space: Exclude<Space, 'core'>;
}

export interface SimulateTraceConfig {
  // other tracer has different response, not support now
  // | '4byteTracer'
  // | 'prestateTracer'
  // | 'flatCallTracer'
  // | 'muxTracer'
  // | 'erc7562Tracer';
  tracer: 'callTracer';
  tracerConfig?: {
    disableStorage?: boolean;
    disableStack?: boolean;
    enableMemory?: boolean;
    enableReturnData?: boolean;
    onlyTopCall?: boolean;
    withLog?: boolean;
    timeout?: number;
  };
}

const formatSimulateTraceData = (
  data: SimulateTraceResponse,
  space: 'evm' | 'core',
) => {
  const addressType = space === 'core' ? 'base32' : 'hex';
  const proxyMap = data.proxyMap || {};
  const methodMap = data.methodMap || {};
  const nameMap = data.nameMap || {};
  const authMap = data.authMap || {};

  let total = 0;
  const logs: SimulateLog[] = [];

  const formatList = (
    t: SimulateTraceCall[],
    parent?: TreeTraceForUI,
  ): TreeTraceForUI[] => {
    total += t.length;
    return t.map((item, index) => formatItem(item, index, parent, t));
  };
  const formatItem = (
    t: SimulateTraceCall,
    index: number,
    parent: TreeTraceForUI | undefined,
    list: SimulateTraceCall[],
  ): TreeTraceForUI => {
    if (t.logs) {
      logs.push(...t.logs);
    }
    const type = t.type?.toLowerCase();
    const isContractCreated = isCreateCall(type);
    const methodId = t.input?.slice(0, 10);
    const from = formatAddress(t.from, addressType);
    const to = !isContractCreated
      ? formatAddress(t.to, addressType)
      : undefined;
    const delegatedTo = to && authMap[to];
    let method = methodId;
    let abi: AbiFunctionWithoutGas[] | undefined = undefined;
    const methodABI =
      methodId && (delegatedTo || to)
        ? methodMap[methodId]?.[delegatedTo || to]
        : undefined;
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

    const item: TreeTraceForUI = {
      index: `${parent?.index ? `${parent.index}_` : ''}${index}`,
      type: type,
      from: from,
      to: to,
      input: t.input,
      value: t.value,
      gas: t.gas ? new BigNumber(t.gas).toString() : undefined,
      gasUsed: t.gasUsed ? new BigNumber(t.gasUsed).toString() : undefined,
      output: t.output,
      outcome: !t.error
        ? 'success'
        : t.error === 'Reverted'
          ? 'reverted'
          : 'fail',
      method,
      abi,
      contractCreated: isContractCreated ? t.to : undefined,
      nameMap,
      delegatedTo,
      isCallImpl: t.isCallImpl,
    };
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
        isDelegateCall(type)
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
        isStaticCall(type) &&
        second &&
        second.to &&
        second.from === parent.to &&
        isDelegateCall(second.type)
      ) {
        parent.proxy = {
          type: 'BeaconProxy',
          beaconAddress: to,
          implAddress: second.to,
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
  const list = formatList([data.traceCall]);
  return {
    total,
    list,
    // TODO: use real log index, and sort
    logs: logs.map((item, index) => ({ ...item, transactionLogIndex: index })),
  };
};
export const querySimulateTrace = async (
  tx: SimulateTraceTxParams,
  tag = 'latest',
  params: SimulateTraceConfig = {
    tracer: 'callTracer',
    tracerConfig: {
      onlyTopCall: false,
    },
  },
) => {
  const url = `/traceCallView`;

  const { space, ...simulateTx } = tx;

  if (!simulateTx.gas) {
    try {
      const gasLimit = await estimateGas({
        account: simulateTx.from,
        to: simulateTx.to,
        value: simulateTx.value,
        data: simulateTx.data as `0x${string}`,
        space,
      });
      simulateTx.gas = `0x${gasLimit.toString(16)}`;
    } catch (error) {
      console.log('estimate gas failed:', error);
    }
  }
  if (!simulateTx.maxFeePerGas && !simulateTx.gasPrice) {
    simulateTx.maxFeePerGas = '0x51f4d5c00'; // 22 Gdrip
  }

  const data = JSON.stringify({
    id: generateRandomId(),
    jsonrpc: '2.0',
    method: 'debug_traceCall',
    params: [simulateTx, tag, params],
  });
  return fetchWithPrefix<SimulateTraceResponse>(url, {
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const useSimulateTrace = (
  simulateTx: SimulateTraceTxParams,
  tag = 'latest',
  params: SimulateTraceConfig = {
    tracer: 'callTracer',
    tracerConfig: {
      onlyTopCall: false,
      withLog: true,
    },
  },
) => {
  let key = null;
  if (simulateTx.from) {
    key = JSON.stringify([simulateTx, tag, params]);
  }

  return useSWRImmutable(key, () =>
    querySimulateTrace(simulateTx, tag, params).then(resp => {
      if (resp?.traceCall) {
        return formatSimulateTraceData(resp, simulateTx.space);
      }
    }),
  );
};
