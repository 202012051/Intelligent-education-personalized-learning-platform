package com.iep.module01_user.controller;

import com.iep.common.ApiResult;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HealthController {

    private final JdbcTemplate jdbc;
    public HealthController(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    @GetMapping("/api/health")
    public ApiResult<Map<String, Object>> health() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("status", "ok");
        try {
            Integer cnt = jdbc.queryForObject("SELECT COUNT(*) FROM user", Integer.class);
            data.put("db", "connected, users=" + cnt);
        } catch (Exception e) {
            data.put("db", "error: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }
        return ApiResult.success(data);
    }
}
