/**
 * composition.ts
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { AtomContextData } from '../_parse';

const tmpl = `// {{context.name}} composition
import React from 'react';

import {
  {{#each stories}}
  {{@key}},
  {{/each}}
} from './{{context.name}}.stories';

{{#each stories}}
export const {{@key}} = () => <{{@key}} {...{{@key}}.args} />;
{{/each}}
`;

export function compositionFile(data: AtomContextData) {
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
