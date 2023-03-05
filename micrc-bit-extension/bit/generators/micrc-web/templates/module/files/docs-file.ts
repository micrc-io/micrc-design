/**
 * doc file
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { jsonObject } from '../../../lib/assembler';

import { ModuleContextData } from '../_parse';

const tmpl = `---
description: {{doc.title}}
label: {{{jsonObject doc.labels}}}
---

import 'antd/dist/antd.less';

import { Default } from './{{context.name}}.composition';

{{doc.prototype}}

### default usage
#### {{{doc.desc}}}
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
