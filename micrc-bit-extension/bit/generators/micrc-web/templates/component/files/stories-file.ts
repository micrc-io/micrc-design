/**
 * stories file
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { jsonObject } from '../../../lib/assembler';

import { ComponentContextData } from '../_parse';

const tmpl = `// {{context.name}} stories
import React from 'react';

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
{{/each}}
Basic.parameters = {
  micrc: {
    type: 'web',
    // eslint-disable-next-line global-require
    locale: require('antd/locale/zh_CN').default,
  },
};
`;

export function storiesFile(data: ComponentContextData) {
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
