-- ======================================================
-- IEP Learning Platform — Database Schema v1.0
-- 智能教育个性化学习平台 11 张表 DDL
-- ======================================================

CREATE DATABASE IF NOT EXISTS iep_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE iep_db;

-- -------------------------------------------------------
-- 1. user (用户表)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    `email` VARCHAR(255) NOT NULL UNIQUE COMMENT '邮箱（登录账号）',
    `password_hash` VARCHAR(255) NOT NULL COMMENT 'BCrypt加密密码',
    `nickname` VARCHAR(100) NOT NULL COMMENT '昵称',
    `role` VARCHAR(20) NOT NULL DEFAULT 'STUDENT' COMMENT '角色: STUDENT/TEACHER/ADMIN',
    `avatar_url` VARCHAR(500) NULL COMMENT '头像URL',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_email` (`email`),
    INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- -------------------------------------------------------
-- 2. course (课程表)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `course` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '课程ID',
    `name` VARCHAR(200) NOT NULL COMMENT '课程名称',
    `description` TEXT NULL COMMENT '课程描述',
    `teacher_id` BIGINT NOT NULL COMMENT '创建教师ID',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_teacher_id` (`teacher_id`),
    CONSTRAINT `fk_course_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程表';

-- -------------------------------------------------------
-- 3. knowledge_point (知识点表)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `knowledge_point` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '知识点ID',
    `course_id` BIGINT NOT NULL COMMENT '所属课程ID',
    `name` VARCHAR(200) NOT NULL COMMENT '知识点名称',
    `description` TEXT NULL COMMENT '知识点描述',
    `difficulty` INT NOT NULL DEFAULT 1 COMMENT '难度等级(1-5)',
    `order_num` INT NOT NULL DEFAULT 0 COMMENT '排序序号',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_course_id` (`course_id`),
    CONSTRAINT `fk_kp_course` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='知识点表';

-- -------------------------------------------------------
-- 4. knowledge_relation (知识点关系表)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `knowledge_relation` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '关系ID',
    `source_id` BIGINT NOT NULL COMMENT '源知识点ID',
    `target_id` BIGINT NOT NULL COMMENT '目标知识点ID',
    `relation_type` VARCHAR(20) NOT NULL COMMENT '关系类型: PREREQUISITE/CONTAINS/RELATED',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY `uk_relation` (`source_id`, `target_id`, `relation_type`),
    CONSTRAINT `fk_rel_source` FOREIGN KEY (`source_id`) REFERENCES `knowledge_point`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_rel_target` FOREIGN KEY (`target_id`) REFERENCES `knowledge_point`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='知识点关系表';

-- -------------------------------------------------------
-- 5. assessment_question (测评题目表)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `assessment_question` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '题目ID',
    `course_id` BIGINT NOT NULL COMMENT '所属课程ID',
    `content` TEXT NOT NULL COMMENT '题目内容',
    `options` JSON NOT NULL COMMENT '选项列表',
    `correct_answer` INT NOT NULL COMMENT '正确答案索引(0-based)',
    `knowledge_point_id` BIGINT NULL COMMENT '关联知识点ID',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_course_id` (`course_id`),
    INDEX `idx_kp_id` (`knowledge_point_id`),
    CONSTRAINT `fk_aq_course` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_aq_kp` FOREIGN KEY (`knowledge_point_id`) REFERENCES `knowledge_point`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='测评题目表';

-- -------------------------------------------------------
-- 6. user_assessment (用户测评表)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_assessment` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '测评ID',
    `user_id` BIGINT NOT NULL COMMENT '学生ID',
    `course_id` BIGINT NOT NULL COMMENT '课程ID',
    `status` VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS' COMMENT '状态: IN_PROGRESS/COMPLETED',
    `started_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '开始时间',
    `completed_at` DATETIME NULL COMMENT '完成时间',
    `current_question_index` INT NOT NULL DEFAULT 0 COMMENT '当前答题索引',
    INDEX `idx_user_course` (`user_id`, `course_id`),
    CONSTRAINT `fk_ua_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ua_course` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户测评表';

-- -------------------------------------------------------
-- 7. user_assessment_answer (测评答题记录表)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_assessment_answer` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '答题记录ID',
    `assessment_id` BIGINT NOT NULL COMMENT '测评ID',
    `question_id` BIGINT NOT NULL COMMENT '题目ID',
    `selected_answer` INT NOT NULL COMMENT '所选答案索引',
    `is_correct` BOOLEAN NOT NULL COMMENT '是否正确',
    `answered_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '答题时间',
    INDEX `idx_assessment_id` (`assessment_id`),
    CONSTRAINT `fk_uaa_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `user_assessment`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_uaa_question` FOREIGN KEY (`question_id`) REFERENCES `assessment_question`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='测评答题记录表';

-- -------------------------------------------------------
-- 8. user_knowledge_state (用户知识状态表)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_knowledge_state` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '状态ID',
    `user_id` BIGINT NOT NULL COMMENT '学生ID',
    `course_id` BIGINT NOT NULL COMMENT '课程ID',
    `knowledge_point_id` BIGINT NOT NULL COMMENT '知识点ID',
    `mastery` DECIMAL(5,4) NOT NULL DEFAULT 0 COMMENT '掌握度(0.0000~1.0000)',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY `uk_user_course_kp` (`user_id`, `course_id`, `knowledge_point_id`),
    CONSTRAINT `fk_uks_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_uks_course` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_uks_kp` FOREIGN KEY (`knowledge_point_id`) REFERENCES `knowledge_point`(`id`) ON DELETE CASCADE,
    CONSTRAINT `chk_mastery_range` CHECK (`mastery` >= 0 AND `mastery` <= 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户知识状态表';

-- -------------------------------------------------------
-- 9. learning_record (学习行为记录表)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `learning_record` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
    `user_id` BIGINT NOT NULL COMMENT '学生ID',
    `course_id` BIGINT NOT NULL COMMENT '课程ID',
    `knowledge_point_id` BIGINT NULL COMMENT '关联知识点ID',
    `record_type` VARCHAR(20) NOT NULL COMMENT '记录类型: QUIZ/PAGE_VIEW/VIDEO',
    `duration_seconds` INT NOT NULL DEFAULT 0 COMMENT '耗时(秒)',
    `detail` JSON NULL COMMENT '详细数据',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录时间',
    INDEX `idx_user_course` (`user_id`, `course_id`),
    INDEX `idx_kp` (`knowledge_point_id`),
    INDEX `idx_created_at` (`created_at`),
    CONSTRAINT `fk_lr_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_lr_course` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_lr_kp` FOREIGN KEY (`knowledge_point_id`) REFERENCES `knowledge_point`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学习行为记录表';

-- -------------------------------------------------------
-- 10. learning_style_question (学习风格问卷题目表)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `learning_style_question` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '题目ID',
    `dimension` VARCHAR(30) NOT NULL COMMENT '维度: ACTIVE_REFLECTIVE/SENSING_INTUITIVE/VISUAL_VERBAL/SEQUENTIAL_GLOBAL',
    `content` TEXT NOT NULL COMMENT '题目内容',
    `option_a` VARCHAR(200) NOT NULL COMMENT '选项A',
    `option_b` VARCHAR(200) NOT NULL COMMENT '选项B',
    `option_a_weight` CHAR(1) NOT NULL COMMENT 'A端维度侧: a/b',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    CONSTRAINT `chk_dimension` CHECK (`dimension` IN ('ACTIVE_REFLECTIVE','SENSING_INTUITIVE','VISUAL_VERBAL','SEQUENTIAL_GLOBAL')),
    CONSTRAINT `chk_weight` CHECK (`option_a_weight` IN ('a','b'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学习风格问卷题目表';

-- -------------------------------------------------------
-- 11. user_learning_style (用户学习风格结果表)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_learning_style` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '结果ID',
    `user_id` BIGINT NOT NULL UNIQUE COMMENT '学生ID',
    `active_reflective` INT NOT NULL COMMENT '活跃/沉思得分(-3~3)',
    `sensing_intuitive` INT NOT NULL COMMENT '感悟/直觉得分(-3~3)',
    `visual_verbal` INT NOT NULL COMMENT '视觉/言语得分(-3~3)',
    `sequential_global` INT NOT NULL COMMENT '序列/综合得分(-3~3)',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '测试时间',
    CONSTRAINT `fk_uls_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `chk_ar_range` CHECK (`active_reflective` >= -3 AND `active_reflective` <= 3),
    CONSTRAINT `chk_si_range` CHECK (`sensing_intuitive` >= -3 AND `sensing_intuitive` <= 3),
    CONSTRAINT `chk_vv_range` CHECK (`visual_verbal` >= -3 AND `visual_verbal` <= 3),
    CONSTRAINT `chk_sg_range` CHECK (`sequential_global` >= -3 AND `sequential_global` <= 3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户学习风格结果表';
