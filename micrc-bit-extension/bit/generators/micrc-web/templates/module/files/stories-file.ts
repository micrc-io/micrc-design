/**
 * stories.ts
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { ModuleContextData } from '../_parse';

const tmpl = `// {{context.name}} stories
import React from 'react';

import { initGlobalStore } from '@micrc/bit.runtimes.micrc-web';

import type { {{context.namePascalCase}}Props } from './{{context.name}}';
import { {{context.namePascalCase}} } from './{{context.name}}';

import I18n from './meta/i18n.json';
import Integration from './meta/integration.json';

export default {
  component: {{context.namePascalCase}},
  title: '{{context.componentId}}',
};

const Template = (props: {{context.namePascalCase}}Props) => {
  initGlobalStore(zh_CN, I18n, null, Integration.init);
  return (<{{context.namePascalCase}} {...props} />);
};

export const Default = Template.bind({});
Default.args = {
  integration: Integration.simulation,
  router: null,
};
Basic.parameters = {
  micrc: {
    type: 'web',
    // eslint-disable-next-line global-require
    locale: require('antd/locale/zh_CN').default,
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
