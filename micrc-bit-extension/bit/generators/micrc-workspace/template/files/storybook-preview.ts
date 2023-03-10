// storybook preview.jsx
export function storybookPreview() {
  // language=JavaScript format=false
  return `// decorator: taro尺寸处理, 国际化
import React from 'react';

export const decorators = [
  (Story, { parameters: { micrc: { type, locale } } }) => {
    if (type === 'web') {
      const ConfigProvider = require('antd').ConfigProvider;
      const en_US = require('antd/locale/en_US').default;
      return <ConfigProvider locale={locale || en_US}><Story /></ConfigProvider>;
    }
    if (type === 'mini') {
      const Taro = require('@tarojs/taro').default;
      const { defineCustomElements, applyPolyfills } = require('@tarojs/components/loader');
      require('@tarojs/components/dist/taro-components/taro-components.css');
      require('taro-ui/dist/style/index.scss')
      applyPolyfills().then(() => {
        defineCustomElements(window);
      });
      Taro.initPxTransform({
        designWidth: 750,
        deviceRatio: {
          '640': 2.34 / 2,
          '750': 1,
          '828': 1.81 / 2,
        },
      });
      return <Story />; // taro-ui暂不支持国际化, 等待切换组件库
    }
    return <Story />;
  },
];

// 插件参数设置
export const parameters = {
  actions: {
    // argTypesRegex: "^on[A-Z].*"
  },
  controls: {
    // matchers: {
    //   color: /(background|color)$/i,
    //   date: /Date$/,
    // },
  },
}
`;
}
