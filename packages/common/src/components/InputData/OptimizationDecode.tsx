import React, { useEffect, useMemo, useState } from 'react';
import { reqContractAndToken } from '../../utils/request';
import { parseArgs } from './utils';
import _ from 'lodash';
import {
  ContractDetail,
  formatContractAndTokenInfoMap,
} from './ContractDetail';
import { Link } from '../Link';
import { Text } from '../Text';
import { FunctionName } from './FunctionName';
import { AddressLabel } from './AddressLabel';
import { convertCheckSum } from '../../utils/address';
import { cn } from 'src/utils';
import { AbiFunctionWithoutGas } from 'src/utils/hooks/useTxTrace';
import type { AbiParameter } from 'src/utils/sdk';

export const DecodedParameters = ({
  args,
  label,
  params,
  labelClassName,
  space,
}: {
  label: string;
  args?: readonly unknown[];
  params: readonly AbiParameter[];
  labelClassName?: string;
  space: 'evm' | 'core';
}) => {
  const [contractAndTokenInfo, setContractAndTokenInfo] = useState<
    ReturnType<typeof formatContractAndTokenInfoMap>
  >({});
  const addressType = space === 'core' ? 'base32' : 'hex';
  const data = useMemo(() => {
    if (!args) return {};
    const array = parseArgs(args, params);
    let object: Record<string, string> = {};
    params.forEach((item, index) => {
      object[item.name ?? `arg${index}`] = Array.isArray(array[index])
        ? JSON.stringify(array[index], null, 4)
        : String(array[index]);
    });
    return object;
  }, [args, params]);

  useEffect(() => {
    let addressList =
      args
        ?.map((t, i) => (params[i]?.type === 'address' ? (t as string) : false))
        .filter((t): t is string => !!t) ?? [];
    addressList = _.uniq(addressList);

    if (addressList.length) {
      reqContractAndToken(addressList)
        .then(data => {
          if (data.total) {
            setContractAndTokenInfo(
              formatContractAndTokenInfoMap(data.map, addressType),
            );
          }
        })
        .catch(e => {
          console.log('reqContractAndToken or process error: ', e);
        });
    }
  }, [args, params, addressType]);
  return params.length > 0 ? (
    <div className="flex min-h-32px">
      <div
        className={cn(
          'w-100px shrink-0 grow-0 text-14px lh-18px text-#6a737d pt-6px',
          labelClassName,
        )}
      >
        {label}
      </div>
      <div className="bg-#f7f7f8 w-full max-h-200px overflow-auto">
        {params.map((item, index) => {
          const argName = item.name ?? `arg${index}`;
          let value: React.ReactNode = data[argName];
          if (item.type === 'address' && value) {
            const address = value as string;
            const contractInfo = contractAndTokenInfo[address];

            value = (
              <>
                <Link href={`/address/${address}`}>
                  {convertCheckSum(address)}{' '}
                </Link>
                <ContractDetail info={contractInfo} addressType={addressType} />
                <AddressLabel address={address} />
              </>
            );
          }

          let type: React.ReactNode = item.type || 'unknown';
          if (/\(.*\)/.test(type as string)) {
            type = (
              <span className="flex items-center">
                <span className="mr-2px">tuple</span>
              </span>
            );
          }
          return (
            <div
              className={cn(
                'flex items-start min-h-32px border-b-1 border-b-solid border-b-#e8e9ea py-0.3571rem pr-0.3571rem pl-0 overflow-hidden',
                'lt-sm:flex-col lt-sm:items-center first:border-t-1 first:border-t-solid first:border-t-#e8e9ea',
              )}
              key={index}
            >
              <div className="ml-0.5rem text-14px text-#6a737d min-w-8px h-1.4286rem lh-1.4286rem shrink-0">
                {index}
              </div>
              <div className="ml-0.6rem border-1 border-solid border-[rgba(217,99,73,0.5)] rounded-10px text-12px lh-1.4286rem text-#d96349 shrink-0 w-5.7143rem text-center flex-center h-1.4286rem">
                <Text maxWidth={'70px'} hoverValue={item.type}>
                  {type}
                </Text>
              </div>
              <div className="ml-0.6rem text-14px h-1.4286rem lh-1.4286rem text-#e79d35 shrink-0">
                {argName}:
              </div>
              <div className="text-14px text-#25282d pl-0.3571rem">
                <pre className="-mb-0.2857rem text-1rem">{value}</pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
};

export const OptimizationDecode = ({
  input = '',
  decodedParams,
  abiItem,
  labelClassName,
  space,
}: {
  decodedParams: {
    args?: readonly unknown[];
    functionName: string;
  };
  abiItem: AbiFunctionWithoutGas;
  input: string;
  labelClassName?: string;
  space: 'evm' | 'core';
}) => {
  return (
    <div>
      <div className="flex min-h-32px">
        <div
          className={cn(
            'w-100px shrink-0 grow-0 text-14px lh-18px text-#6a737d pt-1px',
            labelClassName,
          )}
        >
          Function:{' '}
        </div>
        <div>
          <FunctionName abiItem={abiItem}></FunctionName>
        </div>
      </div>
      <div className="flex min-h-32px">
        <div
          className={cn(
            'w-100px shrink-0 grow-0 text-14px lh-18px text-#6a737d pt-1px',
            labelClassName,
          )}
        >
          MethodID:{' '}
        </div>
        <div>{input.slice(0, 10)}</div>
      </div>
      <DecodedParameters
        args={decodedParams.args}
        params={abiItem.inputs}
        label="Parameters:"
        labelClassName={labelClassName}
        space={space}
      />
    </div>
  );
};
