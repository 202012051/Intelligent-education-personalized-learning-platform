import { useState } from 'react';
import { Form, Input, Button, Card, Tabs, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', values);
      const { token, user } = res.data.data;
      login(token, user);
      message.success('登录成功');
      navigate('/dashboard');
    } catch (err: any) {
      message.error(err.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: { email: string; password: string; nickname: string }) => {
    setLoading(true);
    try {
      await api.post('/auth/register', values);
      message.success('注册成功，请登录');
    } catch (err: any) {
      message.error(err.response?.data?.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>IEP 智能教育学习平台</h2>
        <Tabs
          centered
          items={[
            {
              key: 'login',
              label: '登录',
              children: (
                <Form onFinish={handleLogin} layout="vertical">
                  <Form.Item name="email" rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}>
                    <Input prefix={<MailOutlined />} placeholder="邮箱" />
                  </Form.Item>
                  <Form.Item name="password" rules={[{ required: true, min: 6, message: '密码至少6位' }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="密码" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>登录</Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'register',
              label: '注册',
              children: (
                <Form onFinish={handleRegister} layout="vertical">
                  <Form.Item name="nickname" rules={[{ required: true, message: '请输入昵称' }]}>
                    <Input prefix={<UserOutlined />} placeholder="昵称" />
                  </Form.Item>
                  <Form.Item name="email" rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}>
                    <Input prefix={<MailOutlined />} placeholder="邮箱" />
                  </Form.Item>
                  <Form.Item name="password" rules={[{ required: true, min: 6, message: '密码至少6位' }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="密码" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>注册</Button>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
