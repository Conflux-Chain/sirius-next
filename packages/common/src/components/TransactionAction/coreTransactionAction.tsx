import React, { useEffect, useCallback } from 'react';
import { formatBalance } from '../../utils';
import { Link } from '../Link';
import {
  decodeData,
  filterByTokenAddress,
} from '@cfx-kit/dapp-utils/dist/decode-action';
import { CoreAddressContainer } from '../AddressContainer/CoreAddressContainer';
import { reqNametag, reqContractAndToken } from '../../utils/request';
import { useNametagCacheStore } from '../../store';
import {
  TransactionActionProps,
  AddressNameTagContainerProps,
  MultiAction,
} from '@cfx-kit/dapp-utils/dist/decode-action';

import { TokenIcon, TokenName, TokenSymbol, TokenDecimals } from './constants';

const Token = (
  address: string,
  customInfo: any,
  tokenType: string,
  tokenExhibit: string[], // icon, name, symbol
) => {
  const customInfoToken = filterByTokenAddress(customInfo.token || {}, address);
  return customInfoToken && customInfoToken['token'] ? (
    <>
      {tokenExhibit.includes('icon') ? (
        customInfoToken['token']['iconUrl'] ? (
          <img
            className="w-[16px] h-[16px] mt-[2px]"
            src={customInfoToken['token']['iconUrl']}
            alt="icon"
          />
        ) : (
          <>
            <img
              className="w-[16px] h-[16px] mt-[2px]"
              src={TokenIcon}
              alt="icon"
            />
          </>
        )
      ) : (
        <></>
      )}
      {tokenExhibit.includes('name') ? (
        <Link href={`/address/${address}`}>
          {customInfoToken['token']['name'] ? (
            `${customInfoToken['token']['name']}`
          ) : (
            <div>{TokenName}</div>
          )}{' '}
        </Link>
      ) : (
        <></>
      )}
      {tokenExhibit.includes('symbol') ? (
        <Link href={`/address/${address}`}>
          {customInfoToken['token']['symbol']
            ? customInfoToken['token']['symbol']
            : TokenSymbol}{' '}
        </Link>
      ) : (
        <></>
      )}
    </>
  ) : (
    <>
      {tokenExhibit.includes('icon') && (
        <img
          className="w-[16px] h-[16px] mt-[2px]"
          src={TokenIcon}
          alt="icon"
        />
      )}
      {tokenExhibit.includes('name') && <div>{TokenName}</div>}
      {tokenExhibit.includes('symbol') && <div>({TokenSymbol})</div>}
    </>
  );
};

const AddressNameTagContainer: React.FC<AddressNameTagContainerProps> = ({
  value,
}) => {
  const { nametagCache, contractCache, setNametagCache, setContractCache } =
    useNametagCacheStore(state => ({
      nametagCache: state.nametagCache,
      contractCache: state.contractCache,
      setNametagCache: state.setNametagCache,
      setContractCache: state.setContractCache,
    }));

  const fetchContractAndToken = useCallback(
    async (address: string) => {
      try {
        const data = await reqContractAndToken([address]);
        if (data[address]) {
          setContractCache({ [address]: data[address] });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [setContractCache],
  );

  const fetchNameTag = useCallback(
    async (address: string) => {
      try {
        const data = await reqNametag([address]);
        if (data[address]) {
          setNametagCache({ [address]: data[address] });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [setNametagCache],
  );

  useEffect(() => {
    if (value && !contractCache[value]) {
      fetchContractAndToken(value);
    }

    if (value && !nametagCache[value]) {
      fetchNameTag(value);
    }
  }, [value, fetchContractAndToken, fetchNameTag, nametagCache, contractCache]);

  const nametagInfo = {
    [value]: {
      address: value,
      nametag: nametagCache[value]?.nameTag || '',
    },
  };

  return (
    <CoreAddressContainer
      value={value}
      alias={
        contractCache[value]?.contract?.name ||
        contractCache[value]?.token?.name
      }
      isFullNameTag={true}
      nametagInfo={nametagInfo}
    />
  );
};
const customUI: MultiAction = {
  ERC20_Transfer: ({ address, toAddress, value, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Transfer
        <div className="font-extrabold">
          {formatBalance(value, customInfo['decimals'] || TokenDecimals, true)}
        </div>{' '}
        {Token(address, customInfo, 'ERC20', ['icon', 'symbol'])} to{' '}
        <Link href={`/address/${toAddress}`}>
          <AddressNameTagContainer value={toAddress} />
        </Link>
      </div>
    );
  },
  ERC20_Approved: ({ address, toAddress, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Approved
        {Token(address, customInfo, 'ERC20', ['icon', 'symbol'])} for
        {toAddress && (
          <Link href={`/address/${toAddress}`}>
            <AddressNameTagContainer value={toAddress} />
          </Link>
        )}
      </div>
    );
  },
  ERC20_Revoked: ({ address, toAddress, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Revoked
        {Token(address, customInfo, 'ERC20', ['icon', 'symbol'])} from
        {toAddress && (
          <Link href={`/address/${toAddress}`}>
            <AddressNameTagContainer value={toAddress} />
          </Link>
        )}
      </div>
    );
  },
  ERC721_Mint: ({ value, address, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Mint <div className="font-extrabold">{value}</div> of{' '}
        {Token(address, customInfo, 'ERC721', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC721_Transfer: ({ value, address, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Transfer <div className="font-extrabold">{value}</div> of{' '}
        {Token(address, customInfo, 'ERC721', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC721_Burn: ({ value, address, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Burn <div className="font-extrabold">{value}</div> of{' '}
        {Token(address, customInfo, 'ERC721', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC721_SafeTransferFrom: ({ value, address, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Transfer <div className="font-extrabold">{value}</div> of{' '}
        {Token(address, customInfo, 'ERC721', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC721_Revoked: ({ address, toAddress, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Revoked {Token(address, customInfo, 'ERC721', ['icon', 'symbol'])}
        from
        {toAddress && (
          <Link href={`/address/${toAddress}`}>
            <AddressNameTagContainer value={toAddress} />
          </Link>
        )}
      </div>
    );
  },
  ERC721_Approved: ({ address, toAddress, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Approved {Token(address, customInfo, 'ERC721', ['icon', 'symbol'])}
        for
        {toAddress && (
          <Link href={`/address/${toAddress}`}>
            <AddressNameTagContainer value={toAddress} />
          </Link>
        )}
      </div>
    );
  },
  ERC1155_Approved: ({ address, toAddress, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Approved {Token(address, customInfo, 'ERC1155', ['icon', 'symbol'])}
        for
        {toAddress && (
          <Link href={`/address/${toAddress}`}>
            <AddressNameTagContainer value={toAddress} />
          </Link>
        )}
      </div>
    );
  },
  ERC1155_Revoked: ({ address, toAddress, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Revoked {Token(address, customInfo, 'ERC1155', ['icon', 'symbol'])}
        from
        {toAddress && (
          <Link href={`/address/${toAddress}`}>
            <AddressNameTagContainer value={toAddress} />
          </Link>
        )}
      </div>
    );
  },
  ERC1155_Mint: ({ value, address, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Mint <div className="font-extrabold">{value}</div> of{' '}
        {Token(address, customInfo, 'ERC1155', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC1155_SafeTransferFrom: ({ value, address, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Transfer <div className="font-extrabold">{value}</div> of{' '}
        {Token(address, customInfo, 'ERC1155', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC1155_Burn: ({ value, address, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Burn <div className="font-extrabold">{value}</div> of{' '}
        {Token(address, customInfo, 'ERC1155', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC1155_Transfer: ({ value, address, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Transfer <div className="font-extrabold">{value}</div> of{' '}
        {Token(address, customInfo, 'ERC1155', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC1155_SafeBatchTransferFrom: ({ value, address, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Transfer <div className="font-extrabold">{value}</div> of{' '}
        {Token(address, customInfo, 'ERC1155', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC1155_BatchBurn: ({ value, address, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Burn <div className="font-extrabold">{value}</div> of{' '}
        {Token(address, customInfo, 'ERC1155', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC1155_BatchMint: ({ value, address, customInfo }) => {
    return (
      <div className="flex flex-wrap content-center gap-[5px]">
        Mint <div className="font-extrabold">{value}</div> of{' '}
        {Token(address, customInfo, 'ERC1155', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
};

export const TransactionAction = ({
  transaction,
  event,
  customInfo,
}: TransactionActionProps) => {
  const res = decodeData(transaction, event, customInfo, customUI);

  if (res && res.content && res.content.length > 0) {
    return {
      show: true,
      content: (
        <div className="max-h-[119px] overflow-y-auto">
          {res.content.map((e: any, i) => {
            return <div key={i}>{e}</div>;
          })}
        </div>
      ),
    };
  }
  return {
    show: false,
    content: undefined,
  };
};
