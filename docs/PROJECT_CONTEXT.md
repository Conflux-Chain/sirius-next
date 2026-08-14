# 项目上下文与交接说明

> 面向接手 `sirius-next` 的开发者和后续 agent。内容来自 2026-08-13 对
> 当前工作树、仓库文档、包清单、源码、Changelog 和 CI 配置的核查；未获
> 仓库材料支持的判断只列在“待确认事项”中。

相关交接文档：[架构说明](./ARCHITECTURE.md)、
[Handoff Backlog](./TODO.md)。calldata URL 的协议与页面接入约束见
[实现规范](../packages/common/docs/encode-calldata-for-url-implementation.md)和
[集成说明](../packages/common/docs/calldata-url.md)。

## 1. 项目定位与迁移状态

`sirius-next` 是 ConfluxScan 下一代前端的 pnpm monorepo：

- `apps/core` 面向 Conflux Core Space；
- `apps/evm` 面向 EVM surfaces；
- `packages/common` 提供共享 React 组件、hooks、ABI、请求/RPC、地址与
  交易数据处理、图片和样式；
- `packages/i18n` 提供共享多语言资源；
- `packages/eslint-config`、`packages/typescript-config` 提供工具配置。

仓库仍处于迁移期。两个 app 的 `App.tsx` 都还是带计数器的 Vite demo，包
清单尚未接入 `common`、`i18n`、路由或产品级请求层；不能把它们当作已完成
的 ConfluxScan 应用。当前已积累并持续发布的主体是 `common` 和 `i18n`。

根 `README.md` 说明：迁移完成前，本地开发需要把本仓库的 `common`、
`i18n` 软链接进相邻旧项目 `sirius` 和 `sirius-eth` 的 `node_modules`。因此
目前的模式是共享能力在本仓库演进，完整页面仍可能由旧项目消费。该说明不
代表旧仓库一定存在于当前机器，也不代表本仓库负责其页面代码。

## 2. 仓库边界

- 可供 Core/EVM 共用的组件、工具、ABI、hooks、资源和翻译放在
  `packages/*`。
- 单个新应用专属的页面和组装逻辑放在对应 `apps/*`。
- 旧项目中的页面接入不属于当前工作树，除非任务明确提供并授权修改旧项目。
- 环境密钥只放在被忽略的 `.env.*.local`，不提交 API key、private key 或
  环境专属 endpoint。

| 路径                         | 当前职责与状态                                      |
| ---------------------------- | --------------------------------------------------- |
| `apps/core`                  | React 18 + TypeScript + Vite 的 Core Space demo     |
| `apps/evm`                   | React 18 + TypeScript + Vite 的 EVM demo            |
| `packages/common`            | 共享组件、hooks、ABI、请求/RPC、链数据工具和 UnoCSS |
| `packages/i18n`              | Core/EVM 多场景英文、简体中文资源                   |
| `packages/eslint-config`     | 共享 ESLint 配置                                    |
| `packages/typescript-config` | 共享 TypeScript 配置                                |
| `.changeset`                 | Changesets 配置，基准分支为 `main`                  |
| `.github/workflows`          | main/PR 测试和 main 分支发布工作流                  |

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

`packages/i18n`包含 `cspace`、`evm/base`、
`evm/espace`、`evm/bspace` 的英文和简体中文资源。`common`、`i18n` 均为
公开发布包。

明确尚未成熟或未接入的部分：

- `apps/core`、`apps/evm` 尚无完整路由、页面、环境配置和共享包组装；
- calldata URL codec 已实现并有测试，但两个 app 尚未调用；页面读取、错误
  展示、RPC 前置校验和链接生成仍待接入；
- `useSimulateTrace` 当前明确不支持 Core Space，也未覆盖其他 tracer 响应；
- 源码 TODO 涉及真实 log index/排序、EVM 地址格式迁移后的兼容层清理、
  GA userId、数值格式化与输入、移动端文本截断，以及缓存/全局提示等遗留项；
  它们的前置条件和建议口径集中记录在 `docs/TODO.md`。

## 4. 技术栈与常用命令

工作区使用 Node.js 18+、pnpm 9.5.0、Turborepo、React 18、TypeScript、
Vite、Vitest/jsdom、Prettier 和 ESLint。`common` 还使用 SWR、Zustand、
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
pnpm --filter @cfxjs/sirius-next-common exec vitest run

# 修改可发布 package 时创建 changeset
pnpm changeset add
```

`common` 的 `pnpm --filter @cfxjs/sirius-next-common test` 是 watch 模式；
自动化验证优先用上面的 `exec vitest run`。CI 全工作区测试命令是
`pnpm -r --if-present test`。`pnpm format` 只格式化暂存区内受支持的文件，
运行前必须检查暂存范围。main 上的 release workflow 由 Changesets 创建
版本 PR 或执行 `pnpm changeset publish`。

## 5. 当前分支与工作树快照

本文创建前的 2026-08-13 快照：

- 分支 `feat/verified-contracts`，跟踪 `origin/feat/verified-contracts`；
- HEAD `9f97140`，快照时也对应 `origin/main`；
- 已有未提交修改：
  - `packages/i18n/evm/base/en/translation.json`；
  - `packages/i18n/evm/base/zh_cn/translation.json`。

两份翻译修改早于本文，应视为用户现有工作，不要覆盖、回滚或顺手格式化。
每次接手和交付前重新运行 `git status --short --branch`，并只审查、提交本次
任务文件；本节是历史快照，不能代替实时检查。

## 6. 工程与协作约束

- Prettier 风格：两空格、单引号、分号、尾逗号、约 80 列。
- 组件目录/文件用 PascalCase；工具和 hooks 用 camelCase；测试与实现相邻，
  命名 `*.test.ts` 或 `*.test.tsx`。
- ESLint 以零 warning 为目标，不添加未使用的 disable。
- 变更解析、格式化、请求或 UI 逻辑时先跑最小相关测试，可行时再跑全量。
- commit subject 遵循 Conventional Commit 风格并保持聚焦。
- PR 说明用户可见变化、验证方式、关联 issue；可见 UI 变化附截图。
- PR 直接创建 ready-for-review，不创建 draft。

## 7. 待确认事项

当前仓库材料无法权威回答以下问题，不要自行补成事实：

1. 两个 app 完整迁移的范围、顺序、里程碑和截止条件。
2. `sirius`、`sirius-eth` 各自承担的生产页面及软链接模式退出时间。
3. 新 app 最终的路由、状态、环境配置、认证/钱包和部署架构。
4. Simulate Trace 是否以及何时支持 Core Space 和其他 tracer。
5. 项目 TODO 的负责人、优先级和验收标准；源码 TODO 不代表已排期。
6. 生产部署目标及发布后验收流程。

若任务依赖这些答案且不同选择会显著改变实现，应先向项目负责人确认。
