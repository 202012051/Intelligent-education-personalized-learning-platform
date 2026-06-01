import { useEffect, useState } from 'react';
import { Card, Descriptions, Table, Progress, Tag, Spin, Row, Col, List } from 'antd';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

export default function TeacherStudentDetail() {
  const { studentId, courseId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/teacher/courses/${courseId ?? 1}/students/${studentId}`).then(r => setData(r.data.data)).finally(() => setLoading(false));
  }, [studentId, courseId]);

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 200 }} />;
  if (!data) return null;

  return (
    <div style={{ padding: 24 }}>
      <h1>学生详情</h1>
      <Card style={{ marginBottom: 16 }}>
        <Descriptions title={data.student?.name} column={3}>
          <Descriptions.Item label="邮箱">{data.student?.email}</Descriptions.Item>
          <Descriptions.Item label="总进度">
            <Progress percent={Math.round((data.student?.progress ?? 0) * 100)} />
          </Descriptions.Item>
          <Descriptions.Item label="总学习时长">{Math.round((data.student?.totalDuration ?? 0) / 60)} 分钟</Descriptions.Item>
        </Descriptions>
      </Card>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="知识状态">
            <Table dataSource={data.knowledgeStates ?? []} rowKey="knowledgePointName" pagination={false}
              columns={[
                { title: '知识点', dataIndex: 'knowledgePointName' },
                { title: '掌握度', render: (_: any, r: any) => <Progress percent={Math.round(r.mastery * 100)}
                  strokeColor={r.status === 'MASTERED' ? '#52c41a' : r.status === 'LEARNING' ? '#faad14' : '#d9d9d9'} /> },
                { title: '状态', dataIndex: 'status', render: (s: string) => (
                  <Tag color={s === 'MASTERED' ? 'green' : s === 'LEARNING' ? 'gold' : 'default'}>
                    {s === 'MASTERED' ? '已掌握' : s === 'LEARNING' ? '学习中' : '未学习'}
                  </Tag>
                )},
              ]}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最近活动记录">
            <List dataSource={(data.recentRecords ?? []).slice(0, 10)} renderItem={(item: any) => (
              <List.Item>
                <List.Item.Meta
                  title={item.knowledgePointName || '未关联知识点'}
                  description={<>{item.recordType} · {new Date(item.createdAt).toLocaleString()}</>}
                />
              </List.Item>
            )} locale={{ emptyText: '暂无活动记录' }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
