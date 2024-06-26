// system-account-login stories
import React from 'react';

import { ConfigProvider } from 'antd';
import locale from 'antd/locale/zh_CN'; // todo 通过开发机系统语言动态化

import {
  initModuleGlobalStore,
  IntegrationSimulator,
} from '@micrc/bit.runtimes.micrc-web';

import type { SystemAccountLoginProps } from './system-account-login';
import { SystemAccountLogin } from './system-account-login';

import I18n from './meta/i18n.json';
import I18ns from './meta/i18ns.json';
import Integration from './meta/integration.json';

export default {
  component: SystemAccountLogin,
  title: 'colibri-tech.examples/examples/web/modules/system-account-login',
};

const permissions = [];

const Template = (props: SystemAccountLoginProps) => {
  // todo 通过开发机系统语言动态化
  initModuleGlobalStore(
    permissions,
    'zh_CN',
    'colibri-distributor-workbench',
    I18n,
    I18ns,
    null,
    Integration.init,
  );
  return (
    <ConfigProvider locale={locale}>
      <SystemAccountLogin {...props} />
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
