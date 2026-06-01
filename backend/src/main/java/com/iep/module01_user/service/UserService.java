package com.iep.module01_user.service;

import com.iep.common.ApiResult;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class UserService {

    private final JdbcTemplate jdbc;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public UserService(JdbcTemplate jdbc, PasswordEncoder passwordEncoder) {
        this.jdbc = jdbc;
        this.passwordEncoder = passwordEncoder;
    }

    public ApiResult<Map<String, Object>> register(String email, String password, String nickname) {
        if (email == null || email.isBlank()) return ApiResult.badRequest("邮箱不能为空");
        if (password == null || password.length() < 6) return ApiResult.badRequest("密码至少 6 位");

        Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM user WHERE email = ?", Integer.class, email);
        if (count != null && count > 0) return ApiResult.badRequest("邮箱已被注册");

        String hash = passwordEncoder.encode(password);
        jdbc.update("INSERT INTO user (email, password_hash, nickname, role) VALUES (?, ?, ?, 'STUDENT')", email, hash, nickname != null ? nickname : email.split("@")[0]);

        Long userId = jdbc.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
        return ApiResult.success("注册成功", Map.of("userId", userId != null ? userId : 0));
    }

    public ApiResult<Map<String, Object>> login(String email, String password) {
        List<Map<String, Object>> rows = jdbc.queryForList("SELECT * FROM user WHERE email = ?", email);
        if (rows.isEmpty()) return ApiResult.unauthorized("邮箱或密码错误");

        Map<String, Object> row = rows.get(0);
        String storedHash = (String) row.get("password_hash");
        boolean ok = false;
        try { ok = passwordEncoder.matches(password, storedHash); } catch (Exception ignored) {}
        ok = ok || password.equals(storedHash);
        if (!ok) return ApiResult.unauthorized("邮箱或密码错误");

        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        String token = Jwts.builder()
                .subject(email)
                .claim("userId", row.get("id"))
                .claim("role", row.get("role"))
                .issuedAt(new Date()).expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(key).compact();

        Map<String, Object> userInfo = new LinkedHashMap<>();
        userInfo.put("id", row.get("id"));
        userInfo.put("email", email);
        userInfo.put("nickname", row.get("nickname"));
        userInfo.put("role", row.get("role"));

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("token", token);
        data.put("user", userInfo);
        return ApiResult.success("登录成功", data);
    }

    public ApiResult<Map<String, Object>> getProfile(Long userId) {
        List<Map<String, Object>> rows = jdbc.queryForList("SELECT id, email, nickname, role, avatar_url FROM user WHERE id = ?", userId);
        if (rows.isEmpty()) return ApiResult.notFound("用户不存在");
        return ApiResult.success(rows.get(0));
    }
}
