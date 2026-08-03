# Calldata URL 编码与解码

本文档描述 `sirius-next` 当前已经实现的 calldata URL 编解码能力、使用方式和集成状态。

## 当前状态

编解码逻辑已经在公共包中实现，并通过参考向量、异常输入和大小边界测试：

- 实现：`packages/common/src/utils/calldataUrl.ts`
- 类型：`packages/common/src/utils/types.ts`
- 测试：`packages/common/src/utils/calldataUrl.test.ts`
- 测试向量：
  `packages/common/src/utils/test/fixtures/calldataUrlEncoding.json`

当前 `apps/core` 和 `apps/evm` 尚未调用这些 API。因此，本仓库目前提供的是可复用的公共包能力，不代表 Simulate 页面已经完成以下接入：

- 从 URL 查询参数读取并解码 `data`
- 向用户展示 `missing`、`invalid-format` 或 `too-large`
- 解码成功后再执行 ABI 解码或 RPC 请求
- 从合约方法入口生成压缩后的 Simulate URL

页面接入时必须遵守本文后面的集成约束。

## 支持的 data 格式

Simulate URL 使用一个 `data` 查询参数传递 calldata。

| 格式      | 示例           | 含义                                        |
| --------- | -------------- | ------------------------------------------- |
| Hex       | `0x12345678`   | 原始 calldata，兼容已有链接                 |
| Base64URL | `b1.EjRWeA`    | calldata 字节的无 padding Base64URL 编码    |
| DEFLATE   | `d1.<payload>` | raw DEFLATE level 9 后再进行 Base64URL 编码 |

`b1.` 和 `d1.` 中的 `1` 是格式版本。已有前缀的语义不能被修改；未来增加算法时必须使用新前缀。

Base64URL payload 只允许：

- `A-Z`
- `a-z`
- `0-9`
- `-`
- `_`

不允许 `+`、`/` 或结尾的 `=` padding。解码器还会重新编码并比较原值，从而拒绝非规范但可能被 `atob` 宽松接受的输入。

## 编码规则

`encodeCalldataForUrl` 接收带小写 `0x` 前缀、字节对齐的 Hex。省略参数或传入空字符串时，会先规范化为空 calldata `0x`：

```text
undefined / "" ─────────────────────────────── 规范化为 0x
0x-prefixed Hex
       │
       ├── 校验 /^0x(?:[0-9a-fA-F]{2})*$/
       │
       ├── Hex 转 Uint8Array
       │
       ├── 超过 1 MiB：抛出 RangeError
       │
       ├── 不超过 256 字节：返回小写 Hex
       │
       └── 超过 256 字节
               ├── 小写 Hex
               ├── b1. + Base64URL(bytes)
               └── d1. + Base64URL(deflateRaw(bytes, level 9))
                           │
                           └── 选择完整字符串中最短的一项
```

候选值按以下顺序比较：

1. Hex
2. Base64URL
3. DEFLATE

比较使用严格小于 `<`。长度相同时保留较早的候选，因此优先级为 Hex、Base64URL、DEFLATE。

不能直接对 `"0x1234"` 这样的 Hex 文本做 Base64 编码。必须先还原成 `[0x12, 0x34]`。

### 编码 API

公共包构建后，可以从对应的构建入口导入：

```ts
import { encodeCalldataForUrl } from '@cfxjs/sirius-next-common/dist/utils/calldataUrl';
import type { Hex } from '@cfxjs/sirius-next-common/dist/utils/types';

const encoded = encodeCalldataForUrl(calldata as Hex);
const emptyFromOmittedValue = encodeCalldataForUrl();
const emptyFromBlankValue = encodeCalldataForUrl('');
```

错误行为：

- 省略参数或空字符串返回 `0x`
- 其他非法 Hex 抛出 `TypeError`
- 解码后超过 1 MiB 抛出 `RangeError`
- 不会补零、截断或修复非法输入

## 放入 URL

当前公共模块只负责 `data` 值的编解码，不提供完整 URL 构造函数。调用方应使用标准 `URL` API：

```ts
import { encodeCalldataForUrl } from '@cfxjs/sirius-next-common/dist/utils/calldataUrl';
import type { Hex } from '@cfxjs/sirius-next-common/dist/utils/types';

const url = new URL('/simulate-trace', window.location.origin);
url.searchParams.set('data', encodeCalldataForUrl(calldata as Hex));
url.searchParams.set('to', '0x1122334455667788990011223344556677889900');
```

不要手工拼接或二次 Base64 编码 `data`。`to` 和 `value` 不参与 calldata 编码。

## 解码规则

`decodeCalldataFromUrl` 根据前缀选择解码器：

| 前缀  | 解码过程                                          |
| ----- | ------------------------------------------------- |
| `0x`  | 校验 Hex，检查长度，返回规范化的小写 Hex          |
| `b1.` | 严格 Base64URL 解码，检查长度，转换成 Hex         |
| `d1.` | 严格 Base64URL 解码，raw DEFLATE 解压，转换成 Hex |
| 其他  | 返回 `invalid-format`                             |

函数直接接受 `URLSearchParams.get()` 返回的 `string | null`。默认情况下，`undefined`、`null` 和空字符串都表示空 calldata，并成功返回 `0x`。如果当前页面要求 URL 必须显式包含非空字符串形式的 `data` 参数，可以传入 `{ allowEmptyData: false }`，此时这些值返回 `missing`。

`allowEmptyData` 只控制缺失、`null` 或空字符串的便利转换。规范形式 `0x` 是有效的空 calldata，即使 `allowEmptyData` 为 `false` 也会成功解码。

当前函数签名：

```ts
interface DecodeCalldataFromUrlOptions {
  allowEmptyData?: boolean;
}

function decodeCalldataFromUrl(
  value?: string | null,
  options?: DecodeCalldataFromUrlOptions,
): CalldataDecodeResult;
```

返回类型是判别联合：

```ts
type CalldataDecodeResult =
  | {
      ok: true;
      data: `0x${string}`;
      codec: 'hex' | 'base64url' | 'deflate';
    }
  | {
      ok: false;
      error: 'missing' | 'invalid-format' | 'too-large';
      codec?: 'hex' | 'base64url' | 'deflate';
    };
```

使用示例：

```ts
import { decodeCalldataFromUrl } from '@cfxjs/sirius-next-common/dist/utils/calldataUrl';

const result = decodeCalldataFromUrl(searchParams.get('data'));

if (!result.ok) {
  // 根据 result.error 显示错误，并停止 ABI 解码和 RPC 请求。
} else {
  // result.data 是规范化的小写 0x-prefixed calldata。
}
```

要求显式提供 `data` 的页面可以使用：

```ts
const result = decodeCalldataFromUrl(searchParams.get('data'), {
  allowEmptyData: false,
});
```

解码失败时不会自动回退到其他格式。例如，损坏的 `d1.` 数据不会被当作 Hex 或 Base64URL 再次尝试。

## 大小与安全限制

解码后的 calldata 硬上限为 1 MiB，即 1,048,576 字节。

- Hex 在转换成字节之前检查长度。
- `b1.` 在 Base64URL 解码前检查 payload 字符数，解码后再次检查字节数。
- `d1.` 在 Base64URL 解码前检查 payload 字符数，并限制压缩数据本身的大小。
- raw DEFLATE 使用 64 KiB 输出块流式解压。
- 累计输出超过 1 MiB 时立即终止，避免压缩炸弹占用过多内存。

当前项目使用 Pako 2.0.2。`@types/pako@2.0.2` 没有公开内部的 `Inflate.ended` 字段，因此实现通过公开的 `onEnd(status)` 判断压缩流是否完整：

- `status === 0`：完整解压成功
- 非零状态：压缩流损坏
- `onEnd` 未触发：压缩流被截断

只有状态为 `0` 时才会返回解压结果。

## 页面接入约束

未来在 `apps/core` 或 `apps/evm` 中接入时，应保证以下顺序：

1. 读取 URL 中唯一的 `data` 参数。
2. 根据页面是否允许缺失或空字符串形式的参数，调用 `decodeCalldataFromUrl` 并设置 `allowEmptyData`。
3. 解码失败时显示对应错误并停止后续流程。
4. 仅在 `result.ok === true` 时执行 ABI 解码。
5. 仅使用解码后的 `result.data` 构造 `debug_traceCall` 或其他 RPC 请求。

生成链接时应调用 `encodeCalldataForUrl`，并通过标准 `URL` API 设置 `data`。

## 测试

当前测试覆盖：

- 规范化 Hex 和历史 Hex 链接
- Base64URL 与 Pako DEFLATE 参考向量
- 256/257 字节编码分支
- 可压缩与不可压缩 calldata
- 编码、解码往返
- 省略值、`null`、空字符串和 `0x` 的空 calldata 语义
- `allowEmptyData: false` 的严格缺失检查
- 非法 Hex、未知版本、padding 和非规范 Base64URL
- 损坏及截断的 DEFLATE 流
- 恰好 1 MiB 和超过 1 MiB
- 解压输出超限和编码 payload 超限

运行 calldata 专项测试：

```bash
pnpm --filter @cfxjs/sirius-next-common exec vitest run src/utils/calldataUrl.test.ts
```

运行公共包全量测试：

```bash
pnpm --filter @cfxjs/sirius-next-common exec vitest run
```

## 向后兼容

解码器继续支持已有链接：

```text
/simulate-trace?data=0x...&to=0x...
```

不能移除或改变 `0x`、`b1.`、`d1.` 的现有含义。增加新格式时，应添加独立的版本化前缀并显式实现对应解码分支。
