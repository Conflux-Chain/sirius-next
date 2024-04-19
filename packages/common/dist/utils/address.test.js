import {
  isCfxHexAddress
} from "../chunk-GBJNYZWL.js";
import "../chunk-PIWYBVLY.js";
import "../chunk-W4ZISPJS.js";
import "../chunk-4LQWWDGW.js";
import "../chunk-ADTPJ4V5.js";

// src/utils/address.test.ts
describe("isCfxHexAddress", () => {
  test("isCfxHexAddress:(cfxtest:aaprg5pk4ykdg3udrefh71s0yphg4dnvh61mgvfgda)", () => {
    expect(isCfxHexAddress("cfxtest:aaprg5pk4ykdg3udrefh71s0yphg4dnvh61mgvfgda")).toBe(true);
  });
  test("isCfxHexAddress:(0xd1937ffd52e18ae3fcd64302ddbf3b04d712e846)", () => {
    expect(isCfxHexAddress("0xd1937ffd52e18ae3fcd64302ddbf3b04d712e846")).toBe(true);
  });
});
//# sourceMappingURL=address.test.js.map