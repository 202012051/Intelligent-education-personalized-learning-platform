import { useEffect, useState } from 'react';
import { Card, Table, Progress, Button, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function AssessmentResultPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/courses/${courseId}/knowledge-states`).then(r => setStates(r.data.data)).finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 200 }} />;

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: '0 auto' }}>
      <Card title="测评结果">
        <Table dataSource={states} rowKey="knowledgePointId" pagination={false}
          columns={[
            { title: '知识点', dataIndex: 'knowledgePointName' },
            { title: '掌握度', render: (_: any, r: any) => (
                <Progress percent={Math.round(r.mastery * 100)} strokeColor={r.status === 'MASTERED' ? '#52c41a' : r.status === 'LEARNING' ? '#faad14' : '#d9d9d9'} />
            )},
            { title: '状态', dataIndex: 'status', render: (s: string) => s === 'MASTERED' ? '✅ 已掌握' : s === 'LEARNING' ? '🟡 学习中' : '⚪ 未学习' },
          ]}
        />
        <Button type="primary" onClick={() => navigate('/dashboard')} style={{ marginTop: 20 }}>进入学习仪表盘</Button>
      </Card>
    </div>
  );
}
