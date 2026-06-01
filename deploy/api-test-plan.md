# API Integration Test Plan — IEP Platform

**Purpose**: 前后端联调验证，覆盖所有 API 接口
**Date**: 2026-06-01

## Test Environment

- Backend: `http://localhost:8080/api`
- Frontend: `http://localhost:5173`
- Database: MySQL 8.0 `iep_db`
- Cache: Redis 7 `localhost:6379`

## Test Flow

### 1. Auth Module (M01)

| # | Method | Endpoint | Expected | Status |
|---|--------|----------|----------|--------|
| 1.1 | POST | `/api/auth/register` | 201, {"code":200} | ⬜ |
| 1.2 | POST | `/api/auth/login` | 200, {token, user} | ⬜ |
| 1.3 | GET | `/api/auth/me` | 200, user info | ⬜ |
| 1.4 | POST | `/api/auth/logout` | 200 | ⬜ |
| 1.5 | PUT | `/api/auth/profile` | 200 | ⬜ |

### 2. Course Module (M02)

| # | Method | Endpoint | Expected | Status |
|---|--------|----------|----------|--------|
| 2.1 | GET | `/api/courses` | 200, course list | ⬜ |
| 2.2 | POST | `/api/courses` | 201 (Teacher only) | ⬜ |
| 2.3 | GET | `/api/courses/{id}/knowledge-points` | 200 | ⬜ |
| 2.4 | POST | `/api/courses/{id}/knowledge-points` | 201 | ⬜ |
| 2.5 | POST | `/api/courses/{id}/knowledge-points/relations` | 201 | ⬜ |
| 2.6 | GET | `/api/courses/{id}/knowledge-graph` | 200, {nodes, edges} | ⬜ |

### 3. Assessment Module (M03)

| # | Method | Endpoint | Expected | Status |
|---|--------|----------|----------|--------|
| 3.1 | POST | `/api/courses/{id}/assessments` | 200/201 | ⬜ |
| 3.2 | GET | `/api/assessments/{id}/questions/{idx}` | 200 | ⬜ |
| 3.3 | POST | `/api/assessments/{id}/answers` | 200 | ⬜ |
| 3.4 | POST | `/api/assessments/{id}/complete` | 200, knowledgeStates | ⬜ |
| 3.5 | GET | `/api/courses/{id}/knowledge-states` | 200 | ⬜ |

### 4. Recommendation Module (M04)

| # | Method | Endpoint | Expected | Status |
|---|--------|----------|----------|--------|
| 4.1 | GET | `/api/courses/{id}/learning-path` | 200 (assessed) / 400 (not assessed) | ⬜ |

### 5. Learning Record Module (M05)

| # | Method | Endpoint | Expected | Status |
|---|--------|----------|----------|--------|
| 5.1 | POST | `/api/courses/{id}/records` | 201 | ⬜ |
| 5.2 | GET | `/api/courses/{id}/records?days=7` | 200 | ⬜ |
| 5.3 | GET | `/api/courses/{id}/dashboard` | 200 | ⬜ |

### 6. Report & Style (M06, M08)

| # | Method | Endpoint | Expected | Status |
|---|--------|----------|----------|--------|
| 6.1 | GET | `/api/courses/{id}/reports` | 200 | ⬜ |
| 6.2 | GET | `/api/style/questions` | 200, 8 questions | ⬜ |
| 6.3 | POST | `/api/style/result` | 201 | ⬜ |
| 6.4 | GET | `/api/style/result` | 200 | ⬜ |

### 7. Teacher Module (M09) — NEW

| # | Method | Endpoint | Expected | Status |
|---|--------|----------|----------|--------|
| 7.1 | GET | `/api/teacher/courses/{id}/analytics` | 200 (Teacher only) | ⬜ |
| 7.2 | GET | `/api/teacher/courses/{id}/students/{sid}` | 200 (Teacher only) | ⬜ |
| 7.3 | GET | `/api/teacher/courses/{id}/analytics` | 403 (Student role) | ⬜ |

## Edge Case Scenarios

- [ ] 未测评学生调用 `/learning-path` → 400 "请先完成课程测评"
- [ ] 未认证请求 → 401
- [ ] 学生角色调用 `/api/teacher/*` → 403
- [ ] 并发提交同一测评答案 → 无重复记录
- [ ] 循环依赖关系创建 → 400 校验拒绝
