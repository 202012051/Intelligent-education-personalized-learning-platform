# API Contract: 推荐引擎 (recommendation)

**Auth**: JWT Bearer Token required
**Role**: 学生 (STUDENT)

---

## GET /api/courses/{courseId}/learning-path

获取个性化学习路径。推荐引擎按贪心策略排序（薄弱优先+先修约束）。

**Response** (200):
```json
{
  "code": 200, "message": "success", "data": {
    "hasAssessment": true,
    "items": [
      {
        "knowledgePointId": 5,
        "knowledgePointName": "循环语句",
        "mastery": 0.00,
        "reason": "该知识点尚未学习，是无条件分支的基础",
        "priority": 1
      },
      {
        "knowledgePointId": 2,
        "knowledgePointName": "条件语句",
        "mastery": 0.40,
        "reason": "该知识点掌握度仅 40%，建议巩固",
        "priority": 2
      }
    ],
    "overallProgress": 0.35
  }, "timestamp": 1716892800000
}
```

**未测评时** (400):
```json
{"code": 400, "message": "请先完成课程测评", "data": null, "timestamp": 1716892800000}
```
