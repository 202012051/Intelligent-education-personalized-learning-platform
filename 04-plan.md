# 智能教育个性化学习平台 — 技术方案

> SpecKit /speckit.plan · 2026-06-01
> 源文档：系统技术方案 (bGMcvtVMLUwM) + 模块拆分文档 (bwtWCKJmOPjo)

---

## 一、技术栈一览

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   前端 (SPA)     │  │   后端 (REST)    │  │   算法 (Python)  │
│ React 18 + TS    │  │ Spring Boot 3.2  │  │ FastAPI/Flask    │
│ Ant Design 5     │  │ MyBatis 3.0      │  │ scikit-learn     │
│ ECharts 5        │  │ MySQL 8.0        │  │ (MVP 已内嵌)    │
│ Zustand          │  │ Redis 7          │  │                  │
│ Vite             │  │ JWT + BCrypt     │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

| 层次 | 技术 | 版本 | 角色 |
|------|------|------|------|
| 前端框架 | React | 18 | SPA 渲染 |
| 前端语言 | TypeScript | 5.x | 类型安全 |
| UI 库 | Ant Design | 5.x | 中后台组件 |
| 可视化 | ECharts | 5.x | 知识图谱/图表 |
| 状态管理 | Zustand | 4.x | 全局状态 |
| 构建工具 | Vite | 5.x | 开发与打包 |
| 后端框架 | Spring Boot | 3.2.5 | RESTful API |
| ORM | MyBatis | 3.0.3 | SQL 映射 |
| 数据库 | MySQL | 8.0 | 主存储 |
| 缓存 | Redis | 7.x | 会话/热点数据 |
| 认证 | JJWT | 0.12.5 | JWT 令牌 |
| 加密 | BCrypt | Spring Security | 密码哈希 |
| 算法 | Java 内嵌 | — | MVP 规则引擎+贪心推荐 |

---

## 二、系统架构

```
                        Browser (Chrome 80+)
                              │
                    ┌─────────┴─────────┐
                    │   Vite Dev Server  │  :5173
                    │   React SPA        │
                    └─────────┬─────────┘
                              │ RESTful API (JSON)
                    ┌─────────┴─────────┐
                    │   Spring Boot      │  :8080
                    │   ┌─────────────┐  │
                    │   │ M01 用户     │  │
                    │   │ M02 课程     │  │
                    │   │ M03 诊断     │  │
                    │   │ M04 推荐     │  │
                    │   │ M05 记录     │  │
                    │   │ M06 报告     │  │
                    │   │ M08 风格     │  │
                    │   └─────────────┘  │
                    └──┬──────────┬──────┘
                       │          │
              ┌────────┴──┐  ┌───┴──────┐
              │  MySQL 8  │  │ Redis 7  │
              │  :3306    │  │ :6379    │
              └───────────┘  └──────────┘
```

---

## 三、数据库 ER 概览（11 张表）

```
user ──1:N──> course ──1:N──> knowledge_point
  │               │                │
  │               │                ├──> knowledge_relation (source/target)
  │               │                │
  │               │                ├──> assessment_question
  │               │                │
  │               ├──> user_assessment ──> user_assessment_answer
  │               │
  │               ├──> user_knowledge_state
  │               │
  │               └──> learning_record
  │
  ├──> user_learning_style
  └──> learning_style_question
```

---

## 四、模块依赖拓扑

```
M01 (用户)
 ├── M02 (课程) ──┬── M03 (诊断) ──┬── M04 (推荐)
 │                │                │
 │                ├── M07 (图谱)    ├── M06 (报告)
 │                │                │
 │                └── M09 (教师)    └── M08 (风格) ──> M04
 │
 └── M05 (记录) ──┬── M06 (报告)
                  └── M09 (教师)

M10 (测试/采集) 并行所有模块
```

---

## 五、开发阶段

| 阶段 | 时间 | 内容 | 交付物 |
|------|------|------|--------|
| Phase 1 | 5/29-5/30 | M01 用户管理 + 项目骨架 | 注册/登录可用 |
| Phase 2 | 5/30-6/1 | M02 课程管理 + M03 认知诊断 + M05 学习记录 | 课程CRUD/测评/记录 |
| Phase 3 | 6/1-6/4 | M04 推荐引擎 + M07 知识图谱 | 推荐路径/可视化 |
| Phase 4 | 6/4-6/8 | M06 报告 + M08 风格 + M09 教师 | 报告/风格/学情 |
| Phase 5 | 6/8-6/10 | 全模块联调 + Bug 修复 | 端到端可用 |
| Phase 6 | 6/10-6/11 | 部署上线 + 项目总结 | 线上 Demo |

---

## 六、API 设计规范

- 风格：RESTful
- 协议：HTTPS（生产）/ HTTP（开发）
- 数据格式：JSON
- 认证：`Authorization: Bearer <token>`
- 版本：URL 路径 `/api/v1/`（MVP 省略）

### 统一响应格式

```json
// 成功
{"code":200, "message":"success", "data": {...}, "timestamp": 1716892800000}

// 失败
{"code":400, "message":"参数校验失败", "data": null, "timestamp": 1716892800000}
```

---

## 七、安全设计

| 层级 | 措施 |
|------|------|
| 传输 | HTTPS 加密（生产） |
| 认证 | JWT Bearer Token，24h 过期，支持 Refresh |
| 密码 | BCrypt 10 rounds，不可逆 |
| 鉴权 | 接口级角色控制（Spring Interceptor） |
| 数据 | 学习行为脱敏，不记录明文隐私 |
| CORS | 仅允许前端域名 |
