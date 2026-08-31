# TODO / Handoff Backlog

> 更新时间：2026-08-28
>
> 本文在前轮交接时根据现有源码、`AGENTS.md`、`README.md`、`docs/` 和 changelog
> 重建，后续按源码与验证结果增量更新，仅供交接；它不是历史产品路线图，也不代表
> 产品、排期或资源承诺。“待确认”事项必须由项目负责人确认后才能转成正式任务。
> 本文当前记录已确认的 package-first、scan-first 增量迁移方案。

项目背景和边界见 [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)，当前架构见
[ARCHITECTURE.md](./ARCHITECTURE.md)，三仓库路径和迁移规则见
[CROSS_REPO_CONTEXT.md](./CROSS_REPO_CONTEXT.md)。

## 状态口径

- **已确认**：当前源码或仓库文档可以直接证明。
- **待确认**：缺少产品范围、旧仓库上下文或接口约定。
- **建议**：推荐的执行顺序，不等于已批准计划。

## 当前基线

- **已确认**：这是 ConfluxScan 下一代前端 pnpm workspace；`apps/core` 面向
  Core Space，`apps/evm` 面向 EVM，共享能力和翻译分别位于
  `packages/common`、`packages/i18n`。
- **已确认**：两个应用仍是 Vite 示例壳，不能据此认定应用迁移已经完成。
- **已确认**：当前不把 scan 页面迁入本仓库；Core Space 和 eSpace 继续在各自
  的 scan 项目中维护页面、Space 特有逻辑和独立部署。
- **已确认**：迁移主线是从 scan 旧代码抽取通用组件和逻辑到 next 包，再在
  scan 项目中替换旧实现，重复该过程，最后才评估页面部署的整体迁移。
- **已确认**：迁移期间，`README.md` 要求旧 `sirius` / `sirius-eth` 通过
  软链接使用本仓库的共享包；这属于当前集成流程，不是新 app 完成前的临时方案。
- **已确认**：当前 Codex 工作区可以同时访问 `sirius-next`、`sirius` 和
  `sirius-eth`；两个 scan 仓库默认作为只读参考和消费方，除非任务明确授权修改。
- **已确认**：calldata URL codec 与测试已完成，`sirius-eth` 已在 Simulate
  页面和 Contract ABI 方法入口接入；Core Space scan 与 `apps/*` 尚未接入。
- **已确认**：Simulate Trace 请求/格式化 hook 已被 `sirius-eth` 的 Simulate
  页面使用，当前类型明确排除 Core Space；真实日志索引和排序仍待确认接口契约。
- **已确认**：common 的 React、Router、i18n 上下文依赖已改为 peer dependency，
  root/common 的直接测试运行器统一为 Vitest 3.2.3，common 的 Jest 配置及直接
  Jest 依赖已删除。
- **已确认**：request timeout/Abort 和 pubsub 取消订阅回归已修复并有相邻测试；
  两个 scan 本轮未修改，真实消费验证仍未完成。
- **已确认**：peer dependency 迁移的 changeset 使用 `minor`，适配 `0.x` 版本下
  安装契约变化，不再按 patch 发布。
- **已确认**：pubsub 使用 `Map` 保存事件订阅，并覆盖 `toString`、`constructor`、
  `__proto__` 等原型属性同名事件。
- **已确认**：root 通过 Turborepo 调用各 package 自己的 `test`/
  `test:coverage` 脚本；common 使用 package-local `vitest.config.ts` 和 V8 覆盖率，
  不应恢复根目录 `src -> common/src` alias。
- **已确认**：本轮已补充 cache TTL/失败重试、`window.CFX` 缺失、Zustand map 合并、
  SDK Core/EVM client、ABI fallback/loading/error priority 和 EVM Simulate Trace
  回归测试；Simulate Trace 日志真实索引仍未实现。

### 本轮验证结果（2026-08-28）

- **已确认**：`pnpm test`、`pnpm test:coverage`：21 个测试文件、332 个测试通过；
  lines/statements 24.84%、branches 74.23%、functions 41.63%。
- **已确认**：`pnpm build`、`pnpm lint`、`pnpm test:consumers`、common `tsc --noEmit`、
  Prettier 检查和 `git diff --check` 通过。
- **已知 warning**：`useTableData` 测试仍输出 React `act(...)` warning，但当前不
  阻塞测试通过；未在本轮扩大为页面级修复。

## 优先级 backlog

### P0：建立首个公共能力迁移切片

- [x] **已确认**：当前阶段采用 package-first、scan-first 方案；scan 保持页面
      和独立部署，next 包逐步承接公共能力。
- [ ] **待确认**：盘点 scan 项目中的候选公共模块，记录实现位置、所有调用方、
      Core/EVM 差异、现有测试和线上影响。
- [ ] **待确认**：为首个模块确认来源仓库、分支、负责人、in-scope/out-of-scope、
      接口和验收标准。
- [ ] **待确认**：确认 scan 消费 next 包的版本策略（软链接、发布包或其他方式）、
      替换期间的回滚方式，以及 scan 侧构建/部署验证入口。
- [ ] 将上述结论补入正式上下文和架构文档，记录来源、日期、负责人及依赖。

**验收标准**

- 有明确的事实来源；首个公共模块具备 in-scope / out-of-scope、接口依赖、
  兼容策略、回滚方式和验收人。
- Core/EVM 边界、scan 消费方式和首个模块的迁移顺序不再依赖口头约定。
- scan 在迁移前后都能独立构建、验证和部署。

### P1（建议）：抽取并替换首个公共模块

本节不要求建立新 app 页面，重点是完成一次可回滚的公共能力替换闭环。

- [ ] 在 `packages/common` 或其他合适的 `packages/*` 中实现或重构公共能力，
      明确 `space` 分支、运行时初始化和旧消费者兼容边界。
- [ ] 为迁移的解析、格式化、请求或组件逻辑补充相邻 Vitest；必要时先为旧
      行为建立回归测试，再进行优化。
- [ ] 在对应 scan 项目中替换旧实现为 next 包引用，保留页面和 Space 特有逻辑
      在 scan 内部。
- [ ] 验证 scan 的功能、错误/空状态、构建和独立部署；发现问题时可快速回滚
      到旧实现。
- [ ] 修改可发布 package 时创建 Changeset，并记录公共 API、迁移方式、测试
      命令和遗留限制。

**验收标准**

- next 包中的公共实现和 scan 侧替换均有可追溯的测试与变更记录。
- scan 页面行为与迁移前保持一致，且仍能独立构建、验证和部署。
- 旧实现已删除、隔离或明确记录保留原因，不新增重复的公共逻辑。

### P1（建议）：修复公共包消费边界与基础设施回归

- [x] 将 React、ReactDOM、React Router、i18next 和 react-i18next 等上下文相关
      运行时依赖声明为宿主可提供的 peer dependency，并保留本地构建/测试所需的
      dev dependency；版本范围已覆盖 `sirius` 与 `sirius-eth` 当前版本。
- [x] 增加发布包 consumer smoke test：使用两个 scan 当前依赖版本，在其 Router
      和 i18n Provider 下渲染打包后的 common hook/component，确认不会解析出第二份
      上下文实例。
- [ ] 将两个 scan 升级到包含上述 peer dependency 修复的 common 发布版本，并
      完成真实安装、构建和页面验证。
- [ ] 为 consumer 边界补充 strict peer semver 失败路径验证；当前脚本使用临时
      packed fixture 和手动依赖链接，能验证运行时单例与渲染，但不会让包管理器实际
      解析“不满足 peer range”的失败。
- [x] 已补充 `pubsub.ts` 的取消订阅顺序、自取消、重复订阅、幂等取消和原型属性
      同名事件回归测试，并修复下标失效及普通对象原型键冲突问题。
- [x] 已补充 `request.ts` 的 timeout/Abort 通知测试，并确保一次超时只产生一个用户
      可见错误通知。
- [x] 已补充 `fetchWithCache` 的 TTL/过期和 rejected Promise 重试测试。
- [x] 已补充 `rpcRequest` 在 `window.CFX` 可用/缺失时的成功与错误通知测试。
- [x] 已补充 Zustand ENS、nametag/contract cache 合并和环境 setter 保留 action
      的测试。
- [x] 已补充 SDK `estimateGas`、`simulateContract`、环境配置和按 Space client
      cache 的测试。
- [x] 已补充两个 ABI decode hook 的 ABI fallback/loading/error priority 测试，以及
      `useSimulateTrace` 的嵌套、代理、创建、失败、ABI 解析和 gas 估算失败测试；不含
      当前接口未提供的日志真实索引测试。
- [ ] 若其他 workspace package 需要测试，为该 package 新增本地 Vitest 配置、`test`
      和可选 `test:coverage` 脚本；不要用根配置 alias 兜底。

**验收标准**

- next 包的打包 consumer 已能模拟 `sirius` 和 `sirius-eth` 并正确读取 Router、
  i18n 上下文；发布后两个 scan 仍需完成真实版本升级验证。
- 基础设施修复不改变 Core/EVM 现有请求响应、错误展示和页面行为。

### P1（建议）：重复公共能力迁移循环

- 首个模块完成后，按影响范围、复用价值、Space 差异和风险选择下一项。
- 每项都重复“盘点 → 抽取/优化 → 公共包测试 → scan 替换 → scan 验证/部署”
  的流程。
- 优先迁移边界清晰的组件、纯函数、请求适配和数据格式化逻辑；页面编排、
  路由和 Space 特有逻辑继续留在 scan。
- 逐步清理旧实现和历史问题，但不要把无关的全局重构混入单次迁移。
- 当 scan 主要剩余页面和 Space 特有逻辑时，再由负责人确认整体页面部署迁移
  的范围、顺序和 Definition of Done。

#### 现有能力接入时的约束

- **已确认**：`sirius-eth` 的页面只使用 `decodeCalldataFromUrl` 和
  `encodeCalldataForUrl`；后续接入不得另建 codec、改变前缀语义或绕开 1 MiB 限制。
- **已确认**：`sirius-eth` 的 Simulate Trace 页面复用既有 hook/request 能力；
  Core Space 和未确认的 tracer 支持范围仍不在当前接入范围。
- **待接入**：Core Space scan 与 `apps/*` 如以后接入，必须先补页面行为、错误
  停止和 RPC 前置校验测试，再更新本条状态。
- [ ] 公共包变更继续保留既有边界、非法输入、压缩流安全和 round-trip 测试，
      scan 侧只补页面行为和集成回归，不重复底层算法用例。

### P2：处理源码中已确认的 TODO

以下事项应在相关公共能力已有 scan 消费方验证后处理，避免脱离真实消费者
契约进行兼容层清理或无边界重构。

- [ ] `useSimulateTrace.ts`：当前消费者是 `sirius-eth` Simulate 页面。使用真实
      log index 并排序前，先确认接口字段、嵌套 call 的全局顺序、缺失索引回退和
      同索引稳定排序，并补充真实 trace fixture。
- [ ] `evmTransactionAction.tsx`：当前消费者是 EVM scan。仅在所有 EVM API、网络、
      缓存和旧响应均确认使用 Hex address map key 后，移除 `convertMapKeysToHex`
      兼容层。
- [ ] `ga.ts`：评估 GA `userId` 绑定 Portal 地址。先确认产品目的、用户同意、
      隐私要求，以及地址切换/断开行为；未确认前不实现。
- [ ] `index.test.ts`：恢复或重写 `formatNumber` precision 用例。先确认舍入语义，
      再判断只补测试还是修复实现。
- [ ] `utils/index.ts`：评估 `formatNumber` 尚未支持的舍入模式、整数位精度和
      负数格式化，以及数值输入对负数/科学计数法的配置支持；先拆分需求与兼容
      样本，不把注释一次性扩成无边界重构。
- [ ] `utils/index.ts`：为 `isSafeNumberOrNumericStringInput` 补充当前“非负十进制
      输入”语义的测试；是否支持负数和科学计数法必须由实际表单调用方确认。
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
- [ ] 合入前运行受影响 workspace 的 lint/build；跨 package 改动运行
      `pnpm lint`、`pnpm build`，并按需运行 scan 项目的检查。
- [ ] parsing、formatting、request 或 UI 逻辑改动必须增加回归测试。
- [ ] 修改可发布 package 时按仓库约定创建 changeset；可见 UI 变更附截图。
- [ ] scan 替换公共能力时记录迁移前后行为、构建/部署验证和回滚方式。
- [ ] PR 说明改动、测试、关联问题和限制；使用 Conventional Commit，并创建
      ready-for-review PR，不创建草稿。

## 已完成 / 不应重复做

- **已完成**：`calldataUrl.ts` 支持 Hex、`b1.` Base64URL、`d1.` raw DEFLATE；
  已有参考向量、round trip、非法输入、边界和压缩流安全测试。
- **已完成**：`packages/common/docs/` 下两份 calldata 文档已记录协议和页面
  接入约束；`sirius-eth` 已完成实际页面消费，Core scan 与 `apps/*` 仍未接入。
- **已完成**：公共包已有 EVM Simulate Trace 请求、gas estimate、格式化和
  SWR hook 基础能力。
- **已完成**：`request.ts` 已覆盖超时/直接 abort 的通知去重；`pubsub.ts` 已使用
  Map 修复原型键冲突和取消订阅下标失效，并覆盖顺序、自取消、重复订阅和幂等取消。
- **已完成**：root/common 已统一使用 Vitest 3.2.3；common 的 Jest 配置和直接
  Jest 测试依赖已删除。lint preset 带来的间接 Jest 包不代表仍有 Jest 测试配置。
- **已完成**：common 已建立 V8 coverage 基线，补齐 cache、RPC、store、SDK、ABI
  decode 和 Simulate Trace 的相邻回归；这些是 common 单元覆盖，不等于 scan 页面或
  端到端覆盖。
- **已完成**：根测试编排通过 Turbo 走 package-local 配置；后续非 common package
  必须自行提供测试脚本和配置。
- **已完成（仅契约注释）**：Text 移动端 tooltip、数值格式化/输入、GA userId 和
  local storage key 的注释已记录当前消费者约束；这些条目仍需按真实调用方确认，
  不应重复实现为未经批准的行为变更。
- **不要重复做**：页面不得另建 codec、改变前缀语义或绕开 1 MiB 限制。
- **不要重复做**：当前阶段不要为了迁移公共能力而在 `apps/core` 或 `apps/evm`
  建立 scan 完整页面。
- **不要误判**：共享包功能完成不等于 scan 旧逻辑已经替换完成；必须在 scan
  消费方完成行为、构建和部署验证。
- **不要随意修改**：cache 的过期/失败重试、`window.CFX` 错误通知与重抛、SDK 按
  Space 缓存和环境 fallback、Zustand 嵌套 map 合并、ABI fallback 优先级及
  Simulate Trace 的 EVM-only 边界；修改前先更新相邻回归测试和消费者验证。

## 建议的迁移完成定义

以下是增量公共能力迁移阶段的 Definition of Done；整体页面部署迁移仍需
负责人另行确认：

- 每个迁移模块都有明确的公共/页面/Space 特有边界和消费者清单。
- 公共实现有相邻测试、类型和必要的 Changeset；scan 侧已替换旧引用。
- Core Space 和 eSpace 的 scan 项目仍能独立构建、验证和部署，关键行为没有
  回归。
- 旧公共实现已删除、隔离或明确记录保留原因及后续清理条件。
- 多轮迁移后，scan 主要剩余页面编排和 Space 特有逻辑，并由负责人确认是否
  启动页面部署整体迁移。
- `README.md`、项目上下文、架构和 TODO 与代码一致；发布和回滚流程已验证。

## 主要风险

| 风险                         | 当前证据                               | 控制方式                             |
| ---------------------------- | -------------------------------------- | ------------------------------------ |
| 迁移范围和首项选择不清       | scan 旧代码尚未完成公共能力盘点        | 先建立消费者、差异和验收清单         |
| 公共包改动破坏旧 scan        | next 包由多个旧项目消费                | 保持兼容、补测试、保留回滚路径       |
| 发布包解析出多份运行时上下文 | 旧版 common 仍可能被 scan 锁定         | 发布 peer 修复版并完成 scan 升级验证 |
| 只完成包却未替换旧逻辑       | 公共实现与 scan 页面分属不同仓库       | 以 scan 构建、部署和行为验证为准     |
| Space 差异被错误抽象         | Core/EVM 地址和 SDK 语义不同           | 使用 `space` 分支或链适配器          |
| 迁移工作变成无边界重构       | 源码存在多项历史 TODO                  | 每次限定模块和验收标准               |
| Simulate 能力被外推          | 当前仅由 eSpace scan 消费，不支持 Core | 接入范围限定为已确认的 EVM 场景      |
| 非法 calldata 触发请求       | 页面接入时需要前置 guard               | 解码失败硬停止并断言零请求           |
| URL 协议破坏                 | 已存在三种格式                         | 保持语义和 round-trip 测试           |
| GA 地址标识隐私风险          | TODO 无合规前提                        | 确认前不绑定地址                     |

## 建议顺序

1. 盘点 scan 旧代码，确定首个边界清晰、复用价值高的公共模块。
2. 明确模块范围、Space 差异、消费者、版本策略、回滚方式和验收人。
3. 在 next 包中抽取/优化并补测试、类型和 Changeset。
4. 在对应 scan 项目中替换旧引用，完成行为、构建、部署验证。
5. 重复公共能力迁移循环，并逐项处理有真实契约依据的源码 TODO。
6. 当 scan 主要剩余页面和 Space 特有逻辑后，再确认整体页面部署迁移方案。

## 维护规则

- 新条目标明“已确认 / 待确认 / 建议”，并附源码、文档、issue 或决策链接。
- 完成时记录 PR、测试命令和遗留限制；范围变化时先更新事实来源。
- 每次提交代码前，先检查 diff 并同步受影响的 README、项目上下文、架构和本文件；
  文档同步完成后再 commit，避免提交后遗留失真的命令、基线、状态或风险描述。
- 找回历史 TODO 后逐项对照合并，不让本临时文档覆盖历史路线图。
