// storybook preview.jsx
export function storybookPreview() {
  // language=JavaScript format=false
  return `// noinspection NpmUsedModulesInstalled
import React from 'react';

import Taro from '@tarojs/taro';
import { defineCustomElements, applyPolyfills } from '@tarojs/components/loader';
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN';

import '@tarojs/components/dist/taro-components/taro-components.css';
import 'taro-ui/dist/style/index.scss'
import 'antd/dist/antd.css';

export const decorators = [
  (Story) => {
    applyPolyfills().then(() => {
      defineCustomElements(window);
    });
    // noinspection JSUnresolvedFunction
    Taro.initPxTransform({
      designWidth: 750,
      deviceRatio: {
        '640': 2.34 / 2,
        '750': 1,
        '828': 1.81 / 2,
      },
    });
    return <ConfigProvider locale={zhCN}><Story /></ConfigProvider>
  },
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
`;
}
