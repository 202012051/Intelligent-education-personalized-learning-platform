# Quickstart Guide: 智能教育个性化学习平台

**Date**: 2026-06-01

## Prerequisites

- JDK 17+
- Node.js 20+
- Maven 3.9+
- MySQL 8.0+
- Redis 7+

## Quick Start (Local Development)

### 1. Start Infrastructure

```bash
# Start MySQL & Redis via Docker
docker run -d --name mysql-iep -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root123 -e MYSQL_DATABASE=iep_db mysql:8.0

docker run -d --name redis-iep -p 6379:6379 redis:7
```

### 2. Backend Setup

```bash
cd backend

# Edit src/main/resources/application.yml if needed
# (default: localhost:3306, root/root123)

# Run database migrations & seed data
mvn flyway:migrate

# Start Spring Boot
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 3. Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### 4. Verify

1. Open `http://localhost:5173`
2. Register a student account
3. Complete the initial assessment (10 questions)
4. View your personalized learning path
5. Explore the knowledge graph

**Pre-seeded test accounts** (from init-data.sql):

| Role | Email | Password |
|------|-------|----------|
| Student | student@test.com | 123456 |
| Teacher | teacher@test.com | 123456 |

### Project Structure

```
iep-platform/
├── backend/                 # Spring Boot 3.2 (Java 17)
│   ├── src/main/java/com/iep/
│   │   ├── module01_user/       # M01: 用户注册/登录/认证
│   │   ├── module02_course/     # M02: 课程与知识点管理
│   │   ├── module03_assessment/ # M03: 认知诊断测评
│   │   ├── module04_recommend/  # M04: 贪心推荐引擎
│   │   ├── module05_record/     # M05: 学习行为记录
│   │   ├── module06_report/     # M06: 学习报告
│   │   ├── module07_graph/      # M07: 知识图谱
│   │   ├── module08_style/      # M08: 学习风格
│   │   └── module09_teacher/    # M09: 教师学情
│   └── src/main/resources/
│       ├── application.yml
│       └── db/migration/
├── frontend/                # React 18 + TypeScript + Ant Design 5
│   ├── src/pages/
│   │   ├── login/           # 登录/注册
│   │   ├── dashboard/       # 学习仪表盘
│   │   ├── assessment/      # 认知诊断测评
│   │   ├── learning-path/   # 学习路径
│   │   ├── knowledge-graph/ # 知识图谱 (ECharts)
│   │   ├── learning-record/ # 学习记录
│   │   ├── learning-report/ # 学习报告
│   │   ├── learning-style/  # 学习风格
│   │   ├── teacher/         # 教师端
│   │   └── profile/         # 个人中心
│   └── src/stores/          # Zustand 状态管理
└── specs/001-iep-learning-platform/
    ├── spec.md              # 需求规格
    ├── plan.md              # 实现计划 (this file's context)
    ├── research.md          # 技术决策
    ├── data-model.md        # 数据模型 (11 tables)
    ├── contracts/           # API 契约文档
    └── quickstart.md        # This file
```
