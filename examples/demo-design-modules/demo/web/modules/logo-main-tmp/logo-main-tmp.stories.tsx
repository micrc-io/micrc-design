// logo-main-tmp stories
import React from 'react';

import { ConfigProvider } from 'antd';
import locale from 'antd/locale/zh_CN'; // todo 通过开发机系统语言动态化

import {
  initModuleGlobalStore,
  IntegrationSimulator,
} from '@micrc/bit.runtimes.micrc-web';

import type { LogoMainTmpProps } from './logo-main-tmp';
import { LogoMainTmp } from './logo-main-tmp';

import I18n from './meta/i18n.json';
import Integration from './meta/integration.json';

export default {
  component: LogoMainTmp,
  title: 'micrc.demo/web/modules/logo-main-tmp',
};

const permissions = [];

const Template = (props: LogoMainTmpProps) => {
  // todo 通过开发机系统语言动态化
  initModuleGlobalStore(permissions, 'zh_CN', I18n, null, Integration.init);
  return (
    <ConfigProvider locale={locale}>
      <LogoMainTmp {...props} />
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
