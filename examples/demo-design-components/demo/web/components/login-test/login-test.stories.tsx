/* eslint-disable no-alert */
/* eslint-disable no-console */
/**
 * login-test stories
 */
import React from 'react';

import locale from 'antd/locale/zh_CN'; // todo 根据开发机系统语言动态化

import { Button, Form, ConfigProvider } from 'antd';

import type { LoginTestProps } from './login-test';
import { LoginTest } from './login-test';

export default {
  component: LoginTest,
  title: 'micrc.demo/web/components/login-test',
};

const Template = (props: LoginTestProps) => (
  <ConfigProvider locale={locale}>
    <LoginTest {...props} />
  </ConfigProvider>
);

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  micrc: {
    type: 'web',
  },
};
