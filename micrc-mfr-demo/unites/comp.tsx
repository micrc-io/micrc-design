import React from 'react';

import ConfigProvider from 'antd/lib/config-provider';
import { ConfigProvider as AntdConfigProvider } from 'antd';

import { StyleProvider } from '@ant-design/cssinjs/lib';
import StyleContext from '@ant-design/cssinjs/lib/StyleContext';

import Test from '@colibri/test';

export default function Comp() {
  const style = React.useContext(StyleContext);
  const config = React.useContext(ConfigProvider.ConfigContext);
  return (
    <StyleProvider {...style}>
      <AntdConfigProvider {...config}>
        <p>用布局装配模块3</p>
        <Test />
      </AntdConfigProvider>
    </StyleProvider>
  );
}
