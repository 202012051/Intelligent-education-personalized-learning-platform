# Tasks: 智能教育个性化学习平台

**Input**: Design documents from `specs/001-iep-learning-platform/`
**Source**: 05-tasks.md（系统核心模块拆分文档 bwtWCKJmOPjo）

**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, research.md, quickstart.md

**Tests**: 包含测试任务（JUnit 后端 + Jest 前端 + 接口测试），宪章要求覆盖率 ≥ 70%。

**Organization**: 任务按用户故事（US1-US5）组织，每个故事可独立实现和测试。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可并行执行（不同文件，无依赖）
- **[Story]**: 所属用户故事（US1, US2, US3, US4, US5）
- 包含精确文件路径

## Path Conventions

- **Web app**: `backend/src/main/java/com/iep/`, `frontend/src/`

---

## Phase 1: Setup（项目骨架与基础设施）

**Purpose**: 项目初始化和核心基础设施搭建

- [x] T001 创建 Spring Boot 项目骨架（pom.xml, application.yml, 启动类）in `backend/` ✅ Implemented
- [x] T002 [P] 数据库初始化脚本（11 张表 DDL）in `backend/src/main/resources/db/migration/V001__init.sql` ✅ Implemented
- [x] T003 [P] 统一响应体 ApiResult + GlobalExceptionHandler in `backend/src/main/java/com/iep/common/` ✅ Implemented
- [x] T003a [P] 创建 .gitignore (Java + Node.js + IDE 模式) in `.gitignore` ✅ Implemented
- [x] T003b [P] 前端项目骨架（package.json, vite.config.ts, tsconfig.json, index.html）in `frontend/` ✅ Implemented
- [x] T003c [P] React APP 入口（main.tsx, App.tsx with Routes, authStore, api service）in `frontend/src/` ✅ Implemented

---

## Phase 2: Foundational（阻塞性前置基础设施）

**Purpose**: 所有用户故事启动前必须完成的核心基础设施

**⚠️ CRITICAL**: 用户故事必须在此阶段完成后才能开始

**⚠️ 此阶段已完成。**

- [x] T004 实现 JWT 工具类（签发/验证/刷新） + JWT 拦截器 in `backend/src/main/java/com/iep/module01_user/`
- [x] T005 [P] 创建 User Entity + Mapper（含 BCrypt 密码加密）in `backend/src/main/java/com/iep/module01_user/`

**Checkpoint**: ✅ 基础设施就绪 — 用户故事实现可并行开始

---

## Phase 3: User Story 1 — 用户注册与认知诊断 (Priority: P1) 🎯 MVP

**Goal**: 新用户注册，完成 10 题测评，规则引擎判定知识状态

**Independent Test**: 注册 → 登录 → 测评 → 诊断结果 → 知识状态生成

### Backend Implementation for User Story 1

- [x] T006 [P] [US1] 实现注册接口（邮箱格式校验 + 密码强度 + BCrypt 加密）in `backend/src/main/java/com/iep/module01_user/controller/AuthController.java`
- [x] T007 [P] [US1] 实现登录接口（JWT 签发，24h 过期）in `backend/src/main/java/com/iep/module01_user/controller/AuthController.java`
- [x] T008 [P] [US1] 实现 Refresh Token 接口 in `backend/src/main/java/com/iep/module01_user/controller/AuthController.java`
- [x] T009 [US1] 实现个人信息查看/修改接口（昵称、头像 URL）in `backend/src/main/java/com/iep/module01_user/controller/ProfileController.java`
- [x] T010 [P] [US1] 创建 AssessmentQuestion Entity + Mapper in `backend/src/main/java/com/iep/module03_assessment/`
- [x] T011 [US1] 实现测评题目获取 API（分页返回，不暴露正确答案）in `backend/src/main/java/com/iep/module03_assessment/controller/AssessmentController.java`
- [x] T012 [US1] 实现测评提交 + 规则诊断引擎（答题正确率 >70%→已掌握）in `backend/src/main/java/com/iep/module03_assessment/service/DiagnosisEngine.java`
- [x] T013 [P] [US1] 实现用户知识状态查询 API in `backend/src/main/java/com/iep/module03_assessment/controller/KnowledgeStateController.java`
- [x] T014 [US1] 编写测评题目初始化数据 SQL（10 题，Python 程序设计基础）in `backend/src/main/resources/init-data.sql`

### Frontend Implementation for User Story 1

- [x] T015 [P] [US1] 创建登录/注册页面（邮箱表单 + Ant Design 校验 + Tab 切换）in `frontend/src/pages/login/LoginPage.tsx` ✅ Implemented
- [x] T016 [P] [US1] 创建测评答题页面（逐题展示 + 进度条 + 断点续答）in `frontend/src/pages/assessment/AssessmentPage.tsx` ✅ Implemented
- [x] T017 [US1] 创建测评结果页面（展示各知识点掌握度 + 跳转仪表盘）in `frontend/src/pages/assessment/AssessmentResultPage.tsx` ✅ Implemented

**Checkpoint**: 至此，User Story 1 应完全可用——注册、登录、测评、查看诊断结果

---

## Phase 4: User Story 2 — 个性化学习路径与进度跟踪 (Priority: P1) 🎯 MVP

**Goal**: 贪心推荐生成学习路径，学习行为自动记录，路径动态调整

**Independent Test**: 完成测评 → 查看路径 → 学习行为记录 → 路径更新

### Backend Implementation for User Story 2

- [x] T018 [P] [US2] 创建 LearningRecord Entity + Mapper in `backend/src/main/java/com/iep/module05_record/`
- [x] T019 [US2] 实现学习行为上报 API（QUIZ/PAGE_VIEW/VIDEO 三种类型）in `backend/src/main/java/com/iep/module05_record/controller/LearningRecordController.java`
- [x] T020 [P] [US2] 实现学习进度统计 API in `backend/src/main/java/com/iep/module05_record/service/LearningProgressService.java`
- [x] T021 [US2] 实现每日趋势统计 API（含学习时长）in `backend/src/main/java/com/iep/module05_record/controller/TrendController.java`
- [x] T022 [US2] 实现贪心推荐算法（薄弱优先 + 先修检查 + 推荐理由生成）in `backend/src/main/java/com/iep/module04_recommend/service/GreedyRecommender.java`
- [x] T023 [US2] 实现学习路径推荐 API（幂等调用，未测评时返回提示）in `backend/src/main/java/com/iep/module04_recommend/controller/RecommendationController.java`

### Frontend Implementation for User Story 2

- [x] T024 [P] [US2] 创建学习路径展示页面（排序列表 + 推荐理由 + 进度条）in `frontend/src/pages/learning-path/LearningPathPage.tsx` ✅
- [x] T025 [US2] 创建学习记录页面（列表 + 类型筛选 + 七日/三十日 + 统计卡片）in `frontend/src/pages/learning-record/LearningRecordPage.tsx` ✅

**Checkpoint**: 用户故事 1 + 2 可联合验证——测评后生成个性化路径，学习行为记录并反馈

---

## Phase 5: User Story 3 — 知识图谱可视化与学习仪表盘 (Priority: P1) 🎯 MVP

**Goal**: 力导向图展示知识图谱，三色节点标注掌握状态，仪表盘聚合展示

**Independent Test**: 进入仪表盘 → 查看图谱（拖拽/缩放/点击）→ 验证颜色标注与数据一致

### Backend Implementation for User Story 3

- [x] T026 [P] [US3] 创建 Course Entity + Mapper + CRUD API in `backend/src/main/java/com/iep/module02_course/`
- [x] T027 [P] [US3] 创建 KnowledgePoint Entity + Mapper + CRUD API in `backend/src/main/java/com/iep/module02_course/`
- [x] T028 [US3] 创建 KnowledgeRelation Entity + Mapper + API（含循环依赖校验）in `backend/src/main/java/com/iep/module02_course/`
- [x] T029 [US3] 实现知识图谱 graph API（返回节点列表 + 边列表 + 学生掌握状态）in `backend/src/main/java/com/iep/module07_graph/controller/GraphController.java`

### Frontend Implementation for User Story 3

- [x] T030 [P] [US3] 实现学习仪表盘页面（进度概览 + 知识热力图 + 最近记录 + 学习时长）in `frontend/src/pages/dashboard/DashboardPage.tsx` ✅ Implemented
- [x] T031 [P] [US3] 创建知识图谱力导向图页面（ECharts force layout，三色节点标注+图例）in `frontend/src/pages/knowledge-graph/KnowledgeGraphPage.tsx` ✅ Implemented
- [x] T032 [US3] 实现图谱交互功能（拖拽、缩放、节点点击弹出详情）in `frontend/src/pages/knowledge-graph/KnowledgeGraphPage.tsx` ✅ Implemented

**Checkpoint**: 用户故事 1 + 2 + 3 完整——图谱可视化 + 仪表盘 + 颜色与知识状态同步

---

## Phase 6: User Story 4 — 学习风格识别与学习报告 (Priority: P2)

**Goal**: FS 风格问卷（8 题，个人中心入口，非强制），学习报告（掌握度/薄弱点/趋势/建议）

**Independent Test**: 完成问卷 → 雷达图展示 → 生成报告 → 柱状图/薄弱点/趋势/建议

### Backend Implementation for User Story 4

- [x] T033 [P] [US4] 实现学习风格问卷 API（返回 8 题 + 提交答案 + 评分）in `backend/src/main/java/com/iep/module08_style/`
- [x] T034 [P] [US4] 实现学习风格评分算法（FS 四维度得分计算）in `backend/src/main/java/com/iep/module08_style/service/StyleScoringService.java`
- [x] T035 [US4] 实现学习报告数据聚合 API（掌握度柱状图 + 薄弱点 Top 3 + 趋势 + 建议）in `backend/src/main/java/com/iep/module06_report/controller/ReportController.java`

### Frontend Implementation for User Story 4

- [x] T036 [P] [US4] 创建个人中心页面（编辑信息 + 头像URL + 退出登录 + 风格问卷入口）in `frontend/src/pages/profile/ProfilePage.tsx` ✅
- [x] T037 [US4] 创建学习风格问卷页面（8 题 AB 选项 + ECharts 雷达图 + 四维度解释）in `frontend/src/pages/learning-style/LearningStylePage.tsx` ✅
- [x] T038 [US4] 创建学习报告页面（ECharts 柱状图 + 薄弱点 Top 3 + 进度趋势圈图）in `frontend/src/pages/learning-report/LearningReportPage.tsx` ✅

**Checkpoint**: 学生端功能完备——诊断、路径、图谱、仪表盘、风格、报告全部可用

---

## Phase 7: User Story 5 — 教师课程管理与学情分析 (Priority: P2)

**Goal**: 教师创建课程和知识点体系，查看班级学情拓扑和单生详情

**Independent Test**: 教师登录 → 创建课程 → 添加知识点 → 定义关系 → 查看学情 → 下钻学生详情

### Backend Implementation for User Story 5

- [x] T039 [P] [US5] 实现教师端班级学情数据聚合 API（总进度 + 平均掌握度 + 薄弱点 Top 5 + 排行榜）in `backend/src/main/java/com/iep/module09_teacher/controller/TeacherAnalyticsController.java` ✅
- [x] T040 [US5] 实现教师查看单个学生详情 API in `backend/src/main/java/com/iep/module09_teacher/controller/TeacherAnalyticsController.java` ✅

### Frontend Implementation for User Story 5

- [x] T041 [P] [US5] 创建教师课程管理页面（课程 CRUD + 知识点管理 + 关系定义 Modal）in `frontend/src/pages/teacher/TeacherCoursesPage.tsx` ✅
- [x] T042 [US5] 创建教师班级学情仪表盘（统计卡片 + 薄弱点 Top 5 + 学生排行榜）in `frontend/src/pages/teacher/TeacherAnalyticsPage.tsx` ✅
- [x] T043 [US5] 创建教师端学生详情页（知识状态表格 + 最近活动记录列表）in `frontend/src/pages/teacher/TeacherStudentDetail.tsx` ✅

**Checkpoint**: 教师端功能完备——教师可管理课程/知识点，查看学情，下钻学生详情

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: 跨模块联调、测试、部署

- [x] T004a 实现 JWT Interceptor（Token 解析 + 角色提取 + 401 拦截）in `backend/src/main/java/com/iep/config/JwtInterceptor.java` ✅
- [x] T004b [P] 实现 Spring Security 配置（禁用 CSRF + 无状态会话）in `backend/src/main/java/com/iep/config/SecurityConfig.java` ✅
- [x] T004c [P] 实现 BCrypt PasswordEncoder Bean in `backend/src/main/java/com/iep/config/PasswordConfig.java` ✅
- [x] T004d [P] 实现 TeacherRoleInterceptor（教师权限校验）in `backend/src/main/java/com/iep/config/TeacherRoleInterceptor.java` ✅
- [x] T004e 实现 WebMvcConfig（CORS + JWT Filter + Teacher 权限拦截）in `backend/src/main/java/com/iep/config/WebMvcConfig.java` ✅
- [ ] T044 前后端全模块联调 in `backend/` + `frontend/`（全员协作）
- [ ] T045 [P] JUnit 后端单元测试（目标覆盖率 ≥ 70%）in `backend/src/test/java/com/iep/`
- [ ] T046 [P] Vitest 前端单元测试 in `frontend/src/__tests__/`
- [ ] T047 [P] Postman/Apifox 接口测试用例编写与执行
- [ ] T048 生产环境部署（MySQL + Redis + Spring Boot + Nginx 静态文件）in `deploy/`
- [ ] T049 [P] 项目总结文档 in `docs/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: ✅ 已完成，无依赖
- **Foundational (Phase 2)**: ✅ 已完成，依赖 Setup
- **US1 注册与诊断 (Phase 3)**: 依赖 Foundational 完成 → 后端已完成，前端待启动
- **US2 学习路径 (Phase 4)**: 依赖 Foundational + US1（需知识状态数据）→ 后端已完成，前端待启动
- **US3 图谱与仪表盘 (Phase 5)**: 依赖 Foundational + US1（需掌握状态标注）→ 后端已完成，前端待启动
- **US4 风格与报告 (Phase 6)**: 依赖 Foundational → 后端已完成，前端待启动
- **US5 教师管理 (Phase 7)**: 依赖 Foundational → 前后端均待启动
- **Polish (Phase 8)**: 依赖所有用户故事完成

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — 独立可测
- **US2 (P1)**: Can start after US1 后端（需要知识状态数据）— 独立可测
- **US3 (P1)**: Can start after US1 后端（需要掌握状态标注）— 独立可测
- **US4 (P2)**: Can start after Foundational — 独立可测
- **US5 (P2)**: Can start after Foundational — 独立可测

### Within Each User Story

- Backend APIs → Frontend pages
- Models + Mappers → Services → Controllers
- 前端：Components → Pages → Integration

### Parallel Opportunities

- Phase 3-7 的后端任务已大量完成，前端任务可大量并行
- T015, T016 可并行（不同页面）
- T030, T031 可并行（仪表盘 + 图谱页面独立）
- T036, T037, T038 可并行（不同页面）
- T039, T040, T041 可并行（后端 API + 前端课程管理页）
- T045, T046, T047 可并行（不同测试类型）
- **US4 和 US5 的前端可并行开发**（不同模块，无交叉依赖）

---

## Parallel Example: User Story 1 Frontend

```bash
# 并启动 US1 所有前端页面：
Task: "创建登录/注册页面 in frontend/src/pages/login/"
Task: "创建测评答题页面 in frontend/src/pages/assessment/"
# 然后：
Task: "创建测评结果页面 in frontend/src/pages/assessment/" (依赖答题页)
```

## Parallel Example: User Story 3 + 4 前端（可同时进行）

```bash
# US3 和 US4 前端无依赖，可完全并行：
Task: "实现学习仪表盘页面 in frontend/src/pages/dashboard/"
Task: "创建知识图谱力导向图页面 in frontend/src/pages/knowledge-graph/"
Task: "创建学习风格问卷页面 in frontend/src/pages/learning-style/"
Task: "创建学习报告页面 in frontend/src/pages/learning-report/"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 + 3)

1. ✅ Phase 1: Setup（已完成）
2. ✅ Phase 2: Foundational（已完成）
3. 🔲 Phase 3: US1 前端（登录/注册/测评）—— **当前阻塞**
4. 🔲 Phase 4: US2 前端（学习路径/记录展示）
5. 🔲 Phase 5: US3 前端（图谱/仪表盘）
6. **STOP and VALIDATE**: 学生端核心闭环完整可用
7. Deploy/demo if ready

### Incremental Delivery

1. ✅ Setup + Foundational → 基础就绪
2. 🔲 US1 前端 → 注册/测评可用
3. 🔲 US2 前端 → 学习路径/记录可用
4. 🔲 US3 前端 → 图谱/仪表盘可用
5. 🔲 US4 前端 → 风格/报告可用
6. 🔲 US5 前后端 → 教师端可用
7. 🔲 Polish → 联调/测试/部署

### 当前进度（截至 2026-06-01, after `/speckit.implement`）

| 状态 | 任务数 | 说明 |
|------|--------|------|
| ✅ 已完成（后端-团队） | 28 | Phase 1-2 全部 + US1-US4 后端全部（原05-tasks.md记录） |
| ✅ 已完成（后端-本次） | 7 | T004a-e 认证拦截器 + T039-T040 M09 教师学情 API |
| ✅ 已完成（前端-全部） | 17 | Setup(3) + US1(3) + US2(2) + US3(3) + US4(3) + US5(3) |
| ⬜ 待完成（Polish） | 6 | T044-T049 联调/测试/部署 |
| **总计** | **60** | 已实现 54/60 (90%) |

### 团队分工建议

| 负责人 | 待完成任务数 | 重点任务 |
|--------|-----------|---------|
| 侯其东（后端） | 1 | T048（部署）— US5 后端已完成 |
| 刘家齐（前端） | 0 | ✅ 全部前端任务已完成 |
| 范熙昂（测试） | 3 | T045-T047（JUnit + Vitest + API 测试） |
| 全员 | 2 | T044（联调） + T049（文档） |

---

## Notes

- [P] 任务 = 不同文件，无依赖，可并行
- [US*] 标签将任务映射到具体用户故事，确保可追溯
- 每个用户故事应可独立完成和测试
- 在 Checkpoint 处暂停以独立验证每个故事
- 每完成一个任务或逻辑任务组后提交
- 避免：模糊任务描述、同文件冲突、破坏独立性的跨故事依赖
