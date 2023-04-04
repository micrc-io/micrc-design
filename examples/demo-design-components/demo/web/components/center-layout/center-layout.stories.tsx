/* eslint-disable no-alert */
/* eslint-disable no-console */
/**
 * center-layout stories
 */
import React from 'react';

import locale from 'antd/locale/zh_CN'; // todo 根据开发机系统语言动态化

import { ConfigProvider } from 'antd';

import type { CenterLayoutProps } from './center-layout';
import { CenterLayout } from './center-layout';

export default {
  component: CenterLayout,
  title: 'micrc.demo/web/components/center-layout',
};

const Template = (props: CenterLayoutProps) => (
  <ConfigProvider locale={locale}>
    <CenterLayout {...props} />
  </ConfigProvider>
);

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  micrc: {
    type: 'web',
  },
};
