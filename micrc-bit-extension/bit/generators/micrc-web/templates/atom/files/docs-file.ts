/**
 * doc file
 */
import { AtomContextData } from '../_parse';

export function docsFile(data: AtomContextData) {
  return `---
description: 'A React Component for rendering text.'
---

import 'antd/dist/reset.css';

import { ${data.context.namePascalCase} } from './${data.context.name}';

A component that does something special and renders text in a div.

### Component usage
\`\`\`js
<${data.context.namePascalCase}>Hello world!</${data.context.namePascalCase}>
\`\`\`

### Render hello world!

\`\`\`js live
<${data.context.namePascalCase}>Hello world!</${data.context.namePascalCase}>
\`\`\`
`;
}
