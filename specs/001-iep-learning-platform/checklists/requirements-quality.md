# Requirements Quality Checklist: 智能教育个性化学习平台

**Purpose**: Validate specification completeness, clarity, and consistency — "Unit Tests for Requirements"
**Created**: 2026-06-01
**Feature**: [spec.md](../spec.md)
**Source Context**: 07-checklist.md (implementation quality checklist — this complements it from requirements perspective)

---

## Requirement Completeness

- [ ] CHK001 — Are requirements defined for what happens when a student answers all 10 diagnostic questions correctly (100% mastery across all knowledge points)? [Completeness, Edge Case, Spec §Edge Cases L120]
- [ ] CHK002 — Are requirements specified for how the system handles knowledge point deletion when students already have associated learning records and knowledge states? [Completeness, Spec §Edge Cases L124]
- [ ] CHK003 — Is the learning path generation behavior specified for the case when no "unmastered" knowledge points exist but prerequisites form a disconnected graph? [Completeness, Gap]
- [ ] CHK004 — Are email verification requirements defined for the registration flow (verification link, retry, expiration)? [Gap, Spec §FR-001]
- [ ] CHK005 — Are password strength and reset/recovery requirements defined? [Gap, Spec §FR-001]
- [ ] CHK006 — Are concurrent edit conflict requirements specified for when a teacher modifies knowledge point relations while a student is viewing the learning path? [Completeness, Spec §Edge Cases L125]
- [ ] CHK007 — Are requirements defined for the teacher's course deletion cascade — what happens to associated knowledge points, relations, student states, and records? [Gap, Spec §FR-014]

## Requirement Clarity

- [ ] CHK008 — Is "learning behavior发生后自动重新计算知识状态" [Spec §FR-008] clarified with the specific trigger events and recalculation formula? [Clarity, Spec §FR-008]
- [ ] CHK009 — Is "知识热力图" [Spec §FR-011] defined with precise visual properties — what data dimensions does it encode, and what color scale is used? [Clarity, Spec §FR-011]
- [ ] CHK010 — Is "个性化改进建议" [Spec §FR-013] specified with a generation algorithm or template to ensure suggestions are actionable rather than generic? [Clarity, Spec §FR-013]
- [ ] CHK011 — Is the recommendation reason format [Spec §FR-006] fully specified, including which data attributes can appear in the reason text? [Clarity, Spec §FR-006]
- [ ] CHK012 — Are the three knowledge point relation types (先修/包含/相关) [Spec §FR-014] semantically defined with distinct behavioral implications for the learning path algorithm? [Clarity, Spec §FR-014]
- [ ] CHK013 — Is "断点续答" [Spec §FR-018] clarified: does it save per-question or per-session, and for how long is partial progress retained? [Clarity, Spec §FR-018]

## Requirement Consistency

- [ ] CHK014 — Do the mastery threshold (≥0.70) in FR-004, FR-010, and the learning path refresh logic in FR-008 use a consistent definition of "已掌握" across all references? [Consistency, Spec §FR-004, §FR-008, §FR-010]
- [ ] CHK015 — Are the dashboard data items in FR-011 consistent with the data model entities (KnowledgeState, LearningRecord, LearningPathItem)? [Consistency, Spec §FR-011 vs data-model.md]
- [ ] CHK016 — Does the teacher analytics in FR-015 aggregate the same knowledge state data that the student dashboard in FR-011 displays — is there a single source of truth for mastery data? [Consistency, Spec §FR-011, §FR-015]
- [ ] CHK017 — Are the assessment question count (10) and knowledge point count (10) in FR-003 consistent with the 1-question-per-knowledge-point implied by the seed data? [Consistency, Spec §FR-003 vs init-data.sql]

## Acceptance Criteria Quality

- [ ] CHK018 — Can SC-001 "总耗时不超过5分钟" be objectively measured given that reading speed and prior knowledge vary across students? [Measurability, Spec §SC-001]
- [ ] CHK019 — Is the measurement methodology for SC-005 "100名学生同时在线学习无性能降级" specified — what constitutes "降级", and under what workload pattern? [Measurability, Spec §SC-005]
- [ ] CHK020 — Can SC-007 "90%的学生能在首次测评中完整提交问卷" be verified during development, or is it a post-launch metric? [Measurability, Spec §SC-007]
- [ ] CHK021 — Is SC-003 "含50个节点在3秒内完成渲染" scoped to network conditions — is it measured on localhost, LAN, or typical broadband? [Clarity, Spec §SC-003]

## Scenario Coverage

- [ ] CHK022 — Are requirements defined for the student's first-time experience when they log in without having completed any assessment — what does the dashboard show? [Coverage, Alternate Flow, Spec §US1, Clarifications Q3]
- [ ] CHK023 — Are requirements specified for the teacher's empty-state scenario when no students have joined a course yet? [Coverage, Spec §FR-015]
- [ ] CHK024 — Are requirements defined for multi-course scenarios — if a student belongs to multiple courses, how are knowledge states and learning paths aggregated or separated? [Coverage, Spec §Edge Cases L123]
- [ ] CHK025 — Is the learning record deduplication behavior specified — if a student revisits the same page or retakes the same quiz, are all attempts recorded or only the latest? [Coverage, Spec §Edge Cases L127]
- [ ] CHK026 — Are requirements defined for what the learning report displays when a student has completed the diagnostic but has zero learning records? [Coverage, Spec §US4 Acceptance Scenario 3]

## Edge Case Coverage

- [ ] CHK027 — Are requirements defined for the system response when a student's JWT token expires mid-assessment session? [Edge Case, Gap]
- [ ] CHK028 — Are requirements specified for browser compatibility edge cases — what happens when ECharts force-directed graph fails to render on an unsupported browser? [Edge Case, Spec Assumptions §Browser]
- [ ] CHK029 — Is the behavior specified when a knowledge point has zero associated assessment questions — can it still appear in the learning path? [Edge Case, Gap]
- [ ] CHK030 — Are requirements defined for the case when the Felder-Silverman questionnaire returns perfectly neutral scores (all zeros) — what does the radar display and how does it affect recommendations? [Edge Case, Spec §FR-012]

## Non-Functional Requirements

- [ ] CHK031 — Are data retention and archival requirements specified for learning records — how long are records kept, and what happens after course deletion? [Gap]
- [ ] CHK032 — Are accessibility requirements (WCAG level, screen reader support, keyboard navigation) defined for the interactive knowledge graph and dashboard? [Gap]
- [ ] CHK033 — Is the observability strategy (logging levels, metrics, error tracking) specified in the requirements beyond the API error format assumption? [Gap]
- [ ] CHK034 — Are requirements for session concurrency defined — can a student be logged in from multiple devices simultaneously? [Gap, Spec §FR-001]

## Dependencies & Assumptions

- [ ] CHK035 — Is the assumption "采购单、销售订单、生产单等上游单据由外部系统提供" validated against the actual external system availability timeline? [Assumption validation, Spec §Assumptions]
- [ ] CHK036 — Is the assumption of "条码扫描设备可用" [Spec §Assumptions] scoped — which specific scanner models or protocols are supported? [Clarity, Spec §Assumptions]
- [ ] CHK037 — Are the external dependency failure modes specified — what happens when MySQL or Redis is unavailable during an assessment or learning path request? [Dependency, Gap]

## Ambiguities & Conflicts

- [ ] CHK038 — Does the term "实时" in "库存实时减少" conflict with the eventual-consistency model implied by the "前端可在下次进入仪表盘时重新拉取" refresh strategy [Spec §FR-008]? [Ambiguity, Spec §FR-008]
- [ ] CHK039 — Is there a conflict between "测评非强制" [Clarifications Q3] and the requirement that "生成个性化学习路径必须完成测评" [FR-005] — should the system proactively guide unassessed students toward assessment? [Conflict, Spec §FR-005 vs Clarifications Q3]
- [ ] CHK040 — Does the learning style result [Spec §US4] feed into the recommendation algorithm as stated in the module dependency topology [plan.md], or is this deferred to a future iteration? [Ambiguity, Spec §US4 vs plan.md §Module Dependencies]
