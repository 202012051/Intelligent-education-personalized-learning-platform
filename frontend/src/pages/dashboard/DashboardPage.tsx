import { useEffect, useState } from 'react';
import { Card, Row, Col, Progress, List, Statistic, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface DashboardData {
  overallProgress: number;
  nextRecommendation: { knowledgePointId: number; knowledgePointName: string; reason: string } | null;
  recentRecords: { knowledgePointName: string; recordType: string; createdAt: string }[];
  weeklyDuration: number;
  heatmap: { knowledgePointName: string; mastery: number; status: string }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // MVP: hardcoded to courseId=1
    api.get('/courses/1/dashboard')
      .then((res) => setData(res.data.data))
      .catch(() => {}) // silently handle
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 200 }} />;

  return (
    <div style={{ padding: 24 }}>
      <h1>学习仪表盘</h1>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="总体进度">
            <Progress percent={Math.round((data?.overallProgress ?? 0) * 100)} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="本周学习时长">
            <Statistic value={data?.weeklyDuration ?? 0} suffix="分钟" />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="知识掌握热力图">
            {data?.heatmap?.map((item) => (
              <div key={item.knowledgePointName} style={{ marginBottom: 8 }}>
                <span>{item.knowledgePointName}</span>
                <Progress percent={Math.round(item.mastery * 100)}
                  strokeColor={item.status === 'MASTERED' ? '#52c41a' : item.status === 'LEARNING' ? '#faad14' : '#d9d9d9'}
                />
              </div>
            ))}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最近学习记录">
            <List
              dataSource={data?.recentRecords ?? []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.knowledgePointName}
                    description={`${item.recordType} · ${new Date(item.createdAt).toLocaleString()}`}
                  />
                </List.Item>
              )}
              locale={{ emptyText: '暂无学习记录' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
