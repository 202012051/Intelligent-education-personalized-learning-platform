import { useState, useEffect } from 'react';
import { Card, Button, Radio, Progress, Spin, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface Question { questionId: number; content: string; options: string[]; totalQuestions: number; currentIndex: number; }

export default function AssessmentPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadQuestion(); }, []);

  const loadQuestion = async (index = 0) => {
    setLoading(true);
    try {
      const res = await api.get(`/assessments/1/questions/${index}`);
      setQuestion(res.data.data);
      setSelected(null);
    } catch { message.error('加载题目失败'); } finally { setLoading(false); }
  };

  const submitAnswer = async () => {
    if (selected === null) return message.warning('请选择一个答案');
    try {
      await api.post('/assessments/1/answers', { questionId: question!.questionId, selectedAnswer: selected });
      if (question!.currentIndex + 1 < question!.totalQuestions) {
        loadQuestion(question!.currentIndex + 1);
      } else {
        await api.post('/assessments/1/complete');
        message.success('测评完成');
        navigate(`/assessment/${courseId}/result`);
      }
    } catch (err: any) { message.error(err.response?.data?.message || '提交失败'); }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 200 }} />;
  if (!question) return null;

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <Progress percent={Math.round(((question.currentIndex) / question.totalQuestions) * 100)} style={{ marginBottom: 16 }} />
      <Card title={`第 ${question.currentIndex + 1} 题 / 共 ${question.totalQuestions} 题`}>
        <p style={{ fontSize: 16, marginBottom: 20 }}>{question.content}</p>
        <Radio.Group onChange={(e) => setSelected(e.target.value)} value={selected}>
          {question.options.map((opt, i) => (
            <Radio key={i} value={i} style={{ display: 'block', marginBottom: 12 }}>{opt}</Radio>
          ))}
        </Radio.Group>
        <Button type="primary" onClick={submitAnswer} style={{ marginTop: 20 }}>
          {question.currentIndex + 1 < question.totalQuestions ? '下一题' : '提交测评'}
        </Button>
      </Card>
    </div>
  );
}
