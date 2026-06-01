package com.iep.module01_user.controller;

import com.iep.common.ApiResult;
import com.iep.module01_user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ApiResult<Map<String, Object>> register(@RequestBody Map<String, String> body) {
        return userService.register(
                body.get("email"),
                body.get("password"),
                body.get("nickname")
        );
    }

    @PostMapping("/login")
    public ApiResult<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        return userService.login(body.get("email"), body.get("password"));
    }

    @GetMapping("/me")
    public ApiResult<Map<String, Object>> me(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return userService.getProfile(userId);
    }
}
