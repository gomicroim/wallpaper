import React, { useState } from 'react';
import { Form, Input, Button, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, MailOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [phoneForm] = Form.useForm();
  const [emailForm] = Form.useForm();

  const handlePhoneLogin = async (values) => {
    setLoading(true);
    try {
      await onLogin({
        type: 'phone',
        identifier: values.phone,
        password: values.password
      });
      message.success('登录成功！');
    } catch (error) {
      message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (values) => {
    setLoading(true);
    try {
      await onLogin({
        type: 'email',
        identifier: values.email,
        password: values.password
      });
      message.success('登录成功！');
    } catch (error) {
      message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 style={{ textAlign: 'center', marginBottom: '32px', color: '#1a1a1a' }}>
          动态壁纸
        </h2>
        
        <Tabs defaultActiveKey="phone" centered>
          <TabPane tab="手机号登录" key="phone">
            <Form
              form={phoneForm}
              onFinish={handlePhoneLogin}
              layout="vertical"
            >
              <Form.Item
                name="phone"
                label="手机号"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                ]}
              >
                <Input 
                  prefix={<MobileOutlined />} 
                  placeholder="请输入手机号" 
                  size="large"
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6位' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="请输入密码" 
                  size="large"
                />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large" 
                  block
                  loading={loading}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="邮箱登录" key="email">
            <Form
              form={emailForm}
              onFinish={handleEmailLogin}
              layout="vertical"
            >
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="请输入邮箱" 
                  size="large"
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6位' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="请输入密码" 
                  size="large"
                />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large" 
                  block
                  loading={loading}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
        
        <div style={{ textAlign: 'center', marginTop: '24px', color: '#666' }}>
          <p>首次登录将自动注册账号</p>
        </div>
      </div>
    </div>
  );
}

export default Login; 