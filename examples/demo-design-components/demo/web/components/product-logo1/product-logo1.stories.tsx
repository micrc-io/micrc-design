/* eslint-disable no-alert */
/* eslint-disable no-console */
/**
 * product-logo1 stories
 */
import React from 'react';

import locale from 'antd/locale/zh_CN'; // todo 根据开发机系统语言动态化

import { ConfigProvider } from 'antd';

import type { ProductLogo1Props } from './product-logo1';
import { ProductLogo1 } from './product-logo1';

export default {
  component: ProductLogo1,
  title: 'micrc.demo/web/components/product-logo1',
};

const Template = (props: ProductLogo1Props) => (
  <ConfigProvider locale={locale}>
    <ProductLogo1 {...props} />
  </ConfigProvider>
);

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  micrc: {
    type: 'web',
  },
};
export const Test = Template.bind({});
Test.args = {
  img: 'https://s1.ax1x.com/2023/03/23/ppwKdYT.png',
};
Test.parameters = {
  micrc: {
    type: 'web',
  },
};
