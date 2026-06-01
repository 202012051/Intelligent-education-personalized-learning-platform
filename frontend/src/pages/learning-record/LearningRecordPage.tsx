import { useEffect, useState } from 'react';
import { Card, Table, Select, Tag, Spin, Statistic, Row, Col } from 'antd';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const RECORD_TYPE_MAP: Record<string, { label: string; color: string }> = {
  QUIZ: { label: '答题', color: 'blue' },
  PAGE_VIEW: { label: '浏览', color: 'green' },
  VIDEO: { label: '视频', color: 'purple' },
};

export default function LearningRecordPage() {
  const { courseId } = useParams();
  const [records, setRecords] = useState<any[]>([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRecords: 0, totalDuration: 0, quizCount: 0 });

  useEffect(() => {
    setLoading(true);
    api.get(`/courses/${courseId}/records?days=${days}`)
      .then(r => {
        const data = r.data.data || [];
        setRecords(data);
        const quizCount = data.filter((d: any) => d.recordType === 'QUIZ').length;
        const totalDuration = data.reduce((s: number, d: any) => s + (d.durationSeconds || 0), 0);
        setStats({ totalRecords: data.length, totalDuration: Math.round(totalDuration / 60), quizCount });
      })
      .finally(() => setLoading(false));
  }, [courseId, days]);

  return (
    <div style={{ padding: 24 }}>
      <h1>学习记录</h1>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}><Card><Statistic title="记录总数" value={stats.totalRecords} suffix="条" /></Card></Col>
        <Col span={8}><Card><Statistic title="总学习时长" value={stats.totalDuration} suffix="分钟" /></Card></Col>
        <Col span={8}><Card><Statistic title="答题次数" value={stats.quizCount} suffix="次" /></Card></Col>
      </Row>
      <Card title="记录列表" extra={
        <Select value={days} onChange={setDays} style={{ width: 120 }}>
          <Select.Option value={1}>最近一天</Select.Option>
          <Select.Option value={7}>最近七天</Select.Option>
          <Select.Option value={30}>最近三十天</Select.Option>
        </Select>
      }>
        <Table dataSource={records} rowKey="id" loading={loading} pagination={{ pageSize: 15 }}
          columns={[
            { title: '知识点', dataIndex: 'knowledgePointName', render: (v: string) => v || '—' },
            { title: '类型', dataIndex: 'recordType', render: (t: string) => {
              const m = RECORD_TYPE_MAP[t] || { label: t, color: 'default' };
              return <Tag color={m.color}>{m.label}</Tag>;
            }},
            { title: '耗时', dataIndex: 'durationSeconds', render: (s: number) => `${Math.round(s / 60)} min` },
            { title: '时间', dataIndex: 'createdAt', render: (t: string) => new Date(t).toLocaleString() },
          ]}
        />
      </Card>
    </div>
  );
}
