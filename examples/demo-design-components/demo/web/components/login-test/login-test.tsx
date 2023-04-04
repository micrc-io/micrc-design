/* eslint-disable react/no-unused-prop-types */
// 测试state登录
import React from 'react';

import { Button, Form, Input, Typography } from 'antd';

import { localStore } from '@micrc/bit.runtimes.micrc-web';

import styles from './login-test.module.scss';

export type LoginTestProps = {
  userName?: object;
  passWord?: object;
  repeatPassword?: object;
  btnName?: string;
  result?: string;
  loading?: boolean;
  changeUserName: any;
  changePassWord: any;
  changeRepeatPassword: any;
  submit?: any;
};

export function LoginTest(props: LoginTestProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = localStore({
    props,
    states: {},
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { bind, action } = store;

  return (
    <>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: 500 }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <>
          <Form.Item
            label={bind('props:///userName/label')}
            key={bind('props:///userName/label')}
          >
            <>
              <Input
                placeholder={bind('props:///userName/placeholder')}
                onChange={(e) =>
                  action([
                    {
                      op: 'perform',
                      path: 'props:///changeUserName',
                      value: null,
                    },
                  ])({ e }, ['/e/target/value'])
                }
              />
            </>
          </Form.Item>
          <Form.Item
            label={bind('props:///passWord/label')}
            key={bind('props:///passWord/label')}
          >
            <>
              <Input
                placeholder={bind('props:///passWord/placeholder')}
                onChange={(e) =>
                  action([
                    {
                      op: 'perform',
                      path: 'props:///changePassWord',
                      value: null,
                    },
                  ])({ e }, ['/e/target/value'])
                }
              />
            </>
          </Form.Item>
          <Form.Item
            label={bind('props:///repeatPassword/label')}
            key={bind('props:///repeatPassword/label')}
          >
            <>
              <Input
                placeholder={bind('props:///repeatPassword/placeholder')}
                onChange={(e) =>
                  action([
                    {
                      op: 'perform',
                      path: 'props:///changeRepeatPassword',
                      value: null,
                    },
                  ])({ e }, ['/e/target/value'])
                }
              />
            </>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <>
              <Button
                loading={bind('props:///loading')}
                type="primary"
                htmlType="submit"
                onClick={() =>
                  action([
                    { op: 'perform', path: 'props:///submit', value: null },
                  ])()
                }
              >
                {bind('props:///btnName')}
              </Button>
            </>
          </Form.Item>
          <Typography.Paragraph>
            {JSON.stringify(bind('props:///result'))}
          </Typography.Paragraph>
        </>
      </Form>
    </>
  );
}

LoginTest.defaultProps = {
  userName: { label: '用户名', placeholder: '请输入用户名' },
  passWord: { label: '密码', placeholder: '请输入密码' },
  repeatPassword: { label: '确认密码', placeholder: '请输入确认密码' },
  btnName: '登录',
  result: '',
  loading: false,
  submit: '() => {}',
};
