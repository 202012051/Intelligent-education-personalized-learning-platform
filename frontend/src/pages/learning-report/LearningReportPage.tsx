import { useEffect, useState } from 'react';
import { Card, Progress, List, Tag, Spin, Empty } from 'antd';
import { useParams } from 'react-router-dom';
import * as echarts from 'echarts';
import api from '../../services/api';

export default function LearningReportPage() {
  const { courseId } = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/courses/${courseId}/reports`).then(r => {
      setReport(r.data.data);
      setTimeout(() => renderBarChart(r.data.data), 100);
    }).finally(() => setLoading(false));
  }, [courseId]);

  const renderBarChart = (data: any) => {
    const el = document.getElementById('report-bar');
    if (!el || !data?.knowledgeMastery) return;
    const chart = echarts.init(el);
    chart.setOption({
      tooltip: {},
      xAxis: { type: 'category', data: data.knowledgeMastery.map((k: any) => k.name), axisLabel: { rotate: 30, fontSize: 10 } },
      yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
      series: [{
        type: 'bar',
        data: data.knowledgeMastery.map((k: any) => ({ value: Math.round(k.mastery * 100),
          itemStyle: { color: k.mastery >= 0.7 ? '#52c41a' : k.mastery > 0 ? '#faad14' : '#d9d9d9' } })),
      }],
    });
    return () => chart.dispose();
  };

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 200 }} />;
  if (!report || !report.hasRecords) return <Empty description="完成更多学习后报告将更加完善" style={{ marginTop: 200 }} />;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>学习报告</h1>
      <Card title="知识点掌握度" style={{ marginBottom: 16 }}>
        <div id="report-bar" style={{ width: '100%', height: 300 }} />
      </Card>
      <Card title="薄弱知识点 (Top 3)" style={{ marginBottom: 16 }}>
        {report.weakPoints?.length > 0 ? (
          <List dataSource={report.weakPoints} renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                title={<><Tag color="red">{item.knowledgePointName}</Tag> 掌握度 {Math.round(item.mastery * 100)}%</>}
                description={<span style={{ color: '#888' }}>{item.suggestion}</span>}
              />
              <Progress percent={Math.round(item.mastery * 100)} strokeColor="#ff4d4f" style={{ width: 150 }} />
            </List.Item>
          )} />
        ) : <p>暂无薄弱点，继续加油！</p>}
      </Card>
      <Card title="学习进度趋势">
        {report.trend?.length > 0 ? (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {report.trend.map((t: any) => (
              <div key={t.date} style={{ textAlign: 'center' }}>
                <Progress type="circle" percent={Math.round(t.progress * 100)} width={60} />
                <div style={{ fontSize: 12, marginTop: 4 }}>{t.date}</div>
              </div>
            ))}
          </div>
        ) : <p>暂无趋势数据</p>}
      </Card>
    </div>
  );
}
