import React from 'react';

import type { AppProps } from 'next/app';

import ConfigProvider from 'antd/lib/config-provider';
import { ConfigProvider as AntdConfigProvider } from 'antd';

// todo 通过global获取, 动态通过mf装载语言包并选择
const locale_str = process.env.locale ?? 'zh_CN';

import enUS from 'antd/locale/en_US';
import 'dayjs/locale/en';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

let locale = enUS;

if (locale_str === 'zh_CN') {
  locale = zhCN;
}

const i18n = ({Component, pageProps}: AppProps) => ({
  Component: (props: any) => (
    <ConfigProvider locale={locale}>
      <AntdConfigProvider locale={locale}>
        <Component {...props} />
      </AntdConfigProvider>
    </ConfigProvider>
  ),
  pageProps,
});

export default i18n;

