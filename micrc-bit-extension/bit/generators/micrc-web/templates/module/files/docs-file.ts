/**
 * doc file
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { jsonObject } from '../../../lib/assembler';

import { ModuleContextData } from '../_parse';

const tmpl = `---
description: {{doc.title}}
labels: {{{jsonObject doc.labels}}}
---

import { Default } from './{{context.name}}.composition';
import 'antd/dist/reset.css';

{{doc.prototype}}

#### {{{ doc.desc }}}
\`\`\`js
<Default {...Default.args} />
\`\`\`
`;

export function docFile(data: ModuleContextData) {
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
