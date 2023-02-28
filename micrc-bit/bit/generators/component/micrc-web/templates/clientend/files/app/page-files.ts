/**
 * page files
 */
import fs from 'fs';
import path from 'path';

import HandleBars from 'handlebars';
import prettier from 'prettier';
import { propsAssembler, assembler } from '../../../assembler';
import type { ClientendContextData } from '../../_parser';

const tmpl = `
{{#each componentImports}}
    import { {{@key }} } from '{{this}}'
{{/each}}
{{#each moduleImports}}
import { {{@key }} } from '{{this}}'
{{/each}}
{{#with assembly}}
<{{layout}}
  {{{propsAssembler props}}}
/>
{{/with}}
`;

export function appPageFiles(data: ClientendContextData) {
  HandleBars.registerHelper('propsAssembler', (context) => propsAssembler(context));
  // 创建页面目录
  const pageBasePath = path.resolve(data.intro.sourceDir, 'app', 'pages');
  console.log("=====",fs.existsSync(pageBasePath),"0000",pageBasePath)///_examples/web/clientend9/test/app/pages

  if (!fs.existsSync(pageBasePath)) {
    // eslint-disable-next-line @typescript-eslint/semi
    fs.mkdirSync(pageBasePath, { recursive: true });
  }
  // _examples/web/clientend1/test/app/pages/pagestest/index.mdx
  // 循环写入每一个页面文件mdx
  Object.keys(data.pages).forEach((uri) => {
    fs.writeFileSync(
      // _examples/web/clientend9/test/app/pages/pagestest/index.mdx,
      path.resolve(pageBasePath, uri === '/' ? '' : uri, 'index.mdx'),
      prettier.format(
        HandleBars.compile(tmpl)(data.pages[uri]),
        {
          parser: 'typescript',
          semi: true,
          singleQuote: true,
          bracketSameLine: false,
          singleAttributePerLine: true,
        },
      ),
    );
  });
  // pages/readme中的内容
  return 'page files';
}
