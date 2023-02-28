// demo stories
import React from 'react';

import { initGlobalStore } from '@micrc/bit.runtimes.micrc-web';

import type { DemoProps } from './demo';
import { Demo } from './demo';

import I18n from './meta/i18n.json';
import Integration from './meta/integration.json';

export default {
  component: Demo,
  title: 'micrc.bit/_examples/web/modules/demo',
};

const Template = (props: DemoProps) => {
  initGlobalStore(null, I18n, null, Integration.init);
  return <Demo {...props} />;
};

export const Default = Template.bind({});
Default.args = {
  integration: Integration.simulation,
  router: null,
};
