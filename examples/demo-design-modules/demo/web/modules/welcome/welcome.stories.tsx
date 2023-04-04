// welcome stories
import React from 'react';

import { ConfigProvider } from 'antd';
import locale from 'antd/locale/zh_CN'; // todo 通过开发机系统语言动态化

import {
  initModuleGlobalStore,
  IntegrationSimulator,
} from '@micrc/bit.runtimes.micrc-web';

import type { WelcomeProps } from './welcome';
import { Welcome } from './welcome';

import I18n from './meta/i18n.json';
import Integration from './meta/integration.json';

export default {
  component: Welcome,
  title: 'micrc.demo/web/modules/welcome',
};

const permissions = [];

const Template = (props: WelcomeProps) => {
  // todo 通过开发机系统语言动态化
  initModuleGlobalStore(permissions, 'zh_CN', I18n, null, Integration.init);
  return (
    <ConfigProvider locale={locale}>
      <Welcome {...props} />
      <IntegrationSimulator integration={Integration.simulation} />
    </ConfigProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  router: null,
};
Default.parameters = {
  micrc: {
    type: 'web',
  },
};
