import React from 'react';

import type { AppProps } from 'next/app';
import type { ThemeConfig } from 'antd';

import ConfigProvider from 'antd/lib/config-provider';
import { ConfigProvider as AntdConfigProvider } from 'antd';

import { StyleProvider } from '@ant-design/cssinjs';
import { FloatButton, theme as antd_theme } from 'antd';
const FloatButtonGroup = FloatButton.Group;

import DefaultTheme from '@/styles/themes/default.json';

const theme = ({Component, pageProps}: AppProps) => ({
  Component: (props: any) => {
    // todo 动态主题，根据元数据配置生成
    // 右下角悬浮按钮上，放一个主题按钮，构建一个主题面板
    // 1. 外观三种：浅色、深色、自动
    // 2. 排版：普通、紧凑
    // 3. 微调(仅内测以下环境开放)：获取antd所有token，自动构建一个表单 - 不友好，应该官方搭配，用户选择，除了前两种再逐渐增加其他类型
    // 调整后，这里组装theme并传给config provider(记录到local storage中)
    const theme: ThemeConfig = {
      token: DefaultTheme.token,
      algorithm: DefaultTheme.algorithm.map(it => new Function('theme', `return theme.${it}`)(antd_theme)),
    };
    return (
      <StyleProvider layer autoClear>
        <ConfigProvider theme={theme}>
          <AntdConfigProvider theme={theme}>
            <FloatButtonGroup trigger='hover'>
              <FloatButton />
            </FloatButtonGroup>
            <Component {...props} />
          </AntdConfigProvider>
        </ConfigProvider>
      </StyleProvider>
    );
  },
  pageProps,
});

export default theme;
