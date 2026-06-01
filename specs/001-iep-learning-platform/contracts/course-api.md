# API Contract: 课程管理 & 知识图谱 (course)

**Auth**: JWT Bearer Token required
**Role**: 教师 (TEACHER) for CUD, 学生/教师 for Read

---

## GET /api/courses

获取课程列表（学生看已加入，教师看自己创建的）。

**Response** (200):
```json
{
  "code": 200, "message": "success", "data": [
    {"id": 1, "name": "Python 程序设计基础", "description": "...", "teacherId": 2, "teacherName": "王老师"}
  ], "timestamp": 1716892800000
}
```

---

## POST /api/courses

创建课程（教师权限）。

**Request**:
```json
{
  "name": "Python 程序设计基础",
  "description": "零基础入门课程"
}
```

**Response** (201):
```json
{"code": 200, "message": "创建成功", "data": {"courseId": 1}, "timestamp": 1716892800000}
```

---

## GET /api/courses/{courseId}/knowledge-points

获取课程的知识点列表。

**Response** (200):
```json
{
  "code": 200, "message": "success", "data": [
    {"id": 1, "name": "变量与数据类型", "description": "...", "difficulty": 1, "orderNum": 1}
  ], "timestamp": 1716892800000
}
```

---

## POST /api/courses/{courseId}/knowledge-points

添加知识点（教师权限）。

**Request**:
```json
{
  "name": "变量与数据类型",
  "description": "Python 基本变量和数据类型介绍",
  "difficulty": 1,
  "orderNum": 1
}
```

---

## DELETE /api/courses/{courseId}/knowledge-points/{kpId}

删除知识点（教师权限）。**校验**: 若有学习记录关联，返回错误提示。

---

## POST /api/courses/{courseId}/knowledge-points/relations

定义知识点关系（教师权限）。

**Request**:
```json
{
  "sourceId": 1,
  "targetId": 2,
  "relationType": "PREREQUISITE"
}
```

**校验**: 不允许形成循环依赖（如 A→B→A）。

**Response** (201):
```json
{"code": 200, "message": "关系创建成功", "data": {"relationId": 1}, "timestamp": 1716892800000}
```

---

## GET /api/courses/{courseId}/knowledge-graph

获取课程知识图谱结构（节点+边），含学生掌握状态（如已认证）。

**Response** (200):
```json
{
  "code": 200, "message": "success", "data": {
    "nodes": [
      {"id": 1, "name": "变量与数据类型", "difficulty": 1, "mastery": 0.85, "status": "MASTERED"}
    ],
    "edges": [
      {"sourceId": 1, "targetId": 2, "relationType": "PREREQUISITE"}
    ]
  }, "timestamp": 1716892800000
}
```
