import { useEffect, useState } from 'react';
import { Card, Radio, Button, Spin, message } from 'antd';
import * as echarts from 'echarts';
import api from '../../services/api';

interface StyleQuestion { id: number; dimension: string; content: string; optionA: string; optionB: string; }
interface StyleResult { activeReflective: number; sensingIntuitive: number; visualVerbal: number; sequentialGlobal: number; }

export default function LearningStylePage() {
  const [questions, setQuestions] = useState<StyleQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<StyleResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/style/result').then(r => {
      if (r.data.data) setResult(r.data.data);
    }).catch(() => {});
    api.get('/style/questions').then(r => setQuestions(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!result) return;
    const el = document.getElementById('style-radar');
    if (!el) return;
    const chart = echarts.init(el);
    chart.setOption({
      radar: {
        indicator: [
          { name: '活跃/沉思', max: 3 },
          { name: '感悟/直觉', max: 3 },
          { name: '视觉/言语', max: 3 },
          { name: '序列/综合', max: 3 },
        ],
        axisName: { fontSize: 12 },
      },
      series: [{
        type: 'radar',
        data: [{ value: [result.activeReflective, result.sensingIntuitive, result.visualVerbal, result.sequentialGlobal], name: '学习风格' }],
        areaStyle: { opacity: 0.3 },
      }],
    });
    return () => chart.dispose();
  }, [result]);

  const submit = async () => {
    if (Object.keys(answers).length < questions.length) return message.warning('请完成所有题目');
    setSubmitting(true);
    try {
      const payload = { answers: Object.entries(answers).map(([qid, choice]) => ({ questionId: Number(qid), choice })) };
      const r = await api.post('/style/result', payload);
      setResult(r.data.data);
      message.success('学习风格测评完成');
    } catch (err: any) { message.error(err.response?.data?.message || '提交失败'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 200 }} />;

  if (result) {
    return (
      <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
        <Card title="你的学习风格">
          <div id="style-radar" style={{ width: '100%', height: 400 }} />
          <div style={{ marginTop: 16 }}>
            <p><strong>活跃/沉思 (Active/Reflective)</strong>: {result.activeReflective > 0 ? '活跃型 — 喜欢动手实践' : '沉思型 — 喜欢思考分析'}</p>
            <p><strong>感悟/直觉 (Sensing/Intuitive)</strong>: {result.sensingIntuitive > 0 ? '感悟型 — 关注具体事实' : '直觉型 — 关注抽象概念'}</p>
            <p><strong>视觉/言语 (Visual/Verbal)</strong>: {result.visualVerbal > 0 ? '视觉型 — 偏好图表图像' : '言语型 — 偏好文字讲解'}</p>
            <p><strong>序列/综合 (Sequential/Global)</strong>: {result.sequentialGlobal > 0 ? '序列型 — 按步骤学习' : '综合型 — 先看全局再深入'}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 650, margin: '0 auto' }}>
      <Card title="学习风格问卷 (8 题)">
        {questions.map((q, i) => (
          <Card key={q.id} size="small" style={{ marginBottom: 12 }} title={`第 ${i + 1} 题`}>
            <p>{q.content}</p>
            <Radio.Group onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })} value={answers[q.id]}>
              <Radio value="a">{q.optionA}</Radio>
              <Radio value="b" style={{ marginLeft: 24 }}>{q.optionB}</Radio>
            </Radio.Group>
          </Card>
        ))}
        <Button type="primary" onClick={submit} loading={submitting} block style={{ marginTop: 16 }}>提交</Button>
      </Card>
    </div>
  );
}
