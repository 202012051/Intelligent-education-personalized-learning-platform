import { useEffect, useState } from 'react';
import { Card, Table, Progress, Tag, Spin, Row, Col, Statistic } from 'antd';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function TeacherAnalyticsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/teacher/courses/${courseId}/analytics`).then(r => setData(r.data.data)).finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 200 }} />;

  return (
    <div style={{ padding: 24 }}>
      <h1>班级学情</h1>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="学生总数" value={data?.totalStudents ?? 0} /></Card></Col>
        <Col span={6}><Card><Statistic title="整体进度" value={Math.round((data?.overallProgress ?? 0) * 100)} suffix="%" /></Card></Col>
        <Col span={6}><Card><Statistic title="平均掌握度" value={Math.round((data?.averageMastery ?? 0) * 100)} suffix="%" /></Card></Col>
        <Col span={6}><Card>
          <Statistic title="薄弱点 Top 1" value={data?.weakPointsTop5?.[0]?.knowledgePointName ?? '—'}
            valueStyle={{ fontSize: 14 }} />
        </Card></Col>
      </Row>
      <Card title="薄弱知识点 Top 5" style={{ marginBottom: 16 }}>
        <Table dataSource={data?.weakPointsTop5 ?? []} rowKey="knowledgePointName" pagination={false}
          columns={[
            { title: '知识点', dataIndex: 'knowledgePointName' },
            { title: '平均掌握度', render: (_: any, r: any) => <Progress percent={Math.round(r.averageMastery * 100)} strokeColor="#ff4d4f" /> },
            { title: '未掌握学生数', dataIndex: 'studentCount' },
          ]}
        />
      </Card>
      <Card title="学生排行榜">
        <Table dataSource={data?.studentRanking ?? []} rowKey="studentId" pagination={false}
          columns={[
            { title: '排名', render: (_: any, __: any, i: number) => <Tag color={i < 3 ? 'gold' : 'default'}>{i + 1}</Tag> },
            { title: '学生', dataIndex: 'studentName' },
            { title: '进度', render: (_: any, r: any) => <Progress percent={Math.round(r.progress * 100)} /> },
            { title: '学习时长', dataIndex: 'totalDuration', render: (d: number) => `${Math.round(d / 60)} min` },
            { title: '操作', render: (_: any, r: any) => <Button size="small" onClick={() => navigate(`/teacher/student/${r.studentId}`)}>详情</Button> },
          ]}
        />
      </Card>
    </div>
  );
}
