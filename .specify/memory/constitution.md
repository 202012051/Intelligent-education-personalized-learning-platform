<!--
  Sync Impact Report
  ==================
  Version change: N/A → 1.0.0 (initial release from 01-constitution.md)
  Modified principles: N/A (all new)
  Added sections:
    - Core Principles (5 principles: 千人千面, MVP优先, 数据驱动隐私优先, 契约先行, 简单优先)
    - 开发纪律 (Development Discipline)
    - 团队与项目约束 (Team & Project Constraints)
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md: ✅ No changes needed (Constitution Check gate is generic)
    - .specify/templates/spec-template.md: ✅ No changes needed
    - .specify/templates/tasks-template.md: ✅ No changes needed
    - .specify/templates/checklist-template.md: ✅ No changes needed
  Follow-up TODOs: None
  Source: 01-constitution.md (智能教育个性化学习平台)
-->

# 智能教育个性化学习平台 Constitution

## Core Principles

### I. 千人千面 — 个性化学习路径（NON-NEGOTIABLE）

每个学习者 MUST 拥有基于自身认知状态、知识薄弱点和学习风格定制的个性化学习路径，
而非统一的课程大纲。

- 系统 MUST 在学习者首次使用时完成认知诊断，据此生成初始学习路径。
- 学习路径 MUST 随学习行为数据持续动态调整，而非静态固化。
- 推荐内容 MUST 基于学习者当前的知识掌握状态，禁止采用"一刀切"的课程排序。
- 个性化维度 MUST 至少包含：知识点掌握度、学习风格偏好、历史答题表现。

**理由**: 平台的核心价值主张是"千人千面"，个性化能力是区别于传统教育平台的根本差异。

### II. MVP 优先 — 先"能用"再"好用"

MVP 阶段优先交付核心功能闭环（测评 → 诊断 → 推荐 → 学习），算法优雅迭代而非一步到位。

- 核心闭环 MUST 在 2026-06-11 前端到端可运行演示。
- 功能 Scope MUST 只减不增，非核心功能移入二期规划。
- 算法策略 MUST 遵循：规则引擎兜底 → 贪心策略先行 → ML 模型优化后续，不得跳过验证步骤。
- 每周 MUST 评估进度风险，及时砍需求而非延期。

**理由**: 两周冲刺周期不允许过度设计和一次完美，先验证业务可行性再迭代优化。

### III. 数据驱动但隐私优先

学习行为数据是推荐精准度的基石，但采集和存储 MUST 符合隐私保护法规。

- 所有用户学习行为数据 MUST 脱敏后存储，不得明文记录用户真实身份与隐私信息。
- 数据采集 MUST 遵循最小必要原则，只采集与学习推荐直接相关的行为数据。
- 用户密码 MUST 使用 BCrypt 加密存储，不可逆。
- 所有受保护接口 MUST 携带有效 JWT Token 方可访问。

**理由**: 数据是引擎的燃料，但用户隐私是不可逾越的法律和道德红线。

### IV. 契约先行，接口即文档

前后端通过明确的接口契约并行开发，减少联调阻塞和沟通成本。

- 所有 API MUST 通过 Swagger/OpenAPI 3.0 规范定义，自动生成可交互文档。
- 前后端协作 MUST 遵循"先定契约，后写代码"流程：定义接口 → 双方确认 → 并行实现。
- 接口变更 MUST 先行更新契约文档并通知对方，禁止单方面修改已约定接口。
- API 响应格式 MUST 统一为 JSON，错误返回 MUST 包含可读的错误码和提示信息。

**理由**: 4 人团队前后端并行开发，接口契约是唯一协作锚点，缺乏契约将导致联调混乱。

### V. 简单优先，够用就好（NON-NEGOTIABLE）

技术选型以团队熟悉度和当前阶段需求为第一优先级，不引入不必要的复杂度。

- 架构 MUST 采用模块化单体（Modular Monolith），按业务域分包，禁止引入微服务。
- 知识图谱 MVP 阶段 MUST 使用 MySQL + JSON 字段存储，禁止引入 Neo4j 等专用图数据库。
- 能用规则引擎解决的问题 MUST 不引入机器学习模型，能用 JSON 文件不适配复杂存储。
- 核心模块单元测试覆盖率 MUST ≥ 70%，端到端核心流程无阻断性 Bug。
- 任何增加基础设施复杂度的提案 MUST 有明确的业务必要性论证。

**理由**: 两周周期内引入过多技术组件将显著增加集成风险和调试成本，简单方案更可靠。

## 开发纪律

### 分支与协作

- 每个模块 MUST 从 `dev` 分支拉取独立 Feature Branch 开发。
- PR 合并 MUST 至少 1 人 Review 通过。
- 每 3 天一次站会（周一/周四 21:00），微信群随时同步进度。

### Commit 规范

- 格式 MUST 为 `[模块编号] 简要描述`，如 `[M01] 实现邮箱注册接口`。
- 禁止超大 Commit（单次超过 500 行变动需拆分）。

### 质量优先级

- 联调阶段发现 Bug MUST 优先修复，不做新功能。
- 演示版本 MUST 端到端可运行，核心路径无阻断。

### 不延期纪律

- 2026-06-11 前 MUST 交付可演示 MVP，Scope 只减不增。
- 任何可能影响交付日期的风险 MUST 在发现后 24 小时内同步到团队。

## 团队与项目约束

### 项目身份

| 属性 | 值 |
|------|---|
| 项目代号 | IEP-2026 |
| 团队编号 | 009 组 |
| 项目周期 | 2026-05-28 ~ 2026-06-11 |

### 技术决策

| 编号 | 决策 | 理由 |
|------|------|------|
| DC-1 | 后端 Spring Boot + MyBatis，前端 React + TypeScript | 团队熟悉度高，生态成熟 |
| DC-2 | 模块化单体架构 | 两周周期不允许过度设计 |
| DC-3 | 知识图谱 MVP 用 MySQL + JSON | 降低基础设施复杂度 |
| DC-4 | 算法：规则引擎 + 贪心推荐优先 | 先验证业务闭环，再优化算法精度 |
| DC-5 | JWT 认证 + BCrypt 密码加密 | 无状态、安全、标准方案 |

### 不可妥协

- 用户密码 MUST 使用 BCrypt 加密存储，不可逆。
- 所有受保护接口 MUST 携带有效 JWT Token。
- 学习数据 MUST 脱敏后存储，不得明文记录用户隐私。
- 2026-06-11 演示版本 MUST 端到端可运行。

## Governance

本宪章为智能教育个性化学习平台项目的最高准则文件，任何技术选型、需求变更或开发决策不得违反上述宪法条款。

- **修订流程**: 宪章修改需由项目负责人（侯其东）发起，经团队全体成员评审并达成共识后方可生效。修订内容 MUST 记录在 Git 提交历史中并附摘要说明。
- **版本策略**: 遵循语义化版本 (MAJOR.MINOR.PATCH)。原则的增删或重新定义为 MAJOR 变更；新增章节或显著扩展指导内容为 MINOR 变更；文字修订和澄清为 PATCH 变更。
- **合规审查**: 每个 PR Review MUST 检查是否符合宪章中的技术原则（如是否引入了不必要的微服务、是否使用了未经约定的技术组件）。Plan 阶段的 Constitution Check 门禁 MUST 逐条验证设计是否符合五项核心原则。
- **项目周期约束**: 本宪章在项目周期内（2026-05-28 ~ 2026-06-11）适用。项目结束后可作为后续迭代的参考基线。
- **冲突裁决**: 当原则间产生冲突时，优先级为：III. 隐私优先 > V. 简单优先 > I. 个性化 > II. MVP 优先 > IV. 契约先行。

**Version**: 1.0.0 | **Ratified**: 2026-06-01 | **Last Amended**: 2026-06-01
