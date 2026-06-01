DELETE FROM user WHERE email IN ('student@test.com','teacher@test.com');
INSERT INTO user (email, password_hash, nickname, role) VALUES
('student@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '测试学生', 'STUDENT');
INSERT INTO user (email, password_hash, nickname, role) VALUES
('teacher@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '王老师', 'TEACHER');
