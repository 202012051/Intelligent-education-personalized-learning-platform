-- ======================================================
-- IEP Platform — Initial Seed Data
-- MVP: 1 course (Python), 10 assessment questions,
--      8 learning style questions, 1 teacher account
-- ======================================================

-- Teacher account (password: 123456, BCrypt hash)
INSERT INTO `user` (`email`, `password_hash`, `nickname`, `role`) VALUES
('teacher@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '王老师', 'TEACHER');

-- Student test account (password: 123456)
INSERT INTO `user` (`email`, `password_hash`, `nickname`, `role`) VALUES
('student@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '测试学生', 'STUDENT');

-- Course: Python 程序设计基础
INSERT INTO `course` (`id`, `name`, `description`, `teacher_id`) VALUES
(1, 'Python 程序设计基础', '零基础入门 Python 编程，涵盖变量、条件、循环、函数等核心知识点', 1);

-- Knowledge points (10)
INSERT INTO `knowledge_point` (`id`, `course_id`, `name`, `description`, `difficulty`, `order_num`) VALUES
(1, 1, '变量与数据类型', 'Python 基本变量定义和常见数据类型（int, float, str, bool）', 1, 1),
(2, 1, '运算符与表达式', '算术、比较、逻辑运算符及表达式求值', 1, 2),
(3, 1, '条件语句', 'if/elif/else 条件分支控制', 2, 3),
(4, 1, '循环语句', 'for 循环和 while 循环的使用', 2, 4),
(5, 1, '列表与元组', '序列类型的基本操作', 2, 5),
(6, 1, '字典与集合', '映射类型和集合类型的用法', 2, 6),
(7, 1, '字符串操作', '字符串格式化、切片、常用方法', 1, 7),
(8, 1, '函数定义与调用', 'def 定义函数、参数传递、返回值', 3, 8),
(9, 1, '文件读写', 'open/read/write 文件操作', 3, 9),
(10, 1, '异常处理', 'try/except/finally 异常捕获', 3, 10);

-- Knowledge point relations (prerequisites)
INSERT INTO `knowledge_relation` (`source_id`, `target_id`, `relation_type`) VALUES
(1, 2, 'PREREQUISITE'),
(2, 3, 'PREREQUISITE'),
(2, 4, 'PREREQUISITE'),
(5, 6, 'PREREQUISITE'),
(3, 8, 'PREREQUISITE'),
(4, 8, 'PREREQUISITE'),
(8, 9, 'PREREQUISITE'),
(9, 10, 'PREREQUISITE');

-- Assessment questions (10, 1 per knowledge point, 2-3 option questions)
INSERT INTO `assessment_question` (`id`, `course_id`, `content`, `options`, `correct_answer`, `knowledge_point_id`) VALUES
(1, 1, '以下哪个是 Python 中合法的变量名？', '["1var", "_name", "class", "my-var"]', 1, 1),
(2, 1, '表达式 7 % 3 的结果是？', '["1", "2", "3", "0"]', 0, 2),
(3, 1, 'Python 中用哪个关键字表示条件判断？', '["if", "for", "while", "def"]', 0, 3),
(4, 1, 'range(3) 生成的数字序列是？', '["0,1,2,3", "1,2,3", "0,1,2", "1,2"]', 2, 4),
(5, 1, '列表中获取第一个元素用哪个索引？', '["0", "1", "-1", "first"]', 0, 5),
(6, 1, '字典中通过什么访问值？', '["索引", "键(key)", "下标", "指针"]', 1, 6),
(7, 1, 'f"{name} is {age} years old" 是什么格式化方式？', '["% 格式化", "format()方法", "f-string", "模板字符串"]', 2, 7),
(8, 1, 'def add(a, b=0): 中 b=0 表示？', '["必选参数", "默认参数", "可变参数", "关键字参数"]', 1, 8),
(9, 1, '打开文件使用什么函数？', '["read()", "open()", "file()", "load()"]', 1, 9),
(10, 1, 'try 语句必须搭配哪个关键字？', '["except", "catch", "error", "handle"]', 0, 10);

-- Learning style questions (8, 2 per dimension)
INSERT INTO `learning_style_question` (`id`, `dimension`, `content`, `option_a`, `option_b`, `option_a_weight`) VALUES
(1, 'ACTIVE_REFLECTIVE', '学习新知识时，我更喜欢：', '先动手尝试运行代码', '先阅读文档理解原理', 'a'),
(2, 'ACTIVE_REFLECTIVE', '遇到问题时，我倾向于：', '不断尝试不同的解决方案', '停下来仔细分析问题原因', 'a'),
(3, 'SENSING_INTUITIVE', '我更喜欢学习：', '有明确步骤和示例的内容', '抽象的概念和理论框架', 'a'),
(4, 'SENSING_INTUITIVE', '在学习中，我更关注：', '具体的代码实现细节', '整体的设计思路和架构', 'a'),
(5, 'VISUAL_VERBAL', '理解新概念时，我偏好：', '看图表、流程图和代码', '阅读文字描述和文档', 'a'),
(6, 'VISUAL_VERBAL', '回顾知识点，我更容易记住：', '课程中的图示和演示', '老师或文档中的讲解', 'a'),
(7, 'SEQUENTIAL_GLOBAL', '学习新内容时，我习惯：', '按顺序一步步深入', '先浏览全局再深入细节', 'a'),
(8, 'SEQUENTIAL_GLOBAL', '解决复杂问题，我通常：', '分步骤逐一攻破', '先理解整体再找关键点', 'a');
