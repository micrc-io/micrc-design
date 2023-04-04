/* eslint-disable no-alert */
/* eslint-disable no-console */
/**
 * blank-layout stories
 */
import React from 'react';

import locale from 'antd/locale/zh_CN'; // todo 根据开发机系统语言动态化

import { ConfigProvider } from 'antd';

import type { BlankLayoutProps } from './blank-layout';
import { BlankLayout } from './blank-layout';

export default {
  component: BlankLayout,
  title: 'micrc.demo/web/components/blank-layout',
};

const Template = (props: BlankLayoutProps) => (
  <ConfigProvider locale={locale}>
    <BlankLayout {...props} />
  </ConfigProvider>
);

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  micrc: {
    type: 'web',
  },
};
