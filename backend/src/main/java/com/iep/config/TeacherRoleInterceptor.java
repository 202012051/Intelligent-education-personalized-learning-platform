package com.iep.config;

import com.iep.common.ApiResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class TeacherRoleInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String role = (String) request.getAttribute("userRole");
        if (!"TEACHER".equals(role)) {
            response.setContentType("application/json;charset=UTF-8");
            response.setStatus(403);
            response.getWriter().write(new ObjectMapper().writeValueAsString(
                    ApiResult.forbidden("需要教师权限访问此接口")
            ));
            return false;
        }
        return true;
    }
}
