# 智能教育个性化学习平台 — GitHub Issues 导出

> SpecKit /speckit.taskstoissues · 2026-06-01

---

## 一、Milestones（里程碑）

| 里程碑 | 截止日期 | 描述 |
|--------|---------|------|
| 🏗️ Phase 1: 基础建设 | 2026-05-30 | 项目骨架 + 用户管理 |
| 📦 Phase 2: 核心功能 | 2026-06-01 | 课程 + 诊断 + 记录 |
| 🧠 Phase 3: 智能模块 | 2026-06-04 | 推荐 + 图谱 |
| 📊 Phase 4: 扩展功能 | 2026-06-08 | 报告 + 风格 + 教师 |
| 🔗 Phase 5: 联调测试 | 2026-06-10 | 联调 + Bug 修复 |
| 🚀 Phase 6: 上线 | 2026-06-11 | 部署 + 总结 |

---

## 二、Labels（标签）

```
type:feature     新功能
type:bug         Bug 修复
type:docs        文档
type:test        测试
type:infra       基础设施

priority:P0      最高（阻塞项）
priority:P1      高
priority:P2      中

status:done      已完成
status:in-progress 进行中
status:todo      待开发

module:M01~M10   模块标签
```

---

## 三、Issues 列表

### Phase 1

```markdown
### [P0] T001 - 创建 Spring Boot 项目骨架
- 标签: type:infra, priority:P0, status:done
- 负责人: 侯其东
- 描述: 创建 Maven 项目结构，配置 pom.xml（Spring Boot 3.2.5 + MyBatis + MySQL + Redis + JWT），编写 application.yml

### [P0] T002 - 数据库初始化脚本
- 标签: type:infra, priority:P0, status:done
- 负责人: 侯其东
- 描述: 编写 CREATE TABLE 脚本（11 张表），含索引、外键、COMMENT，初始化种子数据（Python 课程 + 测评题 + 风格问卷）

### [P0] T003 - 统一响应体 + 异常处理
- 标签: type:feature, priority:P0, status:done
- 负责人: 侯其东
- 描述: ApiResult 封装 `{code, message, data, timestamp}`，GlobalExceptionHandler 处理 BusinessException 和参数校验异常

### [P0] T004 - JWT 工具类 + 拦截器
- 标签: type:feature, priority:P0, status:done
- 负责人: 侯其东
- 描述: JwtUtils（生成/解析/验证 Token），WebMvcConfig AuthInterceptor（Bearer Token 校验 + 角色信息写入 Request）

### [P0] T005 - User Entity + Mapper
- 标签: type:feature, priority:P0, status:done
- 负责人: 侯其东
- 描述: User 实体类（Lombok），UserMapper（findByEmail, findById, insert, updateProfile, countByEmail）

### [P0] T006 - 注册接口
- 标签: type:feature, priority:P0, status:done
- 负责人: 侯其东
- 描述: POST /api/auth/register，邮箱格式校验，密码 ≥ 6 位，邮箱唯一性校验，BCrypt 加密密码，返回 JWT Token + 用户信息

### [P0] T007 - 登录接口
- 标签: type:feature, priority:P0, status:done
- 负责人: 侯其东
- 描述: POST /api/auth/login，邮箱密码验证，禁用账号检测，返回 JWT Token + Refresh Token + 用户信息

### [P0] T008 - Refresh Token 接口
- 标签: type:feature, priority:P0, status:done
- 负责人: 侯其东
- 描述: POST /api/auth/refresh，验证 Refresh Token 有效性，返回新 Token 对

### [P1] T009 - 个人信息接口
- 标签: type:feature, priority:P1, status:done
- 负责人: 侯其东
- 描述: GET /api/users/me（查看个人信息），PUT /api/users/profile（修改昵称/头像URL）
```

### Phase 2

```markdown
### [P0] T010 - Course CRUD
- 标签: type:feature, priority:P0, status:done
- 负责人: 侯其东
- 描述: Course Entity/Mapper/Service/Controller，支持创建/编辑/删除/列表查询，教师权限校验

### [P0] T011 - KnowledgePoint CRUD
- 标签: type:feature, priority:P0, status:done
- 负责人: 侯其东
- 描述: KnowledgePoint Entity/Mapper/Service/Controller，知识点增删改查，按课程分组查询

### [P0] T012 - KnowledgeRelation API
- 标签: type:feature, priority:P0, status:done
- 负责人: 侯其东
- 描述: 知识点关系管理（先修/包含/相关），关系的创建与删除

### [P0] T013 - 知识图谱 Graph API
- 标签: type:feature, priority:P0, status:done
- 负责人: 侯其东
- 描述: GET /api/courses/{id}/graph，返回 {nodes: [...], edges: [...]} JSON 结构

### [P0] T014-T015 - 测评题目管理
- 标签: type:feature, priority:P0, status:done
- 负责人: 侯其东
- 描述: AssessmentQuestion Entity/Mapper，GET /api/courses/{id}/assessment 获取测评（不返回正确答案），解析 options JSON

### [P0] T016 - 测评提交 + 规则诊断
- 标签: type:feature, priority:P0, status:done
- 负责人: 侯其东 + 罗家豪
- 描述: POST /api/assessment/submit，接收答题列表，按知识点分组评分，规则引擎判定（>70% 掌握），UPSERT user_knowledge_state

### [P0] T017 - 知识状态查询
- 标签: type:feature, priority:P0, status:done
- 负责人: 侯其东
- 描述: GET /api/assessment/result/{courseId}，返回各知识点掌握度、是否已掌握

### [P0] T018 - 测评题目初始化数据
- 标签: type:feature, priority:P0, status:done
- 负责人: 罗家豪
- 描述: 为 Python 程序设计基础课程编写 10 道测评题（选择题 + 判断题），写入 SQL 种子数据

### [P0] T019-T022 - 学习记录模块
- 标签: type:feature, priority:P0, status:done
- 负责人: 侯其东
- 描述: LearningRecord Entity/Mapper，POST /api/learning-records 上报行为，GET summary/stats/daily 统计接口
```

### Phase 3

```markdown
### [P0] T023-T024 - 推荐引擎
- 标签: type:feature, priority:P0, status:done
- 负责人: 罗家豪 + 侯其东
- 描述: 贪心推荐算法（薄弱优先 + 先修检查 + 推荐理由），GET /api/courses/{id}/learning-path

### [P0] T025 - ECharts 力导向图组件
- 标签: type:feature, priority:P0, status:todo
- 负责人: 刘家齐
- 描述: React + ECharts 封装知识图谱力导向图，数据源为 GET /api/courses/{id}/graph，支持缩放/拖拽

### [P0] T026 - 图谱节点颜色标注
- 标签: type:feature, priority:P0, status:todo
- 负责人: 刘家齐
- 描述: 根据 user_knowledge_state 表 mastery 值标注节点颜色：≥ 0.7 绿 / > 0 黄 / = 0 灰

### [P0] T027 - 图谱交互增强
- 标签: type:feature, priority:P0, status:todo
- 负责人: 刘家齐
- 描述: 点击节点弹窗显示知识点详情（名称/描述/掌握度/难度），边标注关系类型

### [P1] T028 - 学习路径展示页面
- 标签: type:feature, priority:P1, status:todo
- 负责人: 刘家齐
- 描述: 时间线/流程图展示学习路径，每节点显示名称/掌握度/推荐理由
```

### Phase 4

```markdown
### [P1] T029-T030 - 学习报告
- 标签: type:feature, priority:P1
- 负责人: 侯其东 + 刘家齐
- 描述: 报告数据聚合 API（已实现），前端报告页面：掌握度柱状图、薄弱点 Top5、改进建议

### [P1] T031-T033 - 学习风格
- 标签: type:feature, priority:P1
- 负责人: 罗家豪 + 侯其东 + 刘家齐
- 描述: 8 题问卷 API（已实现），Felder-Silverman 四维度评分算法（已实现），前端问卷页面 + 雷达图展示

### [P1] T034-T036 - 教师端
- 标签: type:feature, priority:P1, status:todo
- 负责人: 侯其东 + 刘家齐
- 描述: 教师仪表盘 API（学情数据聚合），前端仪表盘（进度/排行/薄弱点），学生详情页
```

### Phase 5-6

```markdown
### [P0] T037 - 前后端联调
- 标签: type:test, priority:P0, status:todo
- 负责人: 全员
- 描述: 全模块端到端联调，修复所有阻断 Bug

### [P1] T038-T040 - 测试
- 标签: type:test, priority:P1, status:todo
- 负责人: 范熙昂
- 描述: JUnit 后端单元测试（覆盖率 ≥ 70%），Jest 前端测试，Postman 接口测试

### [P0] T041-T042 - 部署上线
- 标签: type:infra, priority:P0, status:todo
- 负责人: 侯其东
- 描述: 生产环境部署，项目总结文档
```

---

## 四、快速创建命令

```bash
# 安装 GitHub CLI 后执行
gh issue create --title "[P0] T010 - Course CRUD" \
  --body "Course 实体类/Mapper/Service/Controller，支持创建/编辑/删除/列表查询，教师权限校验" \
  --label "type:feature,priority:P0,module:M02,status:done" \
  --milestone "Phase 2: 核心功能" \
  --assignee "houqidong"
```

> 以上 42 个 Issues 可直接批量导入 GitHub Projects，配合 Sprint Board 跟踪进度。
