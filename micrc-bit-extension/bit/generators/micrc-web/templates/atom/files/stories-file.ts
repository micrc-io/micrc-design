/**
 * stories file
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { jsonObject } from '../../../lib/assembler';

import { AtomContextData } from '../_parse';

const tmpl = `/* eslint-disable no-alert */
/* eslint-disable no-console */
import React from 'react';

import locale from 'antd/locale/zh_CN'; // todo 根据开发机系统语言动态化

{{!-- 导入使用的组件 --}}
{{#each stories.componentImports}}
{{#if this.types}}
{{#if this.default}}
import {{this.default}}, {
  {{#each this.types}}
  {{this}},
  {{/each}}
} from '{{@key}}';
{{else}}
import {
  {{#each this.types}}
  {{this}},
  {{/each}}
} from '{{@key}}';
{{/if}}
{{else}}
import {{this.default}} from '{{@key}}';
{{/if}}
{{/each}}

{{!-- 导入内部组件（将三方组件包一层i18n） --}}
{{#each stories.insideComponentsImports}}
{{!-- import type { {{@key}}Props } from '{{this}}'; 暂不需要 --}}
import { {{@key}} } from '{{{this}}}';
{{/each}}

import type { {{context.namePascalCase}}Props } from './{{context.name}}';
import { {{context.namePascalCase}} } from './{{context.name}}';

export default {
  component: {{context.namePascalCase}},
  title: '{{context.componentId}}',
};

const Template = (props: {{context.namePascalCase}}Props) => (<{{context.namePascalCase}} {...props} />);

{{#each stories.examples}}
export const {{@key}} = Template.bind({});
{{@key}}.args = {
  {{#each this.props}}
  {{@key}}: {{{jsonObject this}}},
  {{/each}}
};
{{@key}}.parameters = {
  micrc: {
    type: 'web',
    locale,
  },
};
{{/each}}
`;

export function storiesFile(data: AtomContextData) {
  HandleBars.registerHelper('jsonObject', (context) => jsonObject(context));

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
