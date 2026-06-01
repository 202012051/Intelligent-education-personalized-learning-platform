# API Contract: 学习报告 & 风格 & 教师学情 (report)

**Auth**: JWT Bearer Token required

---

## GET /api/courses/{courseId}/reports

生成学生学习报告。

**Role**: 学生 (STUDENT)

**Response** (200):
```json
{
  "code": 200, "message": "success", "data": {
    "knowledgeMastery": [
      {"name": "变量与数据类型", "mastery": 0.85}, {"name": "条件语句", "mastery": 0.40}
    ],
    "weakPoints": [
      {"knowledgePointName": "循环语句", "mastery": 0.00, "suggestion": "建议从 for 循环基础开始学习"}
    ],
    "trend": [
      {"date": "2026-05-29", "progress": 0.10}, {"date": "2026-05-31", "progress": 0.35}
    ],
    "hasRecords": true
  }, "timestamp": 1716892800000
}
```

---

## GET /api/style/questions

获取学习风格问卷题目（8 题）。

**Role**: 学生 (STUDENT)

**Response** (200):
```json
{
  "code": 200, "message": "success", "data": [
    {"id": 1, "dimension": "ACTIVE_REFLECTIVE", "content": "我倾向于...", "optionA": "先动手尝试", "optionB": "先思考理解"}
  ], "timestamp": 1716892800000
}
```

---

## POST /api/style/result

提交学习风格问卷结果。

**Role**: 学生 (STUDENT)

**Request**:
```json
{
  "answers": [
    {"questionId": 1, "choice": "a"},
    ...
  ]
}
```

**Response** (201):
```json
{
  "code": 200, "message": "风格测评完成", "data": {
    "activeReflective": 2,
    "sensingIntuitive": -1,
    "visualVerbal": 1,
    "sequentialGlobal": -2
  }, "timestamp": 1716892800000
}
```

---

## GET /api/style/result

获取用户已保存的学习风格结果。

**Role**: 学生 (STUDENT)

---

## GET /api/teacher/courses/{courseId}/analytics

教师端班级学情概览。

**Role**: 教师 (TEACHER)

**Response** (200):
```json
{
  "code": 200, "message": "success", "data": {
    "totalStudents": 50,
    "overallProgress": 0.42,
    "averageMastery": 0.45,
    "weakPointsTop5": [
      {"knowledgePointName": "循环语句", "averageMastery": 0.15, "studentCount": 45}
    ],
    "studentRanking": [
      {"studentId": 1, "studentName": "张三", "progress": 0.85, "totalDuration": 1200}
    ]
  }, "timestamp": 1716892800000
}
```

---

## GET /api/teacher/courses/{courseId}/students/{studentId}

教师查看单个学生详情。

**Role**: 教师 (TEACHER)

**Response** (200):
```json
{
  "code": 200, "message": "success", "data": {
    "student": {"id": 1, "name": "张三"},
    "knowledgeStates": [
      {"knowledgePointName": "变量与数据类型", "mastery": 0.85, "status": "MASTERED"}
    ],
    "recentRecords": [...]
  }, "timestamp": 1716892800000
}
```
