/**
 * doc file
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { ComponentContextData } from '../_parse';

const tmpl = `---
description: {{doc.title}}
label: {{doc.label}}
---

import 'antd/dist/antd.less';

import {
  {{#each doc.examples}}
  {{@key}}
  {{/each}}
} from './{{context.name}}.composition';

{{doc.prototype}}


{{#each doc.examples}}
{{this}}

### Component usage
\`\`\`js
<{{@key}} />
\`\`\`
{{/each}}
`;

export function docFile(data: ComponentContextData) {
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
