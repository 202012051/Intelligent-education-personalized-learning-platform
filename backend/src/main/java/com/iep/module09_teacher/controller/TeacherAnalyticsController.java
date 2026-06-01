package com.iep.module09_teacher.controller;

import com.iep.common.ApiResult;
import com.iep.module09_teacher.service.TeacherAnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/teacher")
public class TeacherAnalyticsController {

    private final TeacherAnalyticsService analyticsService;

    public TeacherAnalyticsController(TeacherAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    /**
     * T039: 班级学情概览
     * GET /api/teacher/courses/{courseId}/analytics
     */
    @GetMapping("/courses/{courseId}/analytics")
    public ApiResult<Map<String, Object>> getCourseAnalytics(@PathVariable Long courseId) {
        Map<String, Object> data = analyticsService.getCourseAnalytics(courseId);
        return ApiResult.success(data);
    }

    /**
     * T040: 单个学生详情
     * GET /api/teacher/courses/{courseId}/students/{studentId}
     */
    @GetMapping("/courses/{courseId}/students/{studentId}")
    public ApiResult<Map<String, Object>> getStudentDetail(
            @PathVariable Long courseId, @PathVariable Long studentId) {
        Map<String, Object> data = analyticsService.getStudentDetail(courseId, studentId);
        return ApiResult.success(data);
    }
}
