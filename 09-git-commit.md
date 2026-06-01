# 智能教育个性化学习平台 — Git 提交方案

> SpecKit /speckit.git.commit · 2026-06-01

---

## 一、分支策略

```
main
 └── dev
       ├── feature/m01-user         (✅ 已开发)
       ├── feature/m02-course       (✅ 已开发)
       ├── feature/m03-diagnosis    (✅ 已开发)
       ├── feature/m04-recommend    (✅ 已开发)
       ├── feature/m05-records      (✅ 已开发)
       ├── feature/m07-graph        (⬜ 待开发)
       ├── feature/m08-style        (✅ 已开发)
       ├── feature/m09-teacher      (⬜ 待开发)
       └── feature/m10-testing      (⬜ 待开发)
```

---

## 二、首次提交方案

```bash
# 1. 初始化仓库
cd intelligent-edu-platform
git init
git checkout -b dev

# 2. 提交项目骨架
git add README.md .gitignore
git commit -m "chore: 初始化项目骨架，添加 README 和 .gitignore"

# 3. 提交数据库脚本
git add docs/sql/
git commit -m "chore: 添加数据库初始化脚本（11张表 + 种子数据）"

# 4. 提交后端代码
git add backend/
git commit -m "feat: 完成后端 M01-M08 模块开发

模块覆盖:
- M01 用户管理 (注册/登录/JWT)
- M02 课程管理 (课程/知识点/知识图谱 CRUD)
- M03 认知诊断 (测评/规则引擎/知识状态)
- M04 推荐引擎 (贪心算法/学习路径)
- M05 学习记录 (行为记录/进度统计)
- M06 学习报告 (掌握度/薄弱点/建议)
- M08 学习风格 (Felder-Silverman 问卷)

技术栈: Spring Boot 3.2 + MyBatis + MySQL + Redis + JWT"

# 5. 提交 SpecKit 文档
git add docs/specs/
git commit -m "docs: 完成 SpecKit 全套文档 (①~⑩)"

# 6. 推送
git remote add origin <repo-url>
git push -u origin dev
```

---

## 三、.gitignore 建议

```gitignore
# Java
target/
*.class
*.jar
*.war

# IDE
.idea/
*.iml
.vscode/
.settings/
.project
.classpath

# Maven
.mvn/
mvnw
mvnw.cmd

# Node (前端)
node_modules/
dist/
.env.local

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Temp
/tmp/
*.tmp
```

---

## 四、后续提交规范

```
格式: <type>: [模块] 简要描述

type:
  feat     → 新功能
  fix      → Bug 修复
  docs     → 文档
  refactor → 重构
  test     → 测试
  chore    → 构建/工具

示例:
  feat: [M01] 实现邮箱注册接口
  fix: [M03] 修复测评提交时外键为空的 Bug
  docs: [README] 补充部署说明
  test: [M10] 添加用户模块单元测试
```
