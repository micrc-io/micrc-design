/**
 * stories file
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { ComponentContextData } from '../_parse';

const tmpl = `// {{context.name}} stories
import React from 'react';

import type { {{context.namePascalCase}}Props } from './{{context.name}}';
import { {{context.namePascalCase}} } from './{{context.name}}';

export default {
  component: {{context.namePascalCase}},
  title: '{{context.componentId}}',
};

const Template = (props: {{context.namePascalCase}}Props) => (<{{context.namePascalCase}} {...props} />);

{{#each stories}}
export const {{@key}} = Template.bind({});
{{@key}}.args = {
  {{#each this}}
  {{@key}}: {{{this}}},
  {{/each}}
};
{{/each}}
`;

export function storiesFile(data: ComponentContextData) {
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
