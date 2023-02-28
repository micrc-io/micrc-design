/*
 * @Author: wuwanping
 * @Date: 2023-02-22 10:42:09
 * @LastEditTime: 2023-02-23 11:02:00
 * @LastEditors: wuwanping
 * @Description: 
 * @FilePath: /micrc-bit/bit/generators/component/micrc-web/templates/component/files/docs-file.ts
 */
import { AtomContextData } from '../_parse';
export function docsFile(data: AtomContextData) {
return`
---
description: 'A React Component for rendering text.'
---
import 'antd/dist/antd.less';    
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







