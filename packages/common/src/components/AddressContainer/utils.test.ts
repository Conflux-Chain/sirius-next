import { describe, expect, test } from 'vitest';
import { getAddressNameInfo, getPocketAlias } from './utils';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

describe('getPocketAlias', () => {
  test('returns null when address is not zero address', () => {
    expect(
      getPocketAlias({
        type: 'from',
        address: '0x1000000000000000000000000000000000000000',
        pocket: 'mint_or_burn',
      }),
    ).toBeNull();
  });

  test('returns mint and burn aliases for mint_or_burn pocket', () => {
    expect(
      getPocketAlias({
        type: 'from',
        address: ZERO_ADDRESS,
        pocket: 'mint_or_burn',
      }),
    ).toBe('System mint');
    expect(
      getPocketAlias({
        type: 'to',
        address: ZERO_ADDRESS,
        pocket: 'mint_or_burn',
      }),
    ).toBe('System burn');
  });

  test('returns gas payment alias for gas_payment pocket', () => {
    expect(
      getPocketAlias({
        type: 'from',
        address: ZERO_ADDRESS,
        pocket: 'gas_payment',
      }),
    ).toBe('System gas_payment');
  });

  test('returns null for unsupported pocket', () => {
    expect(
      getPocketAlias({
        type: 'from',
        address: ZERO_ADDRESS,
      }),
    ).toBeNull();
  });
});

describe('getAddressNameInfo', () => {
  test('returns null when nameMap or address is missing', () => {
    expect(getAddressNameInfo()).toBeNull();
    expect(getAddressNameInfo('0xabc')).toBeNull();
  });

  test('reads name info by exact address', () => {
    const address = '0xabc';
    const originInfo = {
      token: {
        name: 'Token Name',
        symbol: 'TT',
        decimals: 18,
        iconUrl: 'https://example.com/token.png',
      },
      contract: { name: 'Contract Name' },
      verification: { name: 'Verified Contract' },
      nameTag: { nameTag: 'Address Tag' },
      ens: { name: 'name.eth' },
      eSpace: { address: '0xdef' },
    };

    expect(
      getAddressNameInfo(address, { [address]: originInfo } as any),
    ).toEqual({
      tokenName: 'Token Name',
      tokenSymbol: 'TT',
      tokenDecimals: 18,
      tokenIconUrl: 'https://example.com/token.png',
      isContract: true,
      contractName: 'Contract Name',
      verify: true,
      verificationName: 'Verified Contract',
      nametag: 'Address Tag',
      ensName: 'name.eth',
      isEspaceAddress: true,
      alias: 'Token Name',
      originInfo,
    });
  });

  test('reads name info by lower-case address', () => {
    const originInfo = {
      contract: { name: 'Contract Name' },
    };

    expect(
      getAddressNameInfo('0xABC', {
        '0xabc': originInfo,
      } as any),
    ).toMatchObject({
      contractName: 'Contract Name',
      alias: 'Contract Name',
      isContract: true,
    });
  });

  test('prefers token name over contract name for alias', () => {
    expect(
      getAddressNameInfo('0xabc', {
        '0xabc': {
          token: { name: 'Token Name' },
          contract: { name: 'Contract Name' },
        },
      } as any),
    ).toMatchObject({
      alias: 'Token Name',
    });
  });
});
