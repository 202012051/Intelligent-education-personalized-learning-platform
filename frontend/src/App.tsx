import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Pages (lazy-loaded in production, direct imports for MVP)
import LoginPage from './pages/login/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AssessmentPage from './pages/assessment/AssessmentPage';
import AssessmentResultPage from './pages/assessment/AssessmentResultPage';
import LearningPathPage from './pages/learning-path/LearningPathPage';
import LearningRecordPage from './pages/learning-record/LearningRecordPage';
import KnowledgeGraphPage from './pages/knowledge-graph/KnowledgeGraphPage';
import LearningStylePage from './pages/learning-style/LearningStylePage';
import LearningReportPage from './pages/learning-report/LearningReportPage';
import ProfilePage from './pages/profile/ProfilePage';
import TeacherCoursesPage from './pages/teacher/TeacherCoursesPage';
import TeacherAnalyticsPage from './pages/teacher/TeacherAnalyticsPage';
import TeacherStudentDetail from './pages/teacher/TeacherStudentDetail';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function TeacherRoute({ children }: { children: React.ReactNode }) {
  const { token, role } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (role !== 'TEACHER') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/assessment/:courseId" element={<PrivateRoute><AssessmentPage /></PrivateRoute>} />
      <Route path="/assessment/:courseId/result" element={<PrivateRoute><AssessmentResultPage /></PrivateRoute>} />
      <Route path="/learning-path/:courseId" element={<PrivateRoute><LearningPathPage /></PrivateRoute>} />
      <Route path="/learning-record/:courseId" element={<PrivateRoute><LearningRecordPage /></PrivateRoute>} />
      <Route path="/knowledge-graph/:courseId" element={<PrivateRoute><KnowledgeGraphPage /></PrivateRoute>} />
      <Route path="/learning-style" element={<PrivateRoute><LearningStylePage /></PrivateRoute>} />
      <Route path="/learning-report/:courseId" element={<PrivateRoute><LearningReportPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/teacher/courses" element={<TeacherRoute><TeacherCoursesPage /></TeacherRoute>} />
      <Route path="/teacher/analytics/:courseId" element={<TeacherRoute><TeacherAnalyticsPage /></TeacherRoute>} />
      <Route path="/teacher/student/:studentId" element={<TeacherRoute><TeacherStudentDetail /></TeacherRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
