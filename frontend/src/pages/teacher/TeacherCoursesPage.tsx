import { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Select, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../../services/api';

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [kps, setKps] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [kpModalVisible, setKpModalVisible] = useState(false);
  const [relationModalVisible, setRelationModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [kpForm] = Form.useForm();
  const [relationForm] = Form.useForm();

  useEffect(() => { loadCourses(); }, []);

  const loadCourses = () => {
    api.get('/courses').then(r => setCourses(r.data.data || [])).finally(() => setLoading(false));
  };

  const loadKps = (courseId: number) => {
    api.get(`/courses/${courseId}/knowledge-points`).then(r => setKps(r.data.data || []));
  };

  const createCourse = async (values: any) => {
    await api.post('/courses', values);
    message.success('课程创建成功');
    setModalVisible(false);
    form.resetFields();
    loadCourses();
  };

  const createKp = async (values: any) => {
    if (!selectedCourse) return message.warning('请先选择一个课程');
    await api.post(`/courses/${selectedCourse.id}/knowledge-points`, values);
    message.success('知识点添加成功');
    setKpModalVisible(false);
    kpForm.resetFields();
    loadKps(selectedCourse.id);
  };

  const createRelation = async (values: any) => {
    await api.post(`/courses/${selectedCourse.id}/knowledge-points/relations`, values);
    message.success('关系创建成功');
    setRelationModalVisible(false);
    relationForm.resetFields();
  };

  const deleteKp = async (kpId: number) => {
    await api.delete(`/courses/${selectedCourse.id}/knowledge-points/${kpId}`);
    message.success('知识点已删除');
    loadKps(selectedCourse.id);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>课程管理</h1>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)} style={{ marginBottom: 16 }}>创建课程</Button>
      <Table dataSource={courses} rowKey="id" loading={loading} pagination={false}
        columns={[
          { title: '课程名称', dataIndex: 'name' },
          { title: '描述', dataIndex: 'description', ellipsis: true },
          { title: '知识点数', render: (_: any, r: any) => r.knowledgePointCount || '—' },
          { title: '操作', render: (_: any, r: any) => (
            <Button onClick={() => { setSelectedCourse(r); loadKps(r.id); }}>管理知识点</Button>
          )},
        ]}
      />
      {selectedCourse && (
        <Card title={`知识点管理 — ${selectedCourse.name}`} style={{ marginTop: 16 }}>
          <Button icon={<PlusOutlined />} onClick={() => setKpModalVisible(true)} style={{ marginBottom: 12 }}>添加知识点</Button>
          <Button onClick={() => setRelationModalVisible(true)} style={{ marginBottom: 12, marginLeft: 8 }}>定义关系</Button>
          <Table dataSource={kps} rowKey="id" pagination={false}
            columns={[
              { title: '名称', dataIndex: 'name' },
              { title: '难度', dataIndex: 'difficulty', render: (d: number) => '⭐'.repeat(d) },
              { title: '排序', dataIndex: 'orderNum' },
              { title: '描述', dataIndex: 'description', ellipsis: true },
              { title: '操作', render: (_: any, r: any) => (
                <Popconfirm title="确定删除？" onConfirm={() => deleteKp(r.id)}><Button danger size="small">删除</Button></Popconfirm>
              )},
            ]}
          />
        </Card>
      )}
      {/* Create Course Modal */}
      <Modal title="创建课程" open={modalVisible} onCancel={() => setModalVisible(false)} onOk={() => form.submit()}>
        <Form form={form} onFinish={createCourse} layout="vertical">
          <Form.Item name="name" label="课程名称" rules={[{ required: true, message: '请输入课程名称' }]}><Input /></Form.Item>
          <Form.Item name="description" label="课程描述"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
      {/* Create Knowledge Point Modal */}
      <Modal title="添加知识点" open={kpModalVisible} onCancel={() => setKpModalVisible(false)} onOk={() => kpForm.submit()}>
        <Form form={kpForm} onFinish={createKp} layout="vertical">
          <Form.Item name="name" label="知识点名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="difficulty" label="难度" initialValue={1}><InputNumber min={1} max={5} /></Form.Item>
          <Form.Item name="orderNum" label="排序序号" initialValue={1}><InputNumber min={1} /></Form.Item>
        </Form>
      </Modal>
      {/* Create Relation Modal */}
      <Modal title="定义知识点关系" open={relationModalVisible} onCancel={() => setRelationModalVisible(false)} onOk={() => relationForm.submit()}>
        <Form form={relationForm} onFinish={createRelation} layout="vertical">
          <Form.Item name="sourceId" label="源知识点" rules={[{ required: true }]}>
            <Select options={kps.map(k => ({ label: k.name, value: k.id }))} />
          </Form.Item>
          <Form.Item name="targetId" label="目标知识点" rules={[{ required: true }]}>
            <Select options={kps.map(k => ({ label: k.name, value: k.id }))} />
          </Form.Item>
          <Form.Item name="relationType" label="关系类型" rules={[{ required: true }]}>
            <Select options={[
              { label: '先修 (A→B: A 是 B 的前置)', value: 'PREREQUISITE' },
              { label: '包含 (A 包含 B)', value: 'CONTAINS' },
              { label: '相关', value: 'RELATED' },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
