# API Contract: 学习记录与仪表盘 (learning-record)

**Auth**: JWT Bearer Token required
**Role**: 学生 (STUDENT)

---

## POST /api/courses/{courseId}/records

记录学习行为。

**Request**:
```json
{
  "knowledgePointId": 2,
  "recordType": "QUIZ",
  "durationSeconds": 120,
  "detail": {"totalQuestions": 5, "correctCount": 4}
}
```

**Response** (201):
```json
{"code": 200, "message": "记录成功", "data": {"recordId": 1}, "timestamp": 1716892800000}
```

---

## GET /api/courses/{courseId}/records?days=7

获取最近 N 天的学习记录。

**Response** (200):
```json
{
  "code": 200, "message": "success", "data": [
    {"id": 1, "knowledgePointName": "条件语句", "recordType": "QUIZ", "durationSeconds": 120, "createdAt": "2026-05-31T14:30:00"}
  ], "timestamp": 1716892800000
}
```

---

## GET /api/courses/{courseId}/dashboard

获取学习仪表盘聚合数据。

**Response** (200):
```json
{
  "code": 200, "message": "success", "data": {
    "overallProgress": 0.35,
    "nextRecommendation": {"knowledgePointId": 5, "knowledgePointName": "循环语句", "reason": "尚未学习"},
    "recentRecords": [
      {"knowledgePointName": "条件语句", "recordType": "QUIZ", "createdAt": "2026-05-31T14:30:00"}
    ],
    "weeklyDuration": 320,
    "heatmap": [
      {"knowledgePointName": "变量与数据类型", "mastery": 0.85, "status": "MASTERED"},
      {"knowledgePointName": "条件语句", "mastery": 0.40, "status": "LEARNING"}
    ]
  }, "timestamp": 1716892800000
}
```
