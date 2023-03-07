/**
 * stories file
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { ModuleContextData } from '../_parse';

const tmpl = `// {{context.name}} stories
import React from 'react';

import locale from 'antd/locale/zh_CN'; // todo 通过开发机系统语言动态化

import { initModuleGlobalStore } from '@micrc/bit.runtimes.micrc-web';

import type { {{context.namePascalCase}}Props } from './{{context.name}}';
import { {{context.namePascalCase}} } from './{{context.name}}';

import I18n from './meta/i18n.json';
import Integration from './meta/integration.json';

export default {
  component: {{context.namePascalCase}},
  title: '{{context.componentId}}',
};

const Template = (props: {{context.namePascalCase}}Props) => {
  // todo 通过开发机系统语言动态化
  initModuleGlobalStore('zh_CN', I18n, null, Integration.init);
  return (<{{context.namePascalCase}} {...props} />);
};

export const Default = Template.bind({});
Default.args = {
  integration: Integration.simulation,
  router: null,
};
Default.parameters = {
  micrc: {
    type: 'web',
    // eslint-disable-next-line global-require
    locale,
  },
};
`;

export function storiesFile(data: ModuleContextData) {
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
