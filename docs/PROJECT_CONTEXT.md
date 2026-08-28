# 项目上下文与交接说明

> 面向接手 `sirius-next` 的开发者和后续 agent。内容基于仓库源码、配置、文档
> 和相邻 scan 消费方核查，并在 2026-08-28 按当前工作树更新；未获仓库材料或
> 项目决策支持的判断只列在“待确认事项”中。

相关交接文档：[架构说明](./ARCHITECTURE.md)、[Handoff Backlog](./TODO.md)、
[三仓库联合开发与迁移上下文](./CROSS_REPO_CONTEXT.md)。calldata URL 的协议与页面接入约束见
[实现规范](../packages/common/docs/encode-calldata-for-url-implementation.md)和
[集成说明](../packages/common/docs/calldata-url.md)。

## 1. 项目定位与迁移状态

`sirius-next` 是 ConfluxScan 下一代前端的 pnpm monorepo，当前阶段的主要职责
是承接可复用能力，而不是立即承接 scan 的全部页面和部署：

- `apps/core` 是 Core Space 方向的应用壳；
- `apps/evm` 是 EVM 方向的应用壳；
- `packages/common` 提供共享 React 组件、hooks、ABI、请求/RPC、地址与
  交易数据处理、图片和样式；
- `packages/i18n` 提供共享多语言资源；
- `packages/eslint-config`、`packages/typescript-config` 提供工具配置。

仓库仍处于迁移期，当前采用 **package-first、scan-first** 的增量方案：

1. Core Space 和 eSpace 继续在各自的 scan 项目中维护页面、Space 特有逻辑和
   独立部署。
2. 从 scan 旧代码中识别通用组件和逻辑，迁移到本仓库的 `packages/*`，并在
   scan 项目中替换旧实现为 next 包引用。
3. 重复这个过程，直到 scan 主要剩余页面编排和不适合跨 Space 复用的逻辑，
   再评估 scan 页面和部署的整体迁移。

两个 app 的 `App.tsx` 目前仍是带计数器的 Vite demo，包清单尚未接入完整的
产品级路由和页面；它们不是当前 scan 页面迁移或生产部署的宿主。当前已积累并
持续发布的主体是 `common` 和 `i18n`。

根 `README.md` 说明：增量迁移期间，本地开发需要把本仓库的 `common`、
`i18n` 软链接进相邻 scan 项目 `sirius` 和 `sirius-eth` 的 `node_modules`。
这是当前公共包替换旧逻辑的集成方式，不是等待新 app 完成后才临时使用的方案。
旧项目中的页面仍由各自项目维护和部署；该说明不代表旧仓库一定存在于当前机器，
也不代表本仓库负责其页面代码。

当前 Codex 工作区已同时开放以下三个独立仓库：

- `/Users/mac/Desktop/code/sirius-next`：公共能力目标仓库；
- `/Users/mac/Desktop/code/sirius`：Core Space scan 参考和消费方；
- `/Users/mac/Desktop/code/sirius-eth`：eSpace scan 参考和消费方。

三仓库的读取顺序、默认读写边界、分支快照和组件迁移步骤见
[三仓库联合开发与迁移上下文](./CROSS_REPO_CONTEXT.md)。

### 本轮交接基线（2026-08-28）

- `common` 已把 React、ReactDOM、React Router、i18next 和 react-i18next
  声明为 peer dependency；tsup 不再把这些运行时上下文打入包内。
- 已增加 `scripts/verify-common-consumers.mjs` 和 `pnpm test:consumers`：它们
  打包 common，并在当前 Core/EVM scan 的依赖路径下验证 Router/i18n 单例及
  hook/component 渲染。该检查是 packed consumer smoke test，不执行 scan 的真实
  包升级、完整安装、页面回归、构建或部署。
- `request.ts` 已保证普通请求超时只发布一次 20002 通知；直接 AbortError
  仍发布 20003，HEAD 请求的 408/599 兼容行为保留。`pubsub.ts` 使用 Map 保存稳定
  订阅记录并按快照发布，支持自取消、重复订阅独立移除和幂等调用，也不受
  `Object.prototype` 属性名影响。
- 已删除 `packages/common/jest.config.js` 及 common 直接 Jest 依赖，根目录与
  common 的直接测试运行器统一为 Vitest 3.2.3。两个相邻 scan 仓库本轮未修改。
- Text、数值输入/格式化、GA userId、local storage key 的改动主要是补充当前
  调用约束和待确认条件，不应被下次 agent 当作已经完成的产品需求或行为重构。

## 2. 仓库边界

- 可供 Core/EVM 共用的组件、工具、ABI、hooks、资源和翻译放在
  `packages/*`。
- 页面编排、产品路由和 Space 特有逻辑在增量迁移阶段继续放在各自的 scan 项目。
- `apps/core`、`apps/evm` 当前是应用壳和集成占位，不是 scan 生产页面部署目标。
- 旧 scan 项目中的替换和部署不属于当前工作树，除非任务明确提供并授权修改旧项目。
- 环境密钥只放在被忽略的 `.env.*.local`，不提交 API key、private key 或
  环境专属 endpoint。

| 路径                         | 当前职责与状态                                             |
| ---------------------------- | ---------------------------------------------------------- |
| `apps/core`                  | React 18 + TypeScript + Vite 的 Core Space 应用壳/集成占位 |
| `apps/evm`                   | React 18 + TypeScript + Vite 的 EVM 应用壳/集成占位        |
| `packages/common`            | 共享组件、hooks、ABI、请求/RPC、链数据工具和 UnoCSS        |
| `packages/i18n`              | Core/EVM 多场景英文、简体中文资源                          |
| `packages/eslint-config`     | 共享 ESLint 配置                                           |
| `packages/typescript-config` | 共享 TypeScript 配置                                       |
| `.changeset`                 | Changesets 配置，基准分支为 `main`                         |
| `.github/workflows`          | main/PR 测试和 main 分支发布工作流                         |

## 3. 成熟与未成熟区域

`packages/common`通过 tsup 构建 ESM、类型声明和
sourcemap，通过 UnoCSS 生成组件样式。源码和发布记录确认已有：

- Core/EVM 地址、名称映射、代理合约、智能账户和钓鱼地址提示；
- Contract ABI、函数输入/输出和 Error ABI 解码；
- Transaction Action、Transaction Trace、树状 Trace；
- AA 失败原因和 AA 交易详情相关组件；
- 表格、图表、Modal、表单、搜索、文件上传、CSV 下载等通用 UI；
- SWR 请求、RPC/SDK、ENS、IPFS gateway、合约统计和 Gas 等工具/hooks；
- Simulate Trace hook 和 calldata URL 编解码工具。

`common` 已有相邻 Vitest 测试，覆盖地址、输入数据、ABI 数值、请求、SDK、
IPFS、表格/Trace hooks 和 calldata codec 等。这说明该包有发布与测试基础，
不表示所有消费者已经接入，也不表示所有能力已完成。

本轮新增/补齐的 common 回归覆盖：

- `request` 的 timeout/Abort 单通知语义，以及 `pubsub` 的快照发布、自取消、
  重复订阅和幂等取消；
- `fetchWithCache` 的 TTL 和 rejected Promise 重试，`rpcRequest` 的
  `window.CFX` 缺失错误通知与重新抛出；
- Zustand ENS/nametag/contract cache 合并，SDK 的 Core/EVM `estimateGas`、
  `simulateContract`、环境配置 fallback 与按 Space 缓存；
- `useDecodeFunctionData` / `useDecodeFunctionError` 的 ABI fallback 和
  loading/error 优先级；`useSimulateTrace` 的嵌套调用、Proxy/BeaconProxy、合约
  创建、revert/fail、ABI 解析失败和 gas 估算失败。

当前明确不测试日志索引：接口尚不支持真实 log index，不能把遍历序号当作已完成
的协议能力。

本轮验证基线为 `pnpm test` 和 `pnpm test:coverage` 均通过：21 个测试文件、332
个测试；总体 V8 覆盖率为 lines/statements 24.84%、branches 74.23%、functions
41.63%。`pnpm build`、`pnpm lint`、`pnpm test:consumers`、common TypeScript 检查、
Prettier 检查和 `git diff --check` 也已通过。测试输出仍有既有 `useTableData` 的
React `act(...)` warning，但不是失败。

`packages/i18n`包含 `cspace`、`evm/base`、
`evm/espace`、`evm/bspace` 的英文和简体中文资源。`common`、`i18n` 均为
公开发布包。

明确尚未成熟或未接入的部分：

- scan 项目仍有待识别和替换的旧通用逻辑；首个迁移模块、顺序、验收人和部署
  验证范围尚待确定；
- `apps/core`、`apps/evm` 尚无完整路由、页面、环境配置和产品级共享包组装，
  但这不是当前增量迁移的前置目标；
- calldata URL codec 已实现并有测试，`sirius-eth` 已在 Simulate 页面读取并解码
  `data`，并在 Contract ABI 方法入口生成分享链接；Core Space scan 和
  `apps/*` 尚未接入。新增页面仍必须完成错误展示、RPC 前置校验和链接生成；
- `useSimulateTrace` 已被 `sirius-eth` 的 Simulate 页面实际使用，但当前明确不
  支持 Core Space，也未覆盖其他 tracer 响应；日志真实索引和排序仍待根据接口
  契约补齐；
- 源码 TODO 涉及真实 log index/排序、EVM 地址格式迁移后的兼容层清理、
  GA userId、数值格式化与输入、移动端文本截断，以及缓存/全局提示等遗留项；
  它们的前置条件和建议口径集中记录在 `docs/TODO.md`。
- 发布包的 React、Router 和 i18n 等上下文依赖已在 common 中声明为 peer dependency，
  并通过当前 `sirius`、`sirius-eth` 依赖版本的打包 consumer smoke test；两个
  scan 仍需升级到包含该修复的发布版本后完成真实安装和页面验证。smoke test
  当前不校验包管理器的 strict peer semver 失败路径。

## 4. 技术栈与常用命令

工作区使用 Node.js 18+、pnpm 9.5.0、Turborepo、React 18、TypeScript、
Vite、Vitest 3.2.3/jsdom、Prettier 和 ESLint。Vitest 是根目录和 common 的
唯一直接测试运行器，Jest 配置已删除。`common` 还使用 SWR、Zustand、
cive、js-conflux-sdk、ethers 5、viem 2、i18next、Highcharts、Radix UI 和
UnoCSS。当前 GitHub Actions 使用 Node.js 24.x、pnpm 9.5.0。

```bash
# 安装与开发
pnpm install
pnpm dev
pnpm --filter core start
pnpm --filter evm start

# 构建、检查与测试
pnpm build
pnpm lint
pnpm test
pnpm test:coverage
pnpm --filter @cfxjs/sirius-next-common exec vitest run
pnpm --filter @cfxjs/sirius-next-common exec vitest run src/utils/request.test.ts src/utils/pubsub.test.ts
pnpm test:consumers

# 修改可发布 package 时创建 changeset
pnpm changeset add
```

`common` 的 `pnpm --filter @cfxjs/sirius-next-common test` 是 watch 模式；根目录
`pnpm test` 通过 Turbo 调用各 package 的测试脚本并传入 `--run`，因此每个 package
使用自己的 Vitest 配置。`pnpm test:coverage` 运行 common 的全量 V8 覆盖率并生成
`coverage/common/` 下的文本、HTML 和 JSON summary 报告；
自动化验证优先用上面的 `exec vitest run`。`pnpm format` 只格式化暂存区内受支持的文件，
运行前必须检查暂存范围。main 上的 release workflow 由 Changesets 创建
版本 PR 或执行 `pnpm changeset publish`。

## 5. 当前分支与工作树快照

2026-08-28 交接核验结果：

- next 当前分支为 `codex/ai-refactor`；工作树包含本轮尚未提交的代码、锁文件和
  文档改动。下次接手先运行 `git status --short --branch`，不要用 reset、checkout
  或批量格式化覆盖这些改动。
- `/Users/mac/Desktop/code/sirius` 和 `/Users/mac/Desktop/code/sirius-eth` 在本轮
  核验时均为独立、无未提交改动的外部仓库；它们不是 next workspace 成员。
- 本轮关键变更集中在 `packages/common` 的 peer/runtime 边界、request/pubsub
  和 cache/RPC/store/SDK 回归、ABI/Trace hook 测试、Vitest/Jest 配置、consumer
  smoke script，以及对应交接文档。完整清单以 `git diff HEAD --name-status` 为准，
  不要仅凭本节推断文件是否已提交。

每次接手和交付前重新检查三个仓库的状态；除非任务明确授权，不要修改两个 scan
仓库。

## 6. 工程与协作约束

- Prettier 风格：两空格、单引号、分号、尾逗号、约 80 列。
- 组件目录/文件用 PascalCase；工具和 hooks 用 camelCase；测试与实现相邻，
  命名 `*.test.ts` 或 `*.test.tsx`。
- ESLint 以零 warning 为目标，不添加未使用的 disable。
- 变更解析、格式化、请求或 UI 逻辑时先跑最小相关测试，可行时再跑全量。
- `pnpm test:consumers` 通过只证明打包 consumer 的运行时上下文探针通过；不能替代
  两个 scan 的真实版本升级、构建、页面和部署验收。
- 不要在未确认 Core/EVM 调用方、隐私要求或协议兼容性的情况下放宽输入语义、改变
  通知 code、移除地址兼容层、修改 local storage key 或实现 GA userId。
- commit subject 遵循 Conventional Commit 风格并保持聚焦。
- PR 说明用户可见变化、验证方式、关联 issue；可见 UI 变化附截图。
- PR 直接创建 ready-for-review，不创建 draft。

## 7. 待确认事项

当前仓库材料和已确认方案仍无法权威回答以下问题，不要自行补成事实：

1. 首个要从 scan 抽取的公共模块、迁移顺序、负责人和验收标准。
2. `sirius`、`sirius-eth` 各自承担的生产页面、分支/环境和替换验证流程。
3. 增量阶段公共包在 scan 中采用软链接、workspace、发布包还是其他版本管理方式。
4. 何时满足“scan 主要剩余页面和 Space 特有逻辑”，以及整体页面部署迁移的
   范围、里程碑和截止条件。
5. 新 app 最终的路由、状态、环境配置、认证/钱包和部署架构。
6. Simulate Trace 是否以及何时支持 Core Space 和其他 tracer。
7. 项目 TODO 的负责人、优先级和验收标准；源码 TODO 不代表已排期。
8. 生产部署目标及发布后验收流程。

若任务依赖这些答案且不同选择会显著改变实现，应先向项目负责人确认。
