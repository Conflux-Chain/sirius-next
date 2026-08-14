# TODO / Handoff Backlog

> 更新时间：2026-08-13
>
> 本轮重建前，当前工作树和本地 Git refs 中没有历史
> `PROJECT_CONTEXT.md`、`ARCHITECTURE.md` 和 `TODO.md`。本文根据现有源码、
> `AGENTS.md`、`README.md`、`docs/` 和 changelog 临时重建，仅供交接；它不是
> 历史产品路线图，也不代表产品、排期或资源承诺。“待确认”事项必须由项目
> 负责人确认后才能转成正式任务。

项目背景和边界见 [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)，当前架构见
[ARCHITECTURE.md](./ARCHITECTURE.md)。

## 状态口径

- **已确认**：当前源码或仓库文档可以直接证明。
- **待确认**：缺少产品范围、旧仓库上下文或接口约定。
- **建议**：推荐的执行顺序，不等于已批准计划。

## 当前基线

- **已确认**：这是 ConfluxScan 下一代前端 pnpm workspace；`apps/core` 面向
  Core Space，`apps/evm` 面向 EVM，共享能力和翻译分别位于
  `packages/common`、`packages/i18n`。
- **已确认**：两个应用仍是 Vite 示例壳，不能据此认定应用迁移已经完成。
- **已确认**：迁移期间，`README.md` 仍要求旧 `sirius` / `sirius-eth` 通过
  软链接使用本仓库的共享包。
- **已确认**：calldata URL codec 与测试已完成但页面未接入；Simulate Trace
  请求/格式化 hook 已存在，当前类型明确排除 Core Space。

## 优先级 backlog

### P0：恢复范围与事实来源

- [ ] **待确认**：在旧仓库、其他分支或外部知识库中查找缺失的项目上下文、
      架构和历史 TODO；找回后逐条核对，不直接用本文覆盖。
- [ ] **待确认**：明确目标是共享包演进、逐页迁移还是完整替代旧应用，并确认
      Core/EVM 的先后顺序。
- [ ] **待确认**：为首个切片确认来源页面、路由、环境变量、接口前缀、网络、
      部署入口和验收人。
- [ ] 将结论补入正式上下文和架构文档，记录来源、日期、负责人及依赖。

**验收标准**

- 有明确的事实来源；首切片具备 in-scope / out-of-scope、接口依赖和验收人。
- Core/EVM 边界和迁移顺序不再依赖口头约定。

### P1（建议）：建立真实应用骨架

本节仅在 P0 确认本仓库需要承载真实应用迁移后成立，不代表该方向已经获批。

- [ ] 移除首个目标应用的计数器示例，建立真实路由和最小页面布局。
- [ ] 接入经 P0 确认的 i18n、网络/空间上下文、请求配置、样式与 provider。
- [ ] 明确开发、测试和构建配置来源，并提供路由、配置和接口失败状态。
- [ ] 应用专属逻辑留在 `apps/*`；跨应用能力继续从共享包正式入口复用。

**验收标准**

- 目标应用能独立启动、测试、lint、构建；真实路由可直接访问和刷新。
- 网络、语言初始化正确，且页面未复制已有公共能力。
- 若目标是完整迁移，最终不再依赖旧仓库手工软链接；否则记录保留原因和期限。

### P1（建议）：EVM Simulate Trace 端到端接入

建议将 `apps/evm` 的 Simulate Trace 作为首个纵向切片。重点是页面集成，
不是重写已有 codec、请求 hook 或 Trace 能力；是否执行仍以 P0 的范围确认
为前提。

#### URL decode 与错误守卫

- [ ] 从 `/simulate-trace` 读取 `data`，且只用 `decodeCalldataFromUrl` 解码。
- [ ] **待确认**：页面是否要求显式非空 `data`；据此决定是否使用
      `{ allowEmptyData: false }`。规范 `0x` 始终是有效空 calldata。
- [ ] 为 `missing`、`invalid-format`、`too-large` 提供可翻译的错误状态。
- [ ] 解码失败时硬停止 ABI 解码、gas estimate 和 RPC；不得继续使用原始值。

#### ABI、RPC、展示与链接

- [ ] 仅使用成功解码后的规范 `result.data` 做 ABI 解码和交易参数构造。
- [ ] 确认 `from`、`to`、`value`、block tag 和费用字段规则；它们不属于
      calldata codec。
- [ ] 复用 `useSimulateTrace` / `querySimulateTrace`，覆盖 loading、空结果、
      RPC 错误和 trace 展示。本切片不宣称支持 Core Space。
- [ ] 从确认的合约方法入口生成链接：调用 `encodeCalldataForUrl`，再用
      `URL` / `URLSearchParams` 设置参数；不得手工拼接或二次 Base64 编码。
- [ ] 保持旧 `0x...` 链接兼容，不改变 `0x`、`b1.`、`d1.` 的既有含义。

#### 回归测试与验收

- [ ] 覆盖历史 Hex、`b1.`、`d1.`、`0x`、选定的 missing 规则、非法格式和
      超限输入；断言所有失败分支的 RPC 请求次数为零。
- [ ] 覆盖生成链接后的 round trip，并确认 `to`、`value` 未被 codec 改写。
- [ ] 保留公共包已有 256/257 字节、1 MiB、损坏压缩流和压缩炸弹测试；页面
      测试不重复底层算法用例。
- [ ] 有效的三种格式进入同一 ABI/RPC 流程；生成链接可刷新、分享和还原。
- [ ] 专项测试、目标应用测试、lint、build 通过；可见 UI 变更附截图。

### P2：处理源码中已确认的 TODO

- [ ] `useSimulateTrace.ts`：使用真实 log index 并排序。先确认接口字段、嵌套
      call 的全局顺序、缺失索引回退和同索引稳定排序。
- [ ] `evmTransactionAction.tsx`：仅在所有 EVM API、网络、缓存和旧响应均确认
      使用 Hex address map key 后，移除 `convertMapKeysToHex` 兼容层。
- [ ] `ga.ts`：评估 GA `userId` 绑定 Portal 地址。先确认产品目的、用户同意、
      隐私要求，以及地址切换/断开行为；未确认前不实现。
- [ ] `index.test.ts`：恢复或重写 `formatNumber` precision 用例。先确认舍入语义，
      再判断只补测试还是修复实现。
- [ ] `utils/index.ts`：评估 `formatNumber` 尚未支持的舍入模式、整数位精度和
      负数格式化，以及数值输入对负数/科学计数法的配置支持；先拆分需求与兼容
      样本，不把注释一次性扩成无边界重构。
- [ ] `components/Text/index.tsx`：评估移动端 tooltip 按文本长度动态设宽，解决
      固定字符数截断完整单词的问题；需要多语言和窄屏视觉回归。
- [ ] `utils/constants.ts`：确认 `setNFTCacheInfo` cache key 与 `GlobalTip` 注释是否
      仍对应现行需求；若已过时则单独清理，若仍有效则补充可执行范围与验收。

**验收标准**

- 每项都有可追溯的接口/产品结论与针对性回归测试。
- 兼容代码只在上游契约稳定且旧数据路径验证后移除；分析标识改动须先完成
  项目适用的隐私确认。

### P2：质量门禁

- [ ] 每项改动先运行最小相关 Vitest；可行时再运行根目录 `pnpm test`。
- [ ] 合入前运行受影响 workspace 的 lint/build；跨 workspace 改动运行
      `pnpm lint`、`pnpm build`。
- [ ] parsing、formatting、request 或 UI 逻辑改动必须增加回归测试。
- [ ] 修改可发布 package 时按仓库约定创建 changeset；可见 UI 变更附截图。
- [ ] PR 说明改动、测试、关联问题和限制；使用 Conventional Commit，并创建
      ready-for-review PR，不创建草稿。

## 已完成 / 不应重复做

- **已完成**：`calldataUrl.ts` 支持 Hex、`b1.` Base64URL、`d1.` raw DEFLATE；
  已有参考向量、round trip、非法输入、边界和压缩流安全测试。
- **已完成**：`packages/common/docs/` 下两份 calldata 文档已记录协议和页面
  接入约束。
- **已完成**：公共包已有 EVM Simulate Trace 请求、gas estimate、格式化和
  SWR hook 基础能力。
- **不要重复做**：页面不得另建 codec、改变前缀语义或绕开 1 MiB 限制。
- **不要误判**：共享包功能完成不等于两个应用页面迁移完成。

## 建议的迁移完成定义

以下 Definition of Done 仍需负责人确认：

- 两个应用不再是示例壳，已承接双方确认的页面与路由。
- 应用能独立启动、测试、lint、构建，并有环境和部署说明。
- 应用/共享边界清晰；关键页面具备 loading、空状态、错误状态和回归测试。
- 旧仓库依赖已移除，或明确记录为保留依赖。
- `README.md`、项目上下文、架构和 TODO 与代码一致；发布和回滚流程已验证。

## 主要风险

| 风险                       | 当前证据                    | 控制方式                   |
| -------------------------- | --------------------------- | -------------------------- |
| 历史范围丢失               | 缺少上下文、架构和历史 TODO | 先恢复事实来源再批准范围   |
| 共享包完成被误判为应用完成 | 两个 `App.tsx` 仍是示例     | 以真实路由端到端验收       |
| 旧仓库耦合不清             | `README.md` 要求软链接      | 盘点调用方和退出条件       |
| Simulate 能力被外推        | 当前不支持 Core             | 首切片限定 EVM             |
| API 兼容代码误删           | address/log index 有 TODO   | 用真实响应和契约测试保护   |
| 非法 calldata 触发请求     | 页面尚无 guard              | 解码失败硬停止并断言零请求 |
| URL 协议破坏               | 已存在三种格式              | 保持语义和 round-trip 测试 |
| GA 地址标识隐私风险        | TODO 无合规前提             | 确认前不绑定地址           |

## 建议顺序

1. 恢复并确认事实来源。
2. 在 `apps/evm` 建立最小真实应用骨架。
3. 完成 decode → guard → ABI/RPC → trace UI → link generation 纵向切片。
4. 用首切片沉淀迁移模板，再决定 Core 与其他页面顺序。
5. 前置条件明确后逐项处理源码 TODO，避免扩大首切片范围。

## 维护规则

- 新条目标明“已确认 / 待确认 / 建议”，并附源码、文档、issue 或决策链接。
- 完成时记录 PR、测试命令和遗留限制；范围变化时先更新事实来源。
- 找回历史 TODO 后逐项对照合并，不让本临时文档覆盖历史路线图。
