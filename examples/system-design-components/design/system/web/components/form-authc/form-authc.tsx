/* eslint-disable react/no-unused-prop-types */
// 表单验证组件
import React from 'react';

import { Button, Form, Input, Image, Space } from 'antd';

import {
  localStore,
  I18NVisibleProxy,
  I18NHighlight,
  i18nHightLight,
} from '@micrc/bit.runtimes.micrc-web';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './form-authc.module.scss';

export type FormAuthcProps = {
  userName: object;
  userNameMsg: string;
  userNameStatus: string;
  passWord: object;
  passWordMsg: string;
  passWordStatus: string;
  authCode: object;
  authCodeMsg: string;
  authCodeStatus: string;
  authCodeImg: string;
  btnName: string;
  loading: boolean;
  changeUserName: (value: any) => void;
  changePassWord: (value: any) => void;
  changeAuthCode: (value: any) => void;
  changeAuthCodeImg: () => void;
  submit: () => void;
};

export function FormAuthc(props: FormAuthcProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = localStore({
    props,
    states: {},
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { bind, action } = store;

  return (
    <Form
      onFinish={() =>
        action([{ op: 'perform', path: 'props:///submit', value: null }])()
      }
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ width: 350 }}
      initialValues={{ remember: true }}
      autoComplete="off"
    >
      <>
        <Form.Item
          label={bind('props:///userName/label')}
          validateStatus={bind('props:///userNameStatus')}
          help={bind('props:///userNameMsg')}
        >
          <Input
            placeholder={bind('props:///userName/placeholder')}
            onChange={(e) =>
              action([
                { op: 'perform', path: 'props:///changeUserName', value: null },
              ])({ e }, ['/e/target/value'])
            }
          />
        </Form.Item>
        <Form.Item
          label={bind('props:///passWord/label')}
          validateStatus={bind('props:///passWordStatus')}
          help={bind('props:///passWordMsg')}
        >
          <Input.Password
            autoComplete="on"
            placeholder={bind('props:///passWord/placeholder')}
            onChange={(e) =>
              action([
                { op: 'perform', path: 'props:///changePassWord', value: null },
              ])({ e }, ['/e/target/value'])
            }
          />
        </Form.Item>
        <Form.Item
          label={bind('props:///authCode/label')}
          validateStatus={bind('props:///authCodeStatus')}
          help={bind('props:///authCodeMsg')}
        >
          <Space>
            <>
              <Input
                placeholder={bind('props:///authCode/placeholder')}
                onChange={(e) =>
                  action([
                    {
                      op: 'perform',
                      path: 'props:///changeAuthCode',
                      value: null,
                    },
                  ])({ e }, ['/e/target/value'])
                }
              />
              <Image
                width="100px"
                height="32px"
                src={bind('props:///authCodeImg')}
                preview={false}
                className={styles.img}
                onClick={() =>
                  action([
                    {
                      op: 'perform',
                      path: 'props:///changeAuthCodeImg',
                      value: null,
                    },
                  ])({}, [])
                }
              />
            </>
          </Space>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            loading={bind('props:///loading')}
            type="primary"
            htmlType="submit"
            className={styles.btn}
          >
            {bind('props:///btnName')}
          </Button>
        </Form.Item>
      </>
    </Form>
  );
}

FormAuthc.defaultProps = {
  userName: { label: ' ', placeholder: ' ' },
  userNameMsg: '',
  userNameStatus: '',
  passWord: { label: ' ', placeholder: ' ' },
  passWordMsg: '',
  passWordStatus: '',
  authCode: { label: ' ', placeholder: ' ' },
  authCodeMsg: 'string',
  authCodeStatus: '',
  authCodeImg: 'https://s2.loli.net/2023/04/04/DVfNMPjdqEU76uQ.png',
  btnName: ' ',
  loading: false,
  submit: (param) => console.log(`param: ${param}`),
  changeUserName: (value) => console.log(`value: ${value}`),
  changePassWord: (value) => console.log(`value: ${value}`),
  changeAuthCode: (value) => console.log(`value: ${value}`),
  changeAuthCodeImg: (value) => console.log(`value: ${value}`),
};
