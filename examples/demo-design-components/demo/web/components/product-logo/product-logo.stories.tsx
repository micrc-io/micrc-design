/* eslint-disable no-alert */
/* eslint-disable no-console */
/**
 * product-logo stories
 */
import React from 'react';

import locale from 'antd/locale/zh_CN'; // todo 根据开发机系统语言动态化

import { ConfigProvider } from 'antd';

import type { ProductLogoProps } from './product-logo';
import { ProductLogo } from './product-logo';

export default {
  component: ProductLogo,
  title: 'micrc.demo/web/components/product-logo',
};

const Template = (props: ProductLogoProps) => (
  <ConfigProvider locale={locale}>
    <ProductLogo {...props} />
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
