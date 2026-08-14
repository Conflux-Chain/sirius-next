# Sirius Next 架构说明

本文面向后续开发和工程交接，描述仓库当前可从源码与配置确认的架构。
它记录的是“当前事实”，不是完整产品蓝图；后端实现、部署拓扑和线上运行环境
不在本文推断范围内。

项目背景和迁移状态见 [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)，待确认事项与
建议执行顺序见 [TODO.md](./TODO.md)。

## 1. 项目定位与当前阶段

`sirius-next` 是 ConfluxScan 下一代前端的 pnpm monorepo，目标是分别承载
Core Space 与 EVM 界面，并沉淀两端共享的组件、链上数据处理和翻译资源。

仓库目前处于迁移阶段：成熟能力主要位于 `packages/common` 和
`packages/i18n`，`apps/core`、`apps/evm` 仍是 Vite 示例壳，尚未形成完整的
区块浏览器应用。迁移完成前，README 要求本地将两个共享包软链接到旧的
`sirius`、`sirius-eth` 项目中消费。因此不能仅凭共享包已有功能，判断新应用
已经具备对应页面。

## 2. Monorepo 总览

```mermaid
flowchart TD
  Core["apps/core<br/>Core Space 应用壳"]
  EVM["apps/evm<br/>EVM 应用壳"]
  Common["packages/common<br/>共享 React 与链能力"]
  I18n["packages/i18n<br/>分空间翻译资源"]
  TS["packages/typescript-config"]
  ESLint["packages/eslint-config"]

  Core -. "目标依赖；尚未接入" .-> Common
  EVM -. "目标依赖；尚未接入" .-> Common
  Core -. "目标依赖；尚未接入" .-> I18n
  EVM -. "目标依赖；尚未接入" .-> I18n
  Common --> I18n
  Common --> TS
  Common --> ESLint
  I18n --> TS
  I18n --> ESLint
```

工作区由 `pnpm-workspace.yaml` 收纳 `apps/*` 和 `packages/*`。根目录要求
Node.js 18 以上、pnpm 9.5，并由 Turborepo 编排：

- `build` 先构建依赖包，缓存 `dist/**`。
- `lint` 先检查依赖包。
- `dev` 是不缓存的常驻任务。
- `.env.*local` 被声明为 Turbo 全局依赖；密钥只能放在未跟踪的本地环境文件。

### 2.1 应用目录

- `apps/core`：Core Space 的 Vite + React 18 + TypeScript 应用壳。
- `apps/evm`：EVM 界面的同构应用壳，目前示例标题为 eSpace。
- 两个应用当前只有 React/Vite 示例代码，没有路由、环境初始化、i18n 初始化、
  请求接入或对 workspace 共享包的依赖。
- 应用构建均为 `tsc && vite build`，样式入口使用 Tailwind CSS 3。

### 2.2 公共包

- `packages/common`：可发布包 `@cfxjs/sirius-next-common`，承载共享组件、
  hooks、请求、状态、ABI、地址与交易解码、图片和样式。
- `packages/i18n`：可发布包 `@cfxjs/sirius-next-i18n`，按 `cspace` 与
  `evm/{base,espace,bspace}` 组织英文、简体中文资源，并提供翻译资源类型。
- `packages/eslint-config`：仓库共享 ESLint 预设，仅作开发工具。
- `packages/typescript-config`：严格模式、Bundler module resolution 等共享
  TypeScript 预设。

## 3. 构建、样式与测试

`packages/common` 通过 tsup 递归扫描 `src`，为除图片、测试以外的源码文件
生成逐文件 ESM 入口、类型声明和 source map，目标为 ES2020。React 与
ReactDOM 保持 external，部分 UI 和链 SDK 被打入产物，PNG/SVG 作为资源复制。
当前没有单一 barrel 入口或 `exports` 映射；既有文档按
`@cfxjs/sirius-next-common/dist/...` 深路径消费，因此新增或移动文件可能影响
包的公开入口。

共享组件样式由 UnoCSS 扫描 `src/components/**/*.tsx`，输出
`dist/uno.css`；应用自身使用 Tailwind。应用接入公共组件时，宿主必须明确加载
公共 CSS，并维护 UnoCSS 主题所引用的 CSS 变量，不能假定应用的 Tailwind 会
生成公共包类名。

测试框架是 Vitest + jsdom，测试与实现相邻，命名为 `*.test.ts(x)`。当前测试
主要覆盖 `packages/common` 的地址、请求、SDK、表格、ABI 与 calldata 等逻辑；
两个应用尚无页面级或端到端测试。常用命令：

```bash
pnpm build
pnpm lint
pnpm test
pnpm --filter @cfxjs/sirius-next-common exec vitest run
```

## 4. `packages/common` 内部分层

`common` 不是严格按层强制隔离，但可按职责理解为：

1. **资源与领域基础**：`abis/`、`images/`、`utils/types.ts`、地址、数值、
   calldata、ABI 等纯函数。
2. **基础设施**：`utils/request.ts` 处理 HTTP；`rpcRequest.ts` 兼容
   `window.CFX`；`sdk.ts` 用 viem/cive 封装 EVM/Core 公共客户端；缓存和
   pub/sub 分别承担请求去重及错误通知。
3. **状态适配**：`store/` 使用 Zustand 保存环境配置、翻译键对象、网络与
   合约全局数据、ENS、名称标签缓存、Gas 价格和高亮状态。
4. **数据 hooks**：`utils/hooks/` 以 SWR/SWR Immutable 组合请求、缓存和领域
   格式化，例如表格分页、合约详情、地址名称、ABI、交易 Trace 和模拟 Trace。
5. **视图组件**：`components/` 消费 hooks/store，提供地址、交易 Action、
   Input/Output Data、Trace、ABI、表格、图表和通用 UI。

推荐依赖方向为：

```text
应用页面 -> common 组件 / hooks -> request、SDK、store -> 外部接口或链 RPC
应用启动 -> i18n 资源 + 环境/全局配置 -> common store -> 组件与工具
```

包内已有少量工具直接读取全局 store，因此它不是无状态组件库。消费方必须先
完成运行时初始化，再渲染依赖这些值的组件。

## 5. Core 与 EVM 的边界

公共 API 通常以 `space: 'core' | 'evm'` 作为分派键，但链差异不能被抹平：

| 关注点             | Core                                       | EVM                                         |
| ------------------ | ------------------------------------------ | ------------------------------------------- |
| 地址展示           | Base32 为主，并保留 pocket、内置合约等语义 | Hex/checksum，含 EOA with code              |
| SDK                | cive，估算 Gas 与存储抵押                  | viem，标准 EVM Gas 估算                     |
| 地址组件           | `CoreAddressContainer`                     | `EVMAddressContainer`                       |
| Transaction Action | Core 专用格式化                            | EVM 专用格式化及临时地址 key 转换           |
| 已上链交易 Trace   | `useTxTrace` 支持                          | `useTxTrace` 支持，另处理 delegated address |
| Simulate Trace     | 当前不支持                                 | `useSimulateTrace` 当前只允许 EVM           |

共享代码应把格式化和展示协议统一在 `Space` 分支之后，而不是在应用中散落
地址转换或 SDK 判断。链专属页面、路由和业务编排留在对应 `apps/*`；只有两端
确实共用的能力才下沉到 `packages/common`。

## 6. 典型数据流

### 6.1 环境与 i18n

消费应用负责选择当前网络和语言资源，并把环境写入 `useEnv`、翻译键对象写入
`useI18n`、网络/合约等运行数据写入 `useGlobalData`。组件同时使用
`react-i18next` 的 `t()` 和 common store 中的键对象；因此宿主还需初始化
i18next，二者必须保持同一资源空间。

环境中已被公共包使用的字段包括 `ENV_NETWORK_ID`、`ENV_RPC_SERVER`、
`ENV_OPEN_API_HOST` 和可选的 `ENV_WALLET_CONFIG`。具体配置加载协议尚未在新
应用中实现。

### 6.2 HTTP 与链请求

```text
组件 -> SWR hook -> fetchWithPrefix -> 相对路径 /v1/*
                              \-> fetchWithOpenApi -> ENV_OPEN_API_HOST/*
```

请求层统一处理 60 秒超时、HTTP 状态、Core 风格 `code/data` 与
EVM 风格 `status/result` 响应，并通过 pub/sub 发布错误通知。链调用由
`sdk.ts` 根据 `space` 创建并缓存 cive/viem public client；另有少量旧式 RPC
通过页面注入的 `window.CFX` 调用。页面不应重复实现这些兼容逻辑。

### 6.3 Simulate Trace

```mermaid
sequenceDiagram
  participant Page as EVM 页面（待接入）
  participant Hook as useSimulateTrace
  participant SDK as viem public client
  participant API as /v1/traceCallView
  participant UI as Trace 组件
  Page->>Hook: tx、block tag、callTracer 配置
  Hook->>SDK: 未传 gas 时 estimateGas
  Hook->>API: POST debug_traceCall 请求体
  API-->>Hook: traceCall + ABI/名称/代理映射
  Hook->>Hook: 地址、方法、代理、日志与树结构格式化
  Hook-->>UI: TreeTraceForUI 与 logs
```

该 hook 已存在，但 apps 尚无对应页面。日志索引当前由前端顺序生成，源码仍
标记为应改用真实索引并排序。

### 6.4 Calldata URL

`utils/calldataUrl.ts` 已实现 Hex、`b1.` Base64URL、`d1.` raw DEFLATE 的
严格编解码和 1 MiB 安全上限。正确页面顺序应是：读取唯一 `data` 参数，调用
`decodeCalldataFromUrl`，失败时展示错误并停止，成功后才进行 ABI 解码和
Simulate RPC。生成分享链接时调用 `encodeCalldataForUrl`，再用标准 `URL` API
写入参数。该能力目前只有公共实现和测试，尚未接入任一 app。完整协议与接入
约束见 [`packages/common/docs/calldata-url.md`](../packages/common/docs/calldata-url.md)。

## 7. 扩展准则

- 应用专属路由、页面和业务状态放在对应 `apps/core` 或 `apps/evm`。
- 跨空间复用代码进入 `common` 前，应以明确的 `space` 参数或链适配器隔离差异。
- 通用算法尽量保持纯函数；需要环境、翻译或网络状态时显式记录初始化前置条件。
- 新请求应复用请求层和 SWR key 约定；不要在组件内自行拼接 Open API host、
  重复解析响应或绕过统一错误通道。
- 地址在进入展示或 map lookup 边界时统一规范化，避免 Base32、原始 Hex 和
  checksum Hex 混作 key。
- 公共组件改动要同步考虑 UnoCSS 产物、深路径入口、类型声明和旧项目消费者。
- 解析、格式化、请求及 URL 协议变更必须补相邻单元测试；可见页面迁移应补
  页面级回归测试和截图。
- 修改可发布 package 时按仓库约定创建 Changeset；不要把密钥或环境专属
  endpoint 写入仓库。

## 8. 已知架构缺口

1. 两个 app 仍为脚手架，缺少真实路由、布局、配置、i18n、请求和页面集成。
2. 迁移期依赖旧仓库软链接消费，尚未建立完全由本 monorepo 自举的开发闭环。
3. 环境 store 使用 `any`，启动协议未类型化；`NETWORK_ID` 在模块加载时读取并
   固化，SDK client 也按 space 缓存，运行时切网的生命周期需要统一设计。
4. 翻译同时依赖 i18next 与 Zustand 键对象，初始化顺序和资源一致性没有应用层
   契约或测试保障。
5. `common` 以深路径作为公开 API，缺少清晰的 package exports 和稳定性分级。
6. 应用 Tailwind 与公共包 UnoCSS 并存，公共 CSS/主题变量的宿主接入尚无模板。
7. `react-router-dom@5` 已被 common hooks 使用，但新 apps 尚未建立路由层。
8. Simulate Trace 仅支持 EVM，calldata URL 尚未接入页面，日志真实索引仍待补齐。
9. EVM Transaction Action 仍为 API 地址格式做临时 map key 转换。
10. 测试集中在公共包，缺少跨包集成测试、应用回归测试和端到端验证。

后续迁移宜先完成一个 EVM 页面纵向切片（启动配置、i18n、路由、请求、样式、
测试全链路），再将其固化为 Core/EVM 应用的接入模板。
