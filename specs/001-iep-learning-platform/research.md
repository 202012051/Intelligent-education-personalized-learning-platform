# Research & Technical Decisions: 智能教育个性化学习平台

**Date**: 2026-06-01
**Source**: 04-plan.md 技术方案 + spec.md 需求规范

## Decision Log

### D-01: 后端框架 — Spring Boot 3.2.5 + MyBatis 3.0.3

- **Decision**: 采用 Spring Boot 3.2.5 作为 REST API 框架，MyBatis 3.0.3 作为 ORM
- **Rationale**: 团队熟悉度高（侯其东），Spring Boot 生态成熟。MyBatis 比 JPA 更灵活，适合复杂查询。模块化单体架构无需 JPA 的级联/懒加载等高级特性。
- **Alternatives considered**:
  - FastAPI (Python): 排除，团队更熟悉 Java 生态
  - JPA/Hibernate: 排除，知识图谱 JSON 字段和复杂连表查询 MyBatis 更直观

### D-02: 前端框架 — React 18 + TypeScript + Ant Design 5 + Zustand

- **Decision**: React 18 SPA + TypeScript 5.x + Ant Design 5.x + Zustand 4.x 状态管理
- **Rationale**: Ant Design 提供成熟的中后台组件（表格、图表、表单），降低 UI 开发量。Zustand 比 Redux 更轻量，API 简洁，符合"简单优先"原则。TypeScript 提供类型安全。
- **Alternatives considered**:
  - Vue 3: 排除，团队更熟悉 React（刘家齐）
  - Redux Toolkit: 排除，Zustand 更轻量，MVP 阶段够用

### D-03: 知识图谱存储 — MySQL JSON 字段

- **Decision**: 知识图谱节点和关系使用 MySQL 的 JSON 类型字段存储（`knowledge_point` 表 + `knowledge_relation` 表）
- **Rationale**: "简单优先"原则，不引入 Neo4j 等图数据库降低运维复杂度。MVP 仅 1 门课程，图谱规模小（<50 节点），JSON 字段可满足。
- **Alternatives considered**:
  - Neo4j: 排除，两周周期引入新数据库增加集成风险
  - 单独 JSON 文件: 排除，无事务保障和并发控制

### D-04: 推荐算法 — Java 内嵌规则引擎 + 贪心策略

- **Decision**: 算法逻辑在 Spring Boot 服务层用 Java 实现（非独立算法服务），MVP 阶段使用贪心策略
- **Rationale**: "简单优先" + "MVP 优先"。规则引擎兜底（>70% 阈值判定），贪心策略先行（薄弱优先+先修检查），不引入 ML 模型。算法内嵌在 Java 代码中，不需要 FastAPI/Flask 独立服务。
- **Alternatives considered**:
  - FastAPI 独立算法服务: 排除，增加部署复杂度和网络调用延迟
  - ML 模型 (scikit-learn): 排除，MVP 优先验证业务闭环，再优化算法精度
  - Neo4j 图算法: 排除，已决定不用 Neo4j

### D-05: 认证方案 — JWT + BCrypt

- **Decision**: JWT Bearer Token 认证，24h 过期，BCrypt 10 rounds 密码加密
- **Rationale**: 无状态认证，适合 RESTful API。JJWT 库轻量。BCrypt 不可逆，符合安全要求。
- **Alternatives considered**:
  - Session-based: 排除，有状态增加服务器负载，不适合扩展
  - OAuth2/SSO: 排除，MVP Out of Scope

### D-06: 缓存策略 — Redis 7

- **Decision**: Redis 存储 JWT 黑名单（登出管理）、热点数据（课程信息、知识图谱结构）
- **Rationale**: JWT 登出需要黑名单机制。课程和知识图谱结构不常变，适合缓存加速。
- **Alternatives considered**: 不引入缓存（纯 MySQL）— 排除，JWT 黑名单需要，且图谱数据频繁查询影响性能

### D-07: 构建与部署 — Vite + Maven

- **Decision**: 前端 Vite 5 构建，后端 Maven 构建。本地开发 Vite Proxy 到 Spring Boot。
- **Rationale**: Vite 热更新快，Maven 依赖管理成熟。MVP 用本地 Docker Compose 运行 MySQL + Redis。
- **Alternatives considered**: Webpack — 排除，Vite 对 ES Module 支持更好，开发体验更佳

### D-08: 测试策略

- **Decision**: JUnit 5 + Mockito (后端), Vitest + React Testing Library (前端), 目标覆盖率 ≥ 70%
- **Rationale**: 宪章要求单元测试覆盖率 ≥ 70%，端到端核心流程无阻断 Bug。JUnit 5 是 Java 标准，Vitest 对 Vite 生态原生支持更好。
- **Alternatives considered**: Jest — 排除，Vitest 与 Vite 配置共用，无需额外配置
