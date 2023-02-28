// ui stories
import React from 'react';

import { initGlobalStore } from '@micrc/bit.runtimes.micrc-web';

import type { UiProps } from './ui';
import { Ui } from './ui';

import I18n from './meta/i18n.json';
import Integration from './meta/integration.json';

export default {
  component: Ui,
  title: 'micrc.bit/_examples/web/modules/ui',
};

const Template = (props: UiProps) => {
  initGlobalStore(null, I18n, null, Integration.init);
  return <Ui {...props} />;
};

export const Default = Template.bind({});
Default.args = {
  integration: Integration.simulation,
  router: null,
};
