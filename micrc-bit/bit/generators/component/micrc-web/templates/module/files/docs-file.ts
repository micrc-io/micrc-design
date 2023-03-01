import HandleBars from 'handlebars';
import prettier from 'prettier';
import { ModuleContextData } from '../_parse';

const tmpl = `---
description: {{doc.title}}
label: {{doc.label}}
---

import 'antd/dist/antd.less';

import { Default } from './{{context.name}}.composition';

{{doc.prototype}}

{{{doc.desc}}}

### Component usage
\`\`\`js
<Default {...Default.args} />
\`\`\`
`;

export function docFile(data: ModuleContextData) {
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
