/* eslint-disable no-alert */
/* eslint-disable no-console */
/**
 * authc-generic-layout stories
 */
import React from 'react';

import locale from 'antd/locale/zh_CN'; // todo 根据开发机系统语言动态化

import { ConfigProvider } from 'antd';

import type { AuthcGenericLayoutProps } from './authc-generic-layout';
import { AuthcGenericLayout } from './authc-generic-layout';

export default {
  component: AuthcGenericLayout,
  title: 'micrc.demo/web/components/authc-generic-layout',
};

const Template = (props: AuthcGenericLayoutProps) => (
  <ConfigProvider locale={locale}>
    <AuthcGenericLayout {...props} />
  </ConfigProvider>
);

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  micrc: {
    type: 'web',
  },
};
