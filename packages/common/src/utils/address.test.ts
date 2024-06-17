import {
  isZeroAddress,
  formatAddress,
  isCoreMainOrTestAddress,
  isCoreMainnetAddress,
  isCoreTestnetAddress,
  isCoreOtherNetAddress,
  isEvmAddress,
  isCoreAddress,
  isCoreUserAddress,
  isCoreContractAddress,
  isInnerContractAddress,
  isSpecialAddress,
} from './address';
import { test, expect, describe } from 'vitest';

describe('isCoreMainOrTestAddress', () => {
  test('returns true for mainnet address', () => {
    const address = 'cfx:aan3c22hwy6cg4y0ez1uah6szt3r34884a8ae0v137';
    expect(isCoreMainOrTestAddress(address)).toBe(true);
  });
  test('returns true for testnet address', () => {
    const address = 'cfxtest:aan3c22hwy6cg4y0ez1uah6szt3r34884ayn1g1771';
    expect(isCoreMainOrTestAddress(address)).toBe(true);
  });

  test('returns false for net address', () => {
    const address = 'net1999:aan3c22hwy6cg4y0ez1uah6szt3r34884amezdeh6t';
    expect(isCoreMainOrTestAddress(address)).toBe(false);
  });
  test('returns false for hex address', () => {
    const address = '0x179163079538236a96256f001f8eabf2dcebded0';
    expect(isCoreMainOrTestAddress(address)).toBe(false);
  });
});
describe('isCoreMainnetAddress', () => {
  test('returns true for mainnet address', () => {
    const address = 'cfx:aan3c22hwy6cg4y0ez1uah6szt3r34884a8ae0v137';
    expect(isCoreMainnetAddress(address)).toBe(true);
  });

  test('returns false for testnet address', () => {
    const address = 'cfxtest:aan3c22hwy6cg4y0ez1uah6szt3r34884ayn1g1771';
    expect(isCoreMainnetAddress(address)).toBe(false);
  });
  test('returns false for net address', () => {
    const address = 'net1999:aan3c22hwy6cg4y0ez1uah6szt3r34884amezdeh6t';
    expect(isCoreMainOrTestAddress(address)).toBe(false);
  });
  test('returns false for hex address', () => {
    const address = '0x179163079538236a96256f001f8eabf2dcebded0';
    expect(isCoreMainnetAddress(address)).toBe(false);
  });
});
describe('isCoreTestnetAddress', () => {
  test('returns true for testnet address', () => {
    const address = 'cfxtest:aan3c22hwy6cg4y0ez1uah6szt3r34884ayn1g1771';
    expect(isCoreTestnetAddress(address)).toBe(true);
  });

  test('returns false for mainnet address', () => {
    const address = 'cfx:aan3c22hwy6cg4y0ez1uah6szt3r34884a8ae0v137';
    expect(isCoreTestnetAddress(address)).toBe(false);
  });
  test('returns false for net address', () => {
    const address = 'net1999:aan3c22hwy6cg4y0ez1uah6szt3r34884amezdeh6t';
    expect(isCoreMainOrTestAddress(address)).toBe(false);
  });
  test('returns false for hex address', () => {
    const address = '0x179163079538236a96256f001f8eabf2dcebded0';
    expect(isCoreTestnetAddress(address)).toBe(false);
  });
});
describe('isCoreOtherNetAddress', () => {
  test('returns true for net address', () => {
    const address = 'net1999:aan3c22hwy6cg4y0ez1uah6szt3r34884amezdeh6t';
    expect(isCoreOtherNetAddress(address)).toBe(true);
  });

  test('returns false for mainnet address', () => {
    const address = 'cfx:aan3c22hwy6cg4y0ez1uah6szt3r34884a8ae0v137';
    expect(isCoreOtherNetAddress(address)).toBe(false);
  });
  test('returns false for testnet address', () => {
    const address = 'cfxtest:aan3c22hwy6cg4y0ez1uah6szt3r34884ayn1g1771';
    expect(isCoreOtherNetAddress(address)).toBe(false);
  });
  test('returns false for hex address', () => {
    const address = '0x179163079538236a96256f001f8eabf2dcebded0';
    expect(isCoreOtherNetAddress(address)).toBe(false);
  });
});

describe('isEvmAddress', () => {
  test('returns true for hex address', () => {
    const address = '0x179163079538236a96256f001f8eabf2dcebded0';
    expect(isEvmAddress(address)).toBe(true);
  });
  test('returns true for zero address', () => {
    const address = '0x0000000000000000000000000000000000000000';
    expect(isEvmAddress(address)).toBe(true);
  });
  test('returns true for 0x0', () => {
    const address = '0x0';
    expect(isEvmAddress(address)).toBe(true);
  });
  test('returns true for net address', () => {
    const address = 'net1999:aan3c22hwy6cg4y0ez1uah6szt3r34884amezdeh6t';
    expect(isEvmAddress(address)).toBe(true);
  });
  test('returns true for mainnet address', () => {
    const address = 'cfx:aan3c22hwy6cg4y0ez1uah6szt3r34884a8ae0v137';
    expect(isEvmAddress(address)).toBe(true);
  });
  test('returns true for testnet address', () => {
    const address = 'cfxtest:aan3c22hwy6cg4y0ez1uah6szt3r34884ayn1g1771';
    expect(isEvmAddress(address)).toBe(true);
  });

  test('returns false for other string', () => {
    const address = '0x179163079538236';
    expect(isEvmAddress(address)).toBe(false);
  });
});
describe('isCoreAddress', () => {
  test('returns true for zero address', () => {
    const address = '0x0000000000000000000000000000000000000000';
    expect(isCoreAddress(address)).toBe(true);
  });
  test('returns true for 0x0', () => {
    const address = '0x0';
    expect(isCoreAddress(address)).toBe(true);
  });
  test('returns true for mainnet address', () => {
    const address = 'cfx:aan3c22hwy6cg4y0ez1uah6szt3r34884a8ae0v137';
    expect(isCoreAddress(address)).toBe(true);
  });
  test('returns true for testnet address', () => {
    const address = 'cfxtest:aan3c22hwy6cg4y0ez1uah6szt3r34884ayn1g1771';
    expect(isCoreAddress(address)).toBe(true);
  });
  test('returns true for net address', () => {
    const address = 'net1999:aan3c22hwy6cg4y0ez1uah6szt3r34884amezdeh6t';
    expect(isCoreAddress(address)).toBe(true);
  });
  test('returns true for core hex address', () => {
    const address = '0x179163079538236a96256f001f8eabf2dcebded0';
    expect(isCoreAddress(address)).toBe(true);
  });

  test('returns false for 0x2 hex address', () => {
    const address = '0x279163079538236a96256f001f8eabf2dcebded0';
    expect(isCoreAddress(address)).toBe(false);
  });
  test('returns false for other string', () => {
    const address = 'cfx:aan3c22hwy6cg4y0ez1uah6szt3r34884a8ae0v136';
    expect(isCoreAddress(address)).toBe(false);
  });
});

describe('isCoreUserAddress', () => {
  test('returns true for user address', () => {
    const address = 'cfx:aan3c22hwy6cg4y0ez1uah6szt3r34884a8ae0v137';
    expect(isCoreUserAddress(address)).toBe(true);
  });

  test('returns false for contract address', () => {
    const address = 'cfx:achc8nxj7r451c223m18w2dwjnmhkd6rxawrvkvsy2';
    expect(isCoreUserAddress(address)).toBe(false);
  });
});
describe('isCoreContractAddress', () => {
  test('returns true for contract address', () => {
    const address = 'cfx:achc8nxj7r451c223m18w2dwjnmhkd6rxawrvkvsy2';
    expect(isCoreContractAddress(address)).toBe(true);
  });

  test('returns false for user address', () => {
    const address = 'cfx:aan3c22hwy6cg4y0ez1uah6szt3r34884a8ae0v137';
    expect(isCoreContractAddress(address)).toBe(false);
  });
});
describe('isInnerContractAddress', () => {
  test('returns true for inner address', () => {
    const address = 'cfx:aaejuaaaaaaaaaaaaaaaaaaaaaaaaaaaa2sn102vjv';
    expect(isInnerContractAddress(address)).toBe(true);
  });

  test('returns false for user address', () => {
    const address = 'cfx:aan3c22hwy6cg4y0ez1uah6szt3r34884a8ae0v137';
    expect(isInnerContractAddress(address)).toBe(false);
  });
});
describe('isSpecialAddress', () => {
  test('returns true for address that startsWith 0x0 and not inner address', () => {
    const address = '0x079163079538236a96256f001f8eabf2dcebded0';
    expect(isSpecialAddress(address)).toBe(true);
  });

  test('returns false for user address', () => {
    const address = '0x179163079538236a96256f001f8eabf2dcebded0';
    expect(isSpecialAddress(address)).toBe(false);
  });
});

describe('isZeroAddress', () => {
  test('returns true for known zero address', () => {
    const address = '0x0000000000000000000000000000000000000000';
    expect(isZeroAddress(address)).toBe(true);
  });

  test('returns false for non-zero address', () => {
    const address = '0x0000000000000000000000000000000000000001';
    expect(isZeroAddress(address)).toBe(false);
  });
});

describe('formatAddress', () => {
  test('returns true for valid Hex address', () => {
    const hexAddress = 'cfx:aaketjh9tkj5g2k4zx3kfvb9vkku8nr956n0en4fhe';
    expect(formatAddress(hexAddress, 'base32')).toBe(
      'cfx:aaketjh9tkj5g2k4zx3kfvb9vkku8nr956n0en4fhe',
    );
  });

  test('should return true if its a valid ethereum address type', () => {
    expect(
      formatAddress('0x45Cd08334aeedd8a06265B2Ae302E3597d8fAA28', 'hex'),
    ).toBe('0x45Cd08334aeedd8a06265B2Ae302E3597d8fAA28');
  });

  test('should return true if its a valid ethereum token', () => {
    expect(
      formatAddress('0x7d682e65efc5c13bf4e394b8f376c48e6bae0355', 'hex'),
    ).toBe('0x7d682e65efc5c13bf4e394b8f376c48e6bae0355');
  });

  test('should return true if its a valid contract address type', () => {
    expect(
      formatAddress('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', 'hex'),
    ).toBe('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984');
  });

  test('should return false when its a invalid address', () => {
    expect(
      formatAddress('0xC1912fEE45d61C87Cc5EA59DaE31190FFFFf232d', 'hex'),
    ).toBe('0xC1912fEE45d61C87Cc5EA59DaE31190FFFFf232d');
  });

  test('should return false when its a invalid address', () => {
    expect(
      formatAddress(
        '0x7d682e65efc5c13bf4e394b8f376c48e6bae0355'.toLocaleUpperCase(),
        'hex',
      ),
    ).toBe('0X7D682E65EFC5C13BF4E394B8F376C48E6BAE0355');
  });

  test('should return false when its a invalid address', () => {
    expect(formatAddress('0x0', 'hex')).toBe('0x0');
  });

  test('decodes an address', () => {
    expect(
      formatAddress('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', 'hex'),
    ).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
  });

  test('converts a publicKey (hex) as-is', () => {
    expect(formatAddress('0x01020304', 'hex')).toBe('0x01020304');
  });

  test('decodes a 8-byte address', () => {
    expect(formatAddress('848Gh2GcGaZia', 'hex')).toBe('848Gh2GcGaZia');
  });
});
