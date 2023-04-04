/* eslint-disable no-alert */
/* eslint-disable no-console */
/**
 * authc-generic-layout-tmp stories
 */
import React from 'react';

import locale from 'antd/locale/zh_CN'; // todo 根据开发机系统语言动态化

import { ConfigProvider } from 'antd';

import type { AuthcGenericLayoutTmpProps } from './authc-generic-layout-tmp';
import { AuthcGenericLayoutTmp } from './authc-generic-layout-tmp';

export default {
  component: AuthcGenericLayoutTmp,
  title: 'micrc.demo/web/components/authc-generic-layout-tmp',
};

const Template = (props: AuthcGenericLayoutTmpProps) => (
  <ConfigProvider locale={locale}>
    <AuthcGenericLayoutTmp {...props} />
  </ConfigProvider>
);

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  micrc: {
    type: 'web',
  },
};
