# API Contract: 认知诊断 (assessment)

**Auth**: JWT Bearer Token required
**Role**: 学生 (STUDENT)

---

## POST /api/courses/{courseId}/assessments

开始（或恢复）一次课程测评。如果已有 IN_PROGRESS 状态的测评，返回已有的（断点续答）。

**Response** (201 / 200):
```json
{
  "code": 200, "message": "success", "data": {
    "assessmentId": 1,
    "status": "IN_PROGRESS",
    "totalQuestions": 10,
    "currentQuestionIndex": 0
  }, "timestamp": 1716892800000
}
```

---

## GET /api/assessments/{assessmentId}/questions/{index}

获取测评的第 N 题（0-based）。

**Response** (200):
```json
{
  "code": 200, "message": "success", "data": {
    "questionId": 1,
    "content": "Python 中定义变量的正确方式是？",
    "options": ["a = 1", "int a = 1", "var a = 1", "let a = 1"],
    "totalQuestions": 10,
    "currentIndex": 0,
    "hasPrevious": false,
    "hasNext": true
  }, "timestamp": 1716892800000
}
```

---

## POST /api/assessments/{assessmentId}/answers

提交当前题目的答案。

**Request**:
```json
{
  "questionId": 1,
  "selectedAnswer": 0
}
```

**Response** (200):
```json
{
  "code": 200, "message": "已提交", "data": {
    "answeredCount": 3,
    "totalQuestions": 10,
    "isLast": false
  }, "timestamp": 1716892800000
}
```

---

## POST /api/assessments/{assessmentId}/complete

完成测评，触发知识状态计算。

**Response** (200):
```json
{
  "code": 200, "message": "测评完成", "data": {
    "knowledgeStates": [
      {"knowledgePointId": 1, "knowledgePointName": "变量与数据类型", "mastery": 0.85, "status": "MASTERED"},
      {"knowledgePointId": 2, "knowledgePointName": "条件语句", "mastery": 0.40, "status": "LEARNING"}
    ],
    "overallProgress": 0.40
  }, "timestamp": 1716892800000
}
```

**Errors**: 400 题目未全部答完

---

## GET /api/courses/{courseId}/knowledge-states

获取当前学生在课程中各知识点的掌握状态。

**Response** (200):
```json
{
  "code": 200, "message": "success", "data": [
    {"knowledgePointId": 1, "knowledgePointName": "变量与数据类型", "mastery": 0.85, "status": "MASTERED"},
    {"knowledgePointId": 2, "knowledgePointName": "条件语句", "mastery": 0.40, "status": "LEARNING"},
    {"knowledgePointId": 3, "knowledgePointName": "循环语句", "mastery": 0.00, "status": "NOT_LEARNED"}
  ], "timestamp": 1716892800000
}
```
