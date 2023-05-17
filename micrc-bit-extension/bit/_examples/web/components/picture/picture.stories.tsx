/* eslint-disable no-alert */
/* eslint-disable no-console */
/**
 * picture stories
 */
import React from 'react';

import locale from 'antd/locale/zh_CN'; // todo 根据开发机系统语言动态化

import { ConfigProvider } from 'antd';

import type { PictureProps } from './picture';
import { Picture } from './picture';

import LogoPngSource from './images/logo.png';

const LogoPng = LogoPngSource.src || LogoPngSource;

export default {
  component: Picture,
  title: 'micrc.bit/_examples/web/components/picture',
};

const Template = (props: PictureProps) => (
  <ConfigProvider locale={locale}>
    <Picture {...props} />
  </ConfigProvider>
);

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  micrc: {
    type: 'web',
  },
};
export const Admin = Template.bind({});
Admin.args = {
  img: LogoPng,
};
Admin.parameters = {
  micrc: {
    type: 'web',
  },
};
export const Authc = Template.bind({});
Authc.args = {
  img: LogoPng,
};
Authc.parameters = {
  micrc: {
    type: 'web',
  },
};
