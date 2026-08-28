# `encodeCalldataForUrl` 实现规范

本文档定义当前 `sirius-next` 公共包生成 calldata URL 参数时遵守的协议。其他前端、后端、CLI 或语言实现可以依照本规范生成与当前解码器兼容的 `data` 值。

使用方式和页面接入顺序见 [Calldata URL 编码与解码](./calldata-url.md)。

## 当前参考实现

- 编码和解码：
  `packages/common/src/utils/calldataUrl.ts`
- Hex 类型：`packages/common/src/utils/types.ts`
- Vitest：
  `packages/common/src/utils/calldataUrl.test.ts`
- 测试向量：
  `packages/common/src/utils/test/fixtures/calldataUrlEncoding.json`
- Pako 版本：`2.0.2`

当前实现把原来拆分的通用工具、编码器和解码器集中在一个模块中。文件组织变化不影响本文定义的编码格式。

## 方法约定

逻辑接口：

```text
encodeCalldataForUrl(calldata) -> encodedData
```

输入要求：

- 参数省略或为空字符串时，当前 TypeScript 实现将其规范化为 `0x`
- ASCII 字符串
- 必须以小写 `0x` 开头
- `0x` 后只能包含 `0-9`、`a-f`、`A-F`
- Hex 字符数必须为偶数
- `0x` 表示空 calldata
- 解码后的长度不能超过 1,048,576 字节

输出一定是以下格式之一：

- 小写 `0x...`
- `b1.<Base64URL>`
- `d1.<Base64URL>`

方法只返回 `data` 查询参数的值，不包含 `data=`、URL、`to` 或 `value`。

错误行为：

- 格式错误时抛出 `TypeError`
- 超过 1 MiB 时抛出 `RangeError`
- 不截断、补零或尝试修复输入

## 常量

当前参考实现使用：

```text
MAX_CALLDATA_BYTES = 1,048,576
CALLDATA_URL_PASSTHROUGH_MAX_BYTES = 256
BASE64URL_PREFIX = "b1."
DEFLATE_PREFIX = "d1."
DEFLATE_LEVEL = 9
```

阈值比较的是 Hex 解码后的原始字节数，不是 Hex 字符数、UTF-8 长度或完整 URL 长度。

## 规范性编码算法

### 1. 规范化并校验输入

当前 TypeScript API 为调用方提供空值便利处理：

```text
undefined -> "0x"
""        -> "0x"
```

规范化后，输入必须匹配：

```regex
^0x(?:[0-9a-fA-F]{2})*$
```

校验必须在 Hex 解码前完成，避免底层 Hex API 忽略非法字符或奇数位。

### 2. Hex 转字节

移除 `0x`，每两个 Hex 字符转换为一个无符号字节：

```text
0x12345678 -> [0x12, 0x34, 0x56, 0x78]
```

如果字节数超过 1,048,576，编码失败。

同时生成规范化 Hex：

```text
hexCandidate = lowercase(calldata)
```

### 3. 处理透传阈值

当原始字节数不超过 256 时，必须立即返回 `hexCandidate`。

即使 Base64URL 或 DEFLATE 更短，也不能在此分支中计算或选择其他格式。例如：

```text
0x000102 -> 0x000102
```

### 4. 构造 Base64URL 候选

超过 256 字节后，对原始字节编码：

```text
base64Candidate = "b1." + base64urlWithoutPadding(rawBytes)
```

Base64URL 必须遵守：

- 标准 Base64 的 `+` 替换为 `-`
- `/` 替换为 `_`
- 移除末尾所有 `=`
- 不对 Hex 文本本身编码

### 5. 构造 DEFLATE 候选

使用压缩等级 9 的 RFC 1951 raw DEFLATE：

```text
compressed = rawDeflate(rawBytes, level = 9)
deflateCandidate = "d1." + base64urlWithoutPadding(compressed)
```

`d1.` payload 不包含：

- RFC 1950 zlib header
- Adler-32 trailer
- gzip header
- CRC32 和 gzip trailer

不同 DEFLATE 实现可能产生不同但可以正确解压的字节流。协议要求可通过 raw DEFLATE 还原原始字节；只有在使用 Pako 2.0.2 时才要求与当前参考 payload 完全相同。

### 6. 选择最短候选

按固定顺序比较完整字符串：

```text
1. hexCandidate
2. base64Candidate
3. deflateCandidate
```

只在新候选严格更短时替换：

```text
best = hexCandidate

if length(base64Candidate) < length(best):
    best = base64Candidate

if length(deflateCandidate) < length(best):
    best = deflateCandidate

return best
```

不能使用 `<=`。长度相同时，保留顺序更早的格式。

## 完整伪代码

```text
function encodeCalldataForUrl(calldata):
    if calldata is undefined or calldata == "":
        calldata = "0x"

    if calldata does not match /^0x(?:[0-9a-fA-F]{2})*$/:
        fail INVALID_FORMAT

    rawBytes = decodeHex(calldata after "0x")

    if length(rawBytes) > 1_048_576:
        fail TOO_LARGE

    hexCandidate = lowercase(calldata)

    if length(rawBytes) <= 256:
        return hexCandidate

    base64Candidate =
        "b1." + base64urlWithoutPadding(rawBytes)

    compressed =
        rawDeflate(rawBytes, compressionLevel = 9)

    deflateCandidate =
        "d1." + base64urlWithoutPadding(compressed)

    candidates = [
        hexCandidate,
        base64Candidate,
        deflateCandidate
    ]

    best = candidates[0]
    for candidate in candidates starting at index 1:
        if length(candidate) < length(best):
            best = candidate

    return best
```

## 解码兼容要求

虽然本文主要定义编码器，兼容实现应了解当前解码器的严格规则：

- `undefined`、`null` 和 `""` 默认解码为空 calldata `0x`
- 设置 `{ allowEmptyData: false }` 后，上述输入返回 `missing`
- 规范形式 `0x` 始终是有效的空 calldata，不受 `allowEmptyData` 影响
- `0x`：必须是合法、偶数位 Hex
- `b1.`：必须是无 padding 的规范 Base64URL
- `d1.`：必须是无 padding 的规范 Base64URL，并包含完整 raw DEFLATE 流
- 未知前缀返回 `invalid-format`
- 不会在一种格式失败后回退到其他格式
- 最终 calldata 不能超过 1 MiB

当前解码器对 Base64URL 解码结果重新编码并与原值比较，以拒绝非规范表示。

raw DEFLATE 采用 64 KiB 输出块。累计输出超过 1 MiB 时立即返回 `too-large`。只有 Pako `onEnd` 被调用且状态为 `0` 时才接受结果，因此损坏和截断的流都会返回 `invalid-format`。

## 写入 URL

当前公共模块只返回编码后的 `data` 值。调用方应通过标准 URL API 写入查询参数：

```ts
const url = new URL('/simulate-trace', origin);
url.searchParams.set('data', encodeCalldataForUrl(data));
url.searchParams.set('to', to);
```

应通过标准 URL API 设置 `data`，不要手工拼接或再次 Base64 编码。

当前实际页面消费者是同一工作区中的 `sirius-eth`：Simulate 页面调用
`decodeCalldataFromUrl`，Contract ABI 方法入口调用 `encodeCalldataForUrl`。
`sirius` Core Space scan 以及本仓库的 `apps/core`、`apps/evm` 目前尚未调用
这些 API。这里的“已接入”仅表示 eSpace scan 页面已消费公共能力，不表示页面部署
已经迁移到 `sirius-next`。

## 不同平台的 raw DEFLATE 配置

| 平台或库                    | 等价配置                                                                                     |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| JavaScript Pako             | `deflateRaw(bytes, { level: 9 })`                                                            |
| Node.js zlib                | `deflateRawSync(bytes, { level: 9 })`                                                        |
| Python zlib                 | `zlib.compressobj(level=9, wbits=-zlib.MAX_WBITS)`                                           |
| Go                          | `compress/flate.NewWriter(output, flate.BestCompression)`                                    |
| Java                        | `new Deflater(9, true)`                                                                      |
| Browser `CompressionStream` | 使用 `"deflate-raw"`；无法设置 level，可能不会生成与 Pako 完全相同的 payload，但解压格式兼容 |

如果无法确认一个库的 `deflate` 是否为 raw DEFLATE，应使用已知输入验证它能否被 raw DEFLATE 解码器还原。

## 参考向量

JSON fixture 包含五组数据：

| 分组                       | 验收方式                                             |
| -------------------------- | ---------------------------------------------------- |
| `exactEncodingVectors`     | 小输入必须与 `expectedOutput` 完全相等               |
| `base64ReferenceVectors`   | Base64URL 输出必须与 `expectedOutput` 完全相等       |
| `deflateReferenceVectors`  | Pako 2.0.2 输出必须与 `pakoReferenceOutput` 完全相等 |
| `invalidInputVectors`      | 编码必须抛出 `TypeError`                             |
| `generatedBoundaryVectors` | 验证 256/257 字节、恰好 1 MiB 和超过 1 MiB           |

关键参考值：

```text
256 个 0x00 字节 -> 完整小写 Hex
257 个 0x00 字节 -> d1.Y2AY4QAA
257 个顺序字节   -> b1.<fixture 中的 expectedOutput>
```

当前 Vitest 在参考向量之外还覆盖：

- 编解码往返
- 编码器省略值和空字符串的规范化
- 解码器默认空值处理与 `allowEmptyData: false`
- 历史 Hex 链接
- 高压缩率和低压缩率数据
- 非法或非规范 Base64URL
- 损坏和截断 DEFLATE
- 解压炸弹和编码 payload 上限

运行专项测试：

```bash
pnpm --filter @cfxjs/sirius-next-common exec vitest run src/utils/calldataUrl.test.ts
```

## 当前项目边界

本规范只说明已经存在的公共包能力。`sirius-eth` 已有页面接入，但页面路由、错误
展示、ABI 解码和 RPC 调用顺序仍由各 scan 项目自行维护；这些能力尚未在当前
`apps/*` 中组装成生产页面。

接入页面时必须先检查 `decodeCalldataFromUrl` 的结果；只有 `ok === true` 时才能把 `data` 传给 ABI 解码器或 RPC。
