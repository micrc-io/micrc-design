// welcome-tmp stories
import React from 'react';

import { ConfigProvider } from 'antd';
import locale from 'antd/locale/zh_CN'; // todo 通过开发机系统语言动态化

import {
  initModuleGlobalStore,
  IntegrationSimulator,
} from '@micrc/bit.runtimes.micrc-web';

import type { WelcomeTmpProps } from './welcome-tmp';
import { WelcomeTmp } from './welcome-tmp';

import I18n from './meta/i18n.json';
import Integration from './meta/integration.json';

export default {
  component: WelcomeTmp,
  title: 'micrc.demo/web/modules/welcome-tmp',
};

const permissions = [];

const Template = (props: WelcomeTmpProps) => {
  // todo 通过开发机系统语言动态化
  initModuleGlobalStore(permissions, 'zh_CN', I18n, null, Integration.init);
  return (
    <ConfigProvider locale={locale}>
      <WelcomeTmp {...props} />
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
