# 三仓库联合开发与迁移上下文

> 更新时间：2026-08-28
>
> 本文是后续开发者和 AI agent 接手跨仓库迁移任务时的入口。当前 Codex
> 工作区同时可以访问三个独立 Git 仓库。路径和分支是本机快照，接手任务时
> 必须重新执行 `git status --short --branch`，不能把本文的状态当作实时状态。

## 1. 仓库清单

| 仓库          | 本机路径                              | 主要职责                                             | 技术/开发入口                                                      |
| ------------- | ------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------ |
| `sirius-next` | `/Users/mac/Desktop/code/sirius-next` | 公共组件、hooks、请求/RPC、ABI、链数据逻辑和翻译资源 | pnpm；`pnpm dev`、`pnpm build`、`pnpm test`、`pnpm test:consumers` |
| `sirius`      | `/Users/mac/Desktop/code/sirius`      | Core Space scan 页面、业务编排、Core 配置和独立部署  | yarn；`yarn start:core`、`yarn start:core-testnet`、`yarn build`   |
| `sirius-eth`  | `/Users/mac/Desktop/code/sirius-eth`  | eSpace scan 页面、业务编排、EVM 配置和独立部署       | yarn；`yarn start:evm`、`yarn start:evm-testnet`、`yarn build`     |

两个 scan 仓库的根目录 README 是其当前可见的开发入口：

- [Core scan README](../../sirius/README.md)
- [eSpace scan README](../../sirius-eth/README.md)

当前状态快照（2026-08-28 核验，接手时仍需重新检查）：

- `sirius-next`：分支 `codex/ai-refactor`，HEAD `5da5627`；工作树包含本轮未提交
  的代码和文档改动。
- `sirius`：分支 `dev`，HEAD `47ac9e8c`，当前工作树干净。
- `sirius-eth`：分支 `feat/verified-contracts`，HEAD `ca4646e`，相对
  `origin/feat/verified-contracts` ahead 1 commit，当前工作树干净。

以上状态只用于说明接手时的基线。任何修改前都要分别检查三个仓库的工作树，
保留用户已有修改，不使用 `git reset --hard` 或其他破坏性操作。

## 2. 当前迁移边界

当前采用 package-first、scan-first 的渐进式迁移方案：

1. `sirius` 和 `sirius-eth` 继续独立维护页面、路由、业务编排、Space 特有逻辑
   和部署。
2. 从两个 scan 仓库中识别通用组件和逻辑，迁移到 `sirius-next/packages/*`。
3. 在对应 scan 仓库中将旧实现替换为 next 包引用，并验证功能、构建和部署。
4. 重复上述过程，直到 scan 主要剩余页面和 Space 特有逻辑，再单独决定是否
   启动页面部署的整体迁移。

默认读写规则：

- `sirius-next` 是公共能力迁移的默认目标仓库。
- `sirius` 和 `sirius-eth` 默认只读，用于查找源码、调用方、配置和行为契约。
- 除非用户明确要求替换 scan 引用或修复 scan 代码，否则不要修改两个 scan 仓库。
- 不要为了跨仓库迁移把两个 scan 项目加入 `sirius-next` 的 pnpm workspace。
- 不要把两个 scan 项目的完整源码复制进 `sirius-next`；应通过当前工作区路径直接
  读取源代码，并在迁移记录中固定来源 commit。

本地开发期间，scan 项目可以按照根目录 [README](../README.md) 的说明，通过
软链接消费 `sirius-next` 的 `common` 和 `i18n` 包。软链接是当前增量迁移的
集成方式，不表示 scan 页面已经迁入 `sirius-next`。

## 3. AI agent 接手任务时的读取顺序

开始跨仓库任务时，按以下顺序建立上下文：

1. 读取 `sirius-next/AGENTS.md`。
2. 读取 `sirius-next/docs/PROJECT_CONTEXT.md`、`ARCHITECTURE.md`、`TODO.md` 和
   本文。
3. 读取两个 scan 仓库的根目录 `README.md`，确认各自的启动、构建和环境配置。
4. 分别检查三个仓库的 `git status --short --branch`。
5. 在两个 scan 仓库中搜索目标组件的源码、测试、样式、翻译、hooks、store、API
   和全部调用方。
6. 固定要参考的源仓库 commit，再开始设计 next 包 API。

如果本机路径不存在、仓库没有被当前会话授权读取，或者 source branch/commit
不明确，应先报告缺失信息，不要凭记忆重建组件行为。

## 4. 组件迁移标准流程

以 `TestFunction` 为例：

### 4.1 迁移前分析

- 在 `sirius` 和 `sirius-eth` 中搜索 `TestFunction` 及可能的同义实现。
- 找出组件源码、测试、样式、图片、i18n key、hooks、store、请求和全部调用方。
- 对比 Core/EVM 两端的 props、事件、数据格式、地址处理、错误状态和边界行为。
- 区分真正跨 Space 的公共逻辑、Core 特有逻辑、EVM 特有逻辑和页面编排逻辑。
- 记录源仓库、源文件和 commit；先输出迁移分析，确认范围后再修改代码。

### 4.2 在 next 中实现

- 将公共部分放入合适的 `packages/common` 子目录；翻译资源放入 `packages/i18n`。
- 使用明确的 `space: 'core' | 'evm'` 参数或链适配器隔离差异。
- 复用 common 的请求层、SDK、store、样式和已有公共组件，不在组件内重复实现。
- 保留旧消费者需要的兼容行为，避免无关的全局重构。
- 为解析、格式化、请求和 UI 行为补充相邻 Vitest；修改可发布包时创建 Changeset。

### 4.3 替换 scan 引用

只有用户授权修改 scan 仓库时才执行这一步：

- 在 `sirius`、`sirius-eth` 中替换旧 import 或旧实现。
- 保留页面编排和 Space 特有逻辑在对应 scan 仓库。
- 分别运行受影响的测试、lint/build 和必要的启动验证。
- 记录迁移前后行为、遗留兼容代码和回滚方式。

### 4.4 交付前检查

- 检查三个仓库的 `git diff` 和 `git status`，确认没有误改其他仓库。
- 说明 next 包测试结果，以及 scan 消费方验证是否完成。
- 记录源 commit、目标文件、公共 API、Changeset、验证命令和遗留限制。

## 5. 推荐的任务提示模板

```text
目标仓库：/Users/mac/Desktop/code/sirius-next
Core Space 参考仓库：/Users/mac/Desktop/code/sirius
eSpace 参考仓库：/Users/mac/Desktop/code/sirius-eth

请先只读分析两个 scan 仓库中的 <组件名>：
1. 找出源码、全部调用方、测试、样式、i18n、hooks、store 和 API 依赖；
2. 对比 Core/EVM 差异；
3. 说明哪些逻辑适合迁移到 sirius-next，哪些必须留在 scan；
4. 固定并报告参考 commit；
5. 先输出迁移方案，不要修改代码。

分析确认后，只修改 sirius-next，将公共部分迁移到合适的 packages/*，补充测试。
除非我明确授权，否则不要修改 sirius 或 sirius-eth。
```
