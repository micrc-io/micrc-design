/* eslint-disable no-alert */
/* eslint-disable no-console */
/**
 * input-query stories
 */
import React from 'react';

import locale from 'antd/locale/zh_CN'; // todo 根据开发机系统语言动态化

import { Button, Form, ConfigProvider } from 'antd';

import type { InputQueryProps } from './input-query';
import { InputQuery } from './input-query';

export default {
  component: InputQuery,
  title: 'micrc.demo/web/components/input-query',
};

const Template = (props: InputQueryProps) => (
  <ConfigProvider locale={locale}>
    <InputQuery {...props} />
  </ConfigProvider>
);

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  micrc: {
    type: 'web',
  },
};
