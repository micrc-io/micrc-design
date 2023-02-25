/**
 * doc file
 */
import { ComponentContextData } from '../_parse';

export function docFile(data: ComponentContextData) {
  return `---
description: A demo of web component generating
label: []
---

import 'antd/dist/antd.less';
import { ${data.context.namePascalCase} } from './${data.context.name}';

A demo of web component generating.

### Component usage
\`\`\`js
<${data.context.namePascalCase} />
\`\`\`
`;
}
