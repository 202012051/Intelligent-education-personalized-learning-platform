INSERT INTO user (email, password_hash, nickname, role) VALUES
('demo@test.com', 'DEMO_NOT_HASHED', '演示学生', 'STUDENT')
ON DUPLICATE KEY UPDATE nickname='演示学生';
SELECT email, LEFT(password_hash, 10) as pwd_prefix FROM user WHERE email='demo@test.com';
