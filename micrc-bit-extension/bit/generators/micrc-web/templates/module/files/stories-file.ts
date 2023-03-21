/**
 * stories file
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { jsonObject } from '../../../lib/assembler';

import { ModuleContextData } from '../_parse';

const tmpl = `// {{context.name}} stories
import React from 'react';

import { ConfigProvider } from 'antd';
import locale from 'antd/locale/zh_CN'; // todo 通过开发机系统语言动态化

import { initModuleGlobalStore, IntegrationSimulator } from '@micrc/bit.runtimes.micrc-web';

import type { {{context.namePascalCase}}Props } from './{{context.name}}';
import { {{context.namePascalCase}} } from './{{context.name}}';

import I18n from './meta/i18n.json';
import Integration from './meta/integration.json';

export default {
  component: {{context.namePascalCase}},
  title: '{{context.componentId}}',
};

const permissions = {{{json permissions}}};

const Template = (props: {{context.namePascalCase}}Props) => {
  // todo 通过开发机系统语言动态化
  initModuleGlobalStore(permissions, 'zh_CN', I18n, null, Integration.init);
  return (
    <ConfigProvider locale={locale}>
      <{{context.namePascalCase}} {...props} />
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
`;

export function storiesFile(data: ModuleContextData) {
  HandleBars.registerHelper('json', (context) => jsonObject(context));

  return prettier.format(
    HandleBars.compile(tmpl)(data),
    {
      parser: 'typescript',
      semi: true,
      singleQuote: true,
      bracketSameLine: false,
      singleAttributePerLine: true,
      trailingComma: 'all',
    },
  );
}
