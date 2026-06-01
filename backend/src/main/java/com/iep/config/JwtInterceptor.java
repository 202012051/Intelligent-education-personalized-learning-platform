package com.iep.config;

import com.iep.common.ApiResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Value("${jwt.secret}")
    private String secret;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setContentType("application/json;charset=UTF-8");
            response.setStatus(401);
            response.getWriter().write(new ObjectMapper().writeValueAsString(
                    ApiResult.unauthorized("请先登录")
            ));
            return false;
        }
        try {
            String token = authHeader.substring(7);
            SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
            Claims claims = Jwts.parser().verifyWith(key).build()
                    .parseSignedClaims(token).getPayload();
            request.setAttribute("userId", claims.get("userId", Long.class));
            request.setAttribute("userRole", claims.get("role", String.class));
            request.setAttribute("userEmail", claims.getSubject());
            return true;
        } catch (Exception e) {
            response.setContentType("application/json;charset=UTF-8");
            response.setStatus(401);
            response.getWriter().write(new ObjectMapper().writeValueAsString(
                    ApiResult.unauthorized("Token 无效或已过期")
            ));
            return false;
        }
    }
}
