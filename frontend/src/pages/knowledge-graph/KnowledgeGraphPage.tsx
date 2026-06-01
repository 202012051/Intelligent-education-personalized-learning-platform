import { useEffect, useState, useRef } from 'react';
import { Card, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import * as echarts from 'echarts';
import api from '../../services/api';

const MASTERY_COLORS: Record<string, string> = { MASTERED: '#52c41a', LEARNING: '#faad14', NOT_LEARNED: '#d9d9d9' };

export default function KnowledgeGraphPage() {
  const { courseId } = useParams();
  const chartRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/courses/${courseId}/knowledge-graph`).then(r => {
      const { nodes, edges } = r.data.data;
      const chart = echarts.init(chartRef.current!);
      chart.setOption({
        tooltip: { formatter: (p: any) => `${p.name}<br/>掌握度: ${(p.data.mastery * 100).toFixed(0)}%` },
        series: [{
          type: 'graph', layout: 'force', roam: true, draggable: true,
          force: { repulsion: 300, edgeLength: [100, 200] },
          data: nodes.map((n: any) => ({ ...n, symbolSize: 50, itemStyle: { color: MASTERY_COLORS[n.status] || '#d9d9d9' } })),
          links: edges.map((e: any) => ({ source: e.sourceId.toString(), target: e.targetId.toString(), label: { show: true, formatter: e.relationType === 'PREREQUISITE' ? '先修' : e.relationType } })),
          label: { show: true, fontSize: 12 },
        }],
      });
      chart.on('click', (params: any) => {
        if (params.dataType === 'node') {
          alert(`${params.name}\n掌握度: ${(params.data.mastery * 100).toFixed(0)}%\n状态: ${params.data.status}`);
        }
      });
    }).finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 200 }} />;

  return (
    <div style={{ padding: 24 }}>
      <Card title="知识图谱">
        <div ref={chartRef} style={{ width: '100%', height: 600 }} />
        <div style={{ marginTop: 12 }}>
          <span style={{ color: '#52c41a' }}>🟢 已掌握</span> &nbsp;
          <span style={{ color: '#faad14' }}>🟡 学习中</span> &nbsp;
          <span style={{ color: '#d9d9d9' }}>⚪ 未学习</span>
        </div>
      </Card>
    </div>
  );
}
