SELECT id, email, LEFT(password_hash, 20) as hash_start, role FROM user;
