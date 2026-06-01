# API Contract: 认证模块 (auth)

**Base URL**: `http://localhost:8080/api`
**Content-Type**: `application/json`
**Auth**: JWT Bearer Token (除注册/登录外)

## Unified Response Format

```json
{"code": 200, "message": "success", "data": {...}, "timestamp": 1716892800000}
{"code": 400, "message": "参数校验失败", "data": null, "timestamp": 1716892800000}
```

Error codes: 200 (success), 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error).

---

## POST /api/auth/register

注册新用户（默认角色 STUDENT）。

**Request**:
```json
{
  "email": "student@example.com",
  "password": "123456",
  "nickname": "张三"
}
```

**Response** (201):
```json
{"code": 200, "message": "注册成功", "data": {"userId": 1}, "timestamp": 1716892800000}
```

**Errors**: 400 email already exists / invalid format

---

## POST /api/auth/login

用户登录，返回 JWT Token（24h 有效）。

**Request**:
```json
{
  "email": "student@example.com",
  "password": "123456"
}
```

**Response** (200):
```json
{
  "code": 200, "message": "登录成功", "data": {
    "token": "eyJhbGci...",
    "user": {"id": 1, "email": "student@example.com", "nickname": "张三", "role": "STUDENT"}
  }, "timestamp": 1716892800000
}
```

**Errors**: 401 invalid credentials

---

## POST /api/auth/logout

登出（Token 加入 Redis 黑名单）。

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{"code": 200, "message": "已登出", "data": null, "timestamp": 1716892800000}
```

---

## GET /api/auth/me

获取当前用户信息。

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "code": 200, "message": "success", "data": {
    "id": 1, "email": "student@example.com", "nickname": "张三", "role": "STUDENT", "avatarUrl": null
  }, "timestamp": 1716892800000
}
```

---

## PUT /api/auth/profile

更新个人信息（昵称、头像 URL）。

**Headers**: `Authorization: Bearer <token>`

**Request**:
```json
{
  "nickname": "新昵称",
  "avatarUrl": "https://example.com/avatar.png"
}
```

**Response** (200):
```json
{"code": 200, "message": "更新成功", "data": null, "timestamp": 1716892800000}
```
