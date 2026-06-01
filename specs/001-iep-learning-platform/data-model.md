# Data Model: 智能教育个性化学习平台

**Date**: 2026-06-01
**Source**: 04-plan.md Section 3 (ER Diagram) + spec.md Key Entities

## Entity-Relationship Overview

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

## Tables (11 张表)

### 1. user

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | 用户 ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 邮箱（登录账号） |
| password_hash | VARCHAR(255) | NOT NULL | BCrypt 加密的密码 |
| nickname | VARCHAR(100) | NOT NULL | 昵称 |
| role | VARCHAR(20) | NOT NULL, CHECK('STUDENT','TEACHER','ADMIN') | 角色，默认 STUDENT |
| avatar_url | VARCHAR(500) | NULL | 头像 URL（MVP 仅 URL 字符串） |
| created_at | DATETIME | NOT NULL, DEFAULT NOW() | 注册时间 |
| updated_at | DATETIME | NOT NULL, ON UPDATE NOW() | 更新时间 |

### 2. course

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | 课程 ID |
| name | VARCHAR(200) | NOT NULL | 课程名称 |
| description | TEXT | NULL | 课程描述 |
| teacher_id | BIGINT | FK → user.id, NOT NULL | 创建教师 |
| created_at | DATETIME | NOT NULL | 创建时间 |
| updated_at | DATETIME | NOT NULL | 更新时间 |

### 3. knowledge_point

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | 知识点 ID |
| course_id | BIGINT | FK → course.id, NOT NULL | 所属课程 |
| name | VARCHAR(200) | NOT NULL | 知识点名称 |
| description | TEXT | NULL | 知识点描述 |
| difficulty | INT | DEFAULT 1, CHECK(1-5) | 难度等级 |
| order_num | INT | NOT NULL | 排序序号 |
| created_at | DATETIME | NOT NULL | 创建时间 |

### 4. knowledge_relation

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | 关系 ID |
| source_id | BIGINT | FK → knowledge_point.id, NOT NULL | 源知识点 |
| target_id | BIGINT | FK → knowledge_point.id, NOT NULL | 目标知识点 |
| relation_type | VARCHAR(20) | NOT NULL, CHECK('PREREQUISITE','CONTAINS','RELATED') | 关系类型 |
| created_at | DATETIME | NOT NULL | 创建时间 |

**Constraint**: UNIQUE (source_id, target_id, relation_type) — 同一知识点对不能有重复关系。应用层校验无循环依赖（A→B→A）。

### 5. assessment_question

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | 题目 ID |
| course_id | BIGINT | FK → course.id, NOT NULL | 所属课程 |
| content | TEXT | NOT NULL | 题目内容 |
| options | JSON | NOT NULL | 选项列表 (JSON array, 如 `["A选项","B选项","C选项","D选项"]`) |
| correct_answer | INT | NOT NULL | 正确答案索引 (0-based) |
| knowledge_point_id | BIGINT | FK → knowledge_point.id, NULL | 关联知识点 |
| created_at | DATETIME | NOT NULL | 创建时间 |

### 6. user_assessment

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | 测评 ID |
| user_id | BIGINT | FK → user.id, NOT NULL | 学生 ID |
| course_id | BIGINT | FK → course.id, NOT NULL | 课程 ID |
| status | VARCHAR(20) | NOT NULL, CHECK('IN_PROGRESS','COMPLETED') | 测评状态 |
| started_at | DATETIME | NOT NULL | 开始时间 |
| completed_at | DATETIME | NULL | 完成时间 |
| current_question_index | INT | DEFAULT 0 | 当前答题进度（断点续答用） |

### 7. user_assessment_answer

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | 答题记录 ID |
| assessment_id | BIGINT | FK → user_assessment.id, NOT NULL | 测评 ID |
| question_id | BIGINT | FK → assessment_question.id, NOT NULL | 题目 ID |
| selected_answer | INT | NOT NULL | 学生选择的答案索引 |
| is_correct | BOOLEAN | NOT NULL | 是否正确 |
| answered_at | DATETIME | NOT NULL | 答题时间 |

### 8. user_knowledge_state

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | 状态 ID |
| user_id | BIGINT | FK → user.id, NOT NULL | 学生 ID |
| course_id | BIGINT | FK → course.id, NOT NULL | 课程 ID |
| knowledge_point_id | BIGINT | FK → knowledge_point.id, NOT NULL | 知识点 ID |
| mastery | DECIMAL(5,4) | NOT NULL, DEFAULT 0, CHECK(0-1) | 掌握度 (0.0000 ~ 1.0000) |
| updated_at | DATETIME | NOT NULL, ON UPDATE NOW() | 更新时间 |

**Constraint**: UNIQUE (user_id, course_id, knowledge_point_id) — 每学生对每课程下每知识点只有一条状态记录。

### 9. learning_record

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | 记录 ID |
| user_id | BIGINT | FK → user.id, NOT NULL | 学生 ID |
| course_id | BIGINT | FK → course.id, NOT NULL | 课程 ID |
| knowledge_point_id | BIGINT | FK → knowledge_point.id, NULL | 关联知识点 |
| record_type | VARCHAR(20) | NOT NULL, CHECK('QUIZ','PAGE_VIEW','VIDEO') | 记录类型 |
| duration_seconds | INT | DEFAULT 0 | 耗时（秒） |
| detail | JSON | NULL | 详细数据（答题结果、页面路径、视频进度等） |
| created_at | DATETIME | NOT NULL, DEFAULT NOW() | 记录时间 |

### 10. learning_style_question

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | 题目 ID |
| dimension | VARCHAR(20) | NOT NULL | 维度 (ACTIVE_REFLECTIVE/SENSING_INTUITIVE/VISUAL_VERBAL/SEQUENTIAL_GLOBAL) |
| content | TEXT | NOT NULL | 题目内容 |
| option_a | VARCHAR(200) | NOT NULL | 选项 A |
| option_b | VARCHAR(200) | NOT NULL | 选项 B |
| option_a_weight | CHAR(1) | NOT NULL, CHECK('a','b') | A 端偏向的维度侧 |
| created_at | DATETIME | NOT NULL | 创建时间 |

### 11. user_learning_style

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | 结果 ID |
| user_id | BIGINT | FK → user.id, NOT NULL, UNIQUE | 学生 ID（每人一条） |
| active_reflective | INT | NOT NULL, CHECK(-3 to 3) | 活跃/沉思得分 |
| sensing_intuitive | INT | NOT NULL, CHECK(-3 to 3) | 感悟/直觉得分 |
| visual_verbal | INT | NOT NULL, CHECK(-3 to 3) | 视觉/言语得分 |
| sequential_global | INT | NOT NULL, CHECK(-3 to 3) | 序列/综合得分 |
| created_at | DATETIME | NOT NULL | 测试时间 |

## State Transitions

### 测评状态 (user_assessment.status)

```
IN_PROGRESS ──→ COMPLETED  (提交全部题目后)
     │
     └── (断点续答：继续答题，状态保持 IN_PROGRESS)
```

### 知识状态 (user_knowledge_state.mastery)

```
mastery = 0            → 未学习 (⚪)
0 < mastery < 0.70     → 学习中 (🟡)
mastery ≥ 0.70         → 已掌握 (🟢)
```

每次学习行为记录后自动重新计算 mastery。
