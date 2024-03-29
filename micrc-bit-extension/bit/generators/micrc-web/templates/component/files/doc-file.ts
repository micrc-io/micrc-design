/**
 * doc file
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { jsonObject } from '../../../lib/assembler';

import { ComponentContextData } from '../_parse';

const tmpl = `---
description: {{doc.title}}
labels: {{{jsonObject doc.labels}}}
---

import 'antd/dist/reset.css';
import {
  {{#each stories.examples}}
  {{@key}}Story,
  {{/each}}
} from './{{context.name}}.composition';

{{doc.prototype}}

{{#each stories.examples}}
#### {{{this.desc}}}
\`\`\`js
<{{@key}} />
\`\`\`
{{/each}}
`;

export function docFile(data: ComponentContextData) {
  HandleBars.registerHelper('jsonObject', (context) => jsonObject(context));

  return prettier.format(
    HandleBars.compile(tmpl)(data),
    {
      parser: 'mdx',
      semi: true,
      singleQuote: true,
      bracketSameLine: false,
      singleAttributePerLine: true,
    },
  );
}
