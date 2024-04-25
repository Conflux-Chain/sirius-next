import {
  formatAddress,
  isAddress,
  isBase32Address,
  isCfxHexAddress,
  isPosAddress,
  isSimplyBase32Address,
  isZeroAddress
} from "../chunk-DJPIYD4B.js";
import "../chunk-4M4NHTZH.js";
import "../chunk-ELZCOMBE.js";
import "../chunk-ADTPJ4V5.js";
import "../chunk-DE2BHFIR.js";

// src/utils/address.test.ts
describe("isCfxHexAddress", () => {
  test("ADMINE_CONTROL_HEX_ADDRESS", () => {
    expect(isCfxHexAddress("0x0888000000000000000000000000000000000000")).toBe(
      true
    );
  });
  test("SPONSOR_WHITELIST_CONTROL_HEX_ADDRESS", () => {
    expect(isCfxHexAddress("0x0888000000000000000000000000000000000001")).toBe(
      true
    );
  });
  test("STAKING_HEX_ADDRESS", () => {
    expect(isCfxHexAddress("0x0888000000000000000000000000000000000002")).toBe(
      true
    );
  });
  test("Faild STAKING_HEX_ADDRESS", () => {
    expect(isCfxHexAddress("0x0888000000000000000000000000000000000003")).toBe(
      false
    );
  });
  test("isUserHexAddress", () => {
    expect(isCfxHexAddress("0x1000000000000000000000000000000000000000")).toBe(
      true
    );
  });
  test("Faild isUserHexAddress", () => {
    expect(isCfxHexAddress("0x2000000000000000000000000000000000000000")).toBe(
      false
    );
  });
  test("isContractAddress", () => {
    expect(isCfxHexAddress("0x8000000000000000000000000000000000000000")).toBe(
      true
    );
  });
  test("Faild isContractAddress", () => {
    expect(isCfxHexAddress("0x9000000000000000000000000000000000000000")).toBe(
      false
    );
  });
  test("isNullHexAddress", () => {
    expect(isCfxHexAddress("0x0000000000000000000000000000000000000000")).toBe(
      true
    );
  });
  test("Faild isNullHexAddress", () => {
    expect(isCfxHexAddress("0x0")).toBe(false);
  });
  test("Faild isNullHexAddress", () => {
    expect(isCfxHexAddress("0")).toBe(false);
  });
  test("Faild isBase32Address", () => {
    expect(
      isCfxHexAddress("cfx:aaketjh9tkj5g2k4zx3kfvb9vkku8nr956n0en4fhe")
    ).toBe(false);
  });
  test("Faild isBase32Address", () => {
    expect(isCfxHexAddress("0xd1937ffd52e18ae3fcd64302ddbf3b04d712e846")).toBe(
      false
    );
  });
});
describe("isBase32Address", () => {
  test("isBase32Address", () => {
    expect(
      isBase32Address("cfx:aaketjh9tkj5g2k4zx3kfvb9vkku8nr956n0en4fhe")
    ).toBe(true);
  });
  test("isBase32Address", () => {
    expect(
      isBase32Address("cfxtest:aaprg5pk4ykdg3udrefh71s0yphg4dnvh61mgvfgda")
    ).toBe(true);
  });
  test("isBase32Addres", () => {
    expect(isBase32Address("0xd1937ffd52e18ae3fcd64302ddbf3b04d712e846")).toBe(
      false
    );
  });
});
describe("isPosAddress", () => {
  test("should return true for a valid PoS address", () => {
    const validAddress = "0x" + "a".repeat(64);
    expect(isPosAddress(validAddress)).toBe(true);
  });
  test("should return false for an address not starting with 0x", () => {
    const invalidAddress = "1x" + "a".repeat(64);
    expect(isPosAddress(invalidAddress)).toBe(false);
  });
  test("should return false for an address with incorrect length", () => {
    const tooLongAddress = "0x" + "a".repeat(65);
    const tooShortAddress = "0x" + "a".repeat(63);
    expect(isPosAddress(tooLongAddress)).toBe(false);
    expect(isPosAddress(tooShortAddress)).toBe(false);
  });
  test("should return false for an empty string", () => {
    expect(isPosAddress("")).toBe(false);
  });
  test("should return true for a string starting with 0x but containing non-hex characters", () => {
    const nonHexCharsAddress = "0x" + "g".repeat(64);
    expect(isPosAddress(nonHexCharsAddress)).toBe(true);
  });
});
describe("isZeroAddress", () => {
  test("returns true for known zero address", () => {
    const address = "0x0000000000000000000000000000000000000000";
    expect(isZeroAddress(address)).toBe(true);
  });
  test("returns false for non-zero address", () => {
    const address = "0x0000000000000000000000000000000000000001";
    expect(isZeroAddress(address)).toBe(false);
  });
});
describe("isSimplyBase32Address", () => {
  test("returns true for known zero address", () => {
    const address = "0x0000000000000000000000000000000000000000";
    expect(isSimplyBase32Address(address)).toBe(false);
  });
  test("returns false for eoa address", () => {
    const address = "cfxtest:aaprg5pk4ykdg3udrefh71s0yphg4dnvh61mgvfgda";
    expect(isSimplyBase32Address(address)).toBe(true);
  });
  test("returns false for contract address", () => {
    const address = "cfxtest:acgwa148z517jj15w9je5sdzn8p8j044kjrvjz92c1";
    expect(isSimplyBase32Address(address)).toBe(true);
  });
});
describe("isAddress", () => {
  test("returns true for valid Hex address", () => {
    const hexAddress = "0x14b2d3bc65e74dae1030eafd8ac30c533c976a9b";
    expect(isAddress(hexAddress)).toBe(true);
  });
  test("returns false for invalid Hex address with wrong characters", () => {
    const invalidHexAddress = "0x14b2d3bc65e74dae1030eafd8ac30c5ZZZc976a9b";
    expect(isAddress(invalidHexAddress)).toBe(false);
  });
  test("returns false for Hex address with incorrect length", () => {
    const shortHexAddress = "0x14b2d3";
    expect(isAddress(shortHexAddress)).toBe(false);
  });
  test("returns true for valid Base32 address", () => {
    const base32Address = "cfx:aakwuegj5hm6cjm4d4w0aw9ygcsex2xdmjtpyseezs";
    expect(isAddress(base32Address)).toBe(true);
  });
  test("returns false for invalid Base32 address with wrong characters", () => {
    const invalidBase32Address = "cfx:aakwuegj5hm6cjm4d4w0aw9ygcsex2xdmjtpyseez!";
    expect(isAddress(invalidBase32Address)).toBe(false);
  });
  test("returns false for Base32 address with incorrect length", () => {
    const shortBase32Address = "cfx:aakwue";
    expect(isAddress(shortBase32Address)).toBe(false);
  });
  test("returns false for empty string", () => {
    expect(isAddress("")).toBe(false);
  });
  test("returns false for string not starting with 0x or cfx:", () => {
    const randomString = "1x23456789abcdef";
    expect(isAddress(randomString)).toBe(false);
  });
});
describe("formatAddress", () => {
  test("returns true for valid Hex address", () => {
    const hexAddress = "cfx:aaketjh9tkj5g2k4zx3kfvb9vkku8nr956n0en4fhe";
    expect(formatAddress(hexAddress, "base32")).toBe(
      "cfx:aaketjh9tkj5g2k4zx3kfvb9vkku8nr956n0en4fhe"
    );
  });
  test("should return true if its a valid ethereum address type", () => {
    expect(
      formatAddress("0x45Cd08334aeedd8a06265B2Ae302E3597d8fAA28", "hex")
    ).toBe("0x45Cd08334aeedd8a06265B2Ae302E3597d8fAA28");
  });
  test("should return true if its a valid ethereum token", () => {
    expect(
      formatAddress("0x7d682e65efc5c13bf4e394b8f376c48e6bae0355", "hex")
    ).toBe("0x7d682e65efc5c13bf4e394b8f376c48e6bae0355");
  });
  test("should return true if its a valid contract address type", () => {
    expect(
      formatAddress("0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", "hex")
    ).toBe("0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984");
  });
  test("should return false when its a invalid address", () => {
    expect(
      formatAddress("0xC1912fEE45d61C87Cc5EA59DaE31190FFFFf232d", "hex")
    ).toBe("0xC1912fEE45d61C87Cc5EA59DaE31190FFFFf232d");
  });
  test("should return false when its a invalid address", () => {
    expect(
      formatAddress(
        "0x7d682e65efc5c13bf4e394b8f376c48e6bae0355".toLocaleUpperCase(),
        "hex"
      )
    ).toBe("0X7D682E65EFC5C13BF4E394B8F376C48E6BAE0355");
  });
  test("should return false when its a invalid address", () => {
    expect(formatAddress("0x0", "hex")).toBe("0x0");
  });
  test("decodes an address", () => {
    expect(
      formatAddress("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "hex")
    ).toBe("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY");
  });
  test("converts a publicKey (hex) as-is", () => {
    expect(formatAddress("0x01020304", "hex")).toBe("0x01020304");
  });
  test("decodes a 8-byte address", () => {
    expect(formatAddress("848Gh2GcGaZia", "hex")).toBe("848Gh2GcGaZia");
  });
});
//# sourceMappingURL=address.test.js.map