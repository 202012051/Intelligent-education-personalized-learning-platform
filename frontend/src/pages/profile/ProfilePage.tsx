import { useState } from 'react';
import { Card, Form, Input, Button, Descriptions, message, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';

export default function ProfilePage() {
  const { email, nickname, logout } = useAuthStore();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  const save = async (values: any) => {
    try {
      await api.put('/auth/profile', values);
      message.success('更新成功');
      setEditing(false);
    } catch (err: any) { message.error(err.response?.data?.message || '更新失败'); }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1>个人中心</h1>
      <Card title="基本信息">
        {!editing ? (
          <>
            <Descriptions column={1}>
              <Descriptions.Item label="昵称">{nickname}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{email}</Descriptions.Item>
            </Descriptions>
            <Button onClick={() => { form.setFieldsValue({ nickname, avatarUrl: '' }); setEditing(true); }} style={{ marginRight: 8 }}>编辑</Button>
          </>
        ) : (
          <Form form={form} onFinish={save} layout="vertical">
            <Form.Item name="nickname" label="昵称" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="avatarUrl" label="头像 URL（可选）"><Input placeholder="https://example.com/avatar.png" /></Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={() => setEditing(false)} style={{ marginLeft: 8 }}>取消</Button>
            </Form.Item>
          </Form>
        )}
      </Card>
      <Divider />
      <Card>
        <Button onClick={() => navigate('/learning-style')} style={{ marginRight: 8 }}>学习风格问卷</Button>
        <Button danger onClick={() => { logout(); navigate('/login'); }}>退出登录</Button>
      </Card>
    </div>
  );
}
