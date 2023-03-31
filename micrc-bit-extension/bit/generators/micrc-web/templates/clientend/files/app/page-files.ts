/**
 * page files
 */
import fs from 'fs';
import path from 'path';

import HandleBars from 'handlebars';
import prettier from 'prettier';

import { propsAssembler } from '../../../../lib/assembler';
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
  if (!fs.existsSync(pageBasePath)) {
    fs.mkdirSync(pageBasePath, { recursive: true });
  }
  // 循环写入每一个页面文件mdx
  Object.keys(data.pages).forEach((uri) => {
    // 创建多级页面目录
    const dirPath = path.join(pageBasePath, uri === '/' ? '' : uri);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(
      path.join(dirPath, 'index.mdx'),
      prettier.format(
        HandleBars.compile(tmpl)(data.pages[uri]),
        {
          parser: 'mdx',
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
