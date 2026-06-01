package com.iep.module09_teacher.service;

import com.iep.common.ApiResult;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;

@Service
public class TeacherAnalyticsService {

    private final DataSource dataSource;

    public TeacherAnalyticsService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * 获取班级学情概览
     */
    public Map<String, Object> getCourseAnalytics(Long courseId) {
        Map<String, Object> result = new LinkedHashMap<>();
        try (Connection conn = dataSource.getConnection()) {
            // 学生总数
            int totalStudents = 0;
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT COUNT(DISTINCT uk.user_id) FROM user_knowledge_state uk WHERE uk.course_id = ?")) {
                ps.setLong(1, courseId);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) totalStudents = rs.getInt(1);
            }

            // 整体进度和平均掌握度
            double overallProgress = 0, averageMastery = 0;
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT AVG(mastery), COUNT(*) FROM user_knowledge_state WHERE course_id = ?")) {
                ps.setLong(1, courseId);
                ResultSet rs = ps.executeQuery();
                if (rs.next() && rs.getLong(2) > 0) {
                    averageMastery = rs.getDouble(1);
                    // 整体进度 = mastered KPs / total KPs across students
                    int mastered = 0, total = 0;
                    try (PreparedStatement ps2 = conn.prepareStatement(
                            "SELECT SUM(CASE WHEN mastery >= 0.7 THEN 1 ELSE 0 END), COUNT(*) FROM user_knowledge_state WHERE course_id = ?")) {
                        ps2.setLong(1, courseId);
                        ResultSet rs2 = ps2.executeQuery();
                        if (rs2.next()) {
                            mastered = rs2.getInt(1);
                            total = rs2.getInt(2);
                        }
                    }
                    overallProgress = total > 0 ? (double) mastered / total : 0;
                }
            }

            // 薄弱知识点 Top 5
            List<Map<String, Object>> weakPoints = new ArrayList<>();
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT kp.name, AVG(uk.mastery) as avg_m, COUNT(uk.user_id) as sc " +
                    "FROM user_knowledge_state uk JOIN knowledge_point kp ON uk.knowledge_point_id = kp.id " +
                    "WHERE uk.course_id = ? GROUP BY uk.knowledge_point_id " +
                    "ORDER BY avg_m ASC LIMIT 5")) {
                ps.setLong(1, courseId);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    Map<String, Object> wp = new LinkedHashMap<>();
                    wp.put("knowledgePointName", rs.getString("name"));
                    wp.put("averageMastery", rs.getDouble("avg_m"));
                    wp.put("studentCount", rs.getInt("sc"));
                    weakPoints.add(wp);
                }
            }

            // 学生排行榜
            List<Map<String, Object>> ranking = new ArrayList<>();
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT u.id, u.nickname, AVG(uk.mastery) as progress, " +
                    "COALESCE(SUM(lr.duration_seconds), 0) as total_duration " +
                    "FROM user_knowledge_state uk " +
                    "JOIN user u ON uk.user_id = u.id " +
                    "LEFT JOIN learning_record lr ON lr.user_id = u.id AND lr.course_id = uk.course_id " +
                    "WHERE uk.course_id = ? AND u.role = 'STUDENT' " +
                    "GROUP BY u.id ORDER BY progress DESC LIMIT 20")) {
                ps.setLong(1, courseId);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("studentId", rs.getLong("id"));
                    row.put("studentName", rs.getString("nickname"));
                    row.put("progress", rs.getDouble("progress"));
                    row.put("totalDuration", rs.getLong("total_duration"));
                    ranking.add(row);
                }
            }

            result.put("totalStudents", totalStudents);
            result.put("overallProgress", overallProgress);
            result.put("averageMastery", averageMastery);
            result.put("weakPointsTop5", weakPoints);
            result.put("studentRanking", ranking);

        } catch (Exception e) {
            throw new RuntimeException("查询学情数据失败", e);
        }
        return result;
    }

    /**
     * 获取学生详情
     */
    public Map<String, Object> getStudentDetail(Long courseId, Long studentId) {
        Map<String, Object> result = new LinkedHashMap<>();
        try (Connection conn = dataSource.getConnection()) {
            // 学生基本信息
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT id, nickname, email FROM user WHERE id = ?")) {
                ps.setLong(1, studentId);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    Map<String, Object> student = new LinkedHashMap<>();
                    student.put("id", rs.getLong("id"));
                    student.put("name", rs.getString("nickname"));
                    student.put("email", rs.getString("email"));
                    result.put("student", student);
                }
            }

            // 知识状态
            List<Map<String, Object>> knowledgeStates = new ArrayList<>();
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT kp.name, uk.mastery FROM user_knowledge_state uk " +
                    "JOIN knowledge_point kp ON uk.knowledge_point_id = kp.id " +
                    "WHERE uk.user_id = ? AND uk.course_id = ? ORDER BY kp.order_num")) {
                ps.setLong(1, studentId);
                ps.setLong(2, courseId);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    Map<String, Object> ks = new LinkedHashMap<>();
                    double m = rs.getDouble("mastery");
                    ks.put("knowledgePointName", rs.getString("name"));
                    ks.put("mastery", m);
                    ks.put("status", m >= 0.7 ? "MASTERED" : m > 0 ? "LEARNING" : "NOT_LEARNED");
                    knowledgeStates.add(ks);
                }
            }
            result.put("knowledgeStates", knowledgeStates);

            // 最近活动记录
            List<Map<String, Object>> recentRecords = new ArrayList<>();
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT lr.record_type, kp.name, lr.created_at FROM learning_record lr " +
                    "LEFT JOIN knowledge_point kp ON lr.knowledge_point_id = kp.id " +
                    "WHERE lr.user_id = ? AND lr.course_id = ? ORDER BY lr.created_at DESC LIMIT 20")) {
                ps.setLong(1, studentId);
                ps.setLong(2, courseId);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    Map<String, Object> rec = new LinkedHashMap<>();
                    rec.put("recordType", rs.getString("record_type"));
                    rec.put("knowledgePointName", rs.getString("name"));
                    rec.put("createdAt", rs.getTimestamp("created_at").toString());
                    recentRecords.add(rec);
                }
            }
            result.put("recentRecords", recentRecords);

            // 进度计算
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT AVG(mastery) FROM user_knowledge_state WHERE user_id = ? AND course_id = ?")) {
                ps.setLong(1, studentId);
                ps.setLong(2, courseId);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    result.put("progress", rs.getDouble(1));
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("查询学生详情失败", e);
        }
        return result;
    }
}
