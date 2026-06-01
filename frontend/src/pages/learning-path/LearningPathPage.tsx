import { useEffect, useState } from 'react';
import { Card, List, Tag, Progress, Spin, Empty, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function LearningPathPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/courses/${courseId}/learning-path`).then(r => {
      setItems(r.data.data.items);
      setProgress(r.data.data.overallProgress);
    }).finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 200 }} />;

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: '0 auto' }}>
      <Card title={`学习路径 · 总进度`} extra={<Progress percent={Math.round(progress * 100)} />}>
        {items.length === 0 ? <Empty description="请先完成课程测评" /> : (
          <List dataSource={items} renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={<>{item.knowledgePointName} <Tag color="blue">P{item.priority}</Tag></>}
                description={<><Progress percent={Math.round(item.mastery * 100)} style={{ width: 200 }} /> {item.reason}</>}
              />
              <Button onClick={() => navigate(`/assessment/${courseId}`)}>开始学习</Button>
            </List.Item>
          )} />
        )}
      </Card>
    </div>
  );
}
