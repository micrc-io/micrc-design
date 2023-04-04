/* eslint-disable no-alert */
/* eslint-disable no-console */
/**
 * product-introduction stories
 */
import React from 'react';

import locale from 'antd/locale/zh_CN'; // todo 根据开发机系统语言动态化

import { ConfigProvider } from 'antd';

import type { ProductIntroductionProps } from './product-introduction';
import { ProductIntroduction } from './product-introduction';

export default {
  component: ProductIntroduction,
  title: 'micrc.demo/web/components/product-introduction',
};

const Template = (props: ProductIntroductionProps) => (
  <ConfigProvider locale={locale}>
    <ProductIntroduction {...props} />
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
  img: 'https://s1.ax1x.com/2023/03/22/ppdAqyV.png',
  productTitle: '在一个地方管理你所有的商店和在线销售。',
  productText: '整合多达10个Mercado Livre商店和购物免费与ColibriERP',
};
Test.parameters = {
  micrc: {
    type: 'web',
  },
};
