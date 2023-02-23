/**
 * page files
 */
import fs from 'fs';
import path from 'path';

import HandleBars from 'handlebars';
import prettier from 'prettier';

import type { ClientendContextData } from '../../_parser';

const tmpl = `{{#each comment}}// {{this}}\n{{/each}}
{{#each componentImports}}
{{/each}}

{{#each moduleImports}}
{{/each}}

{{#with assembly}}
<{{layout}}
  {{{propsAssembler props}}}
/>
{{/with}}
`;

const propsAssembler = (props: object): string => {
  let retVal = '';
  Object.keys(props).forEach((name) => {
    const prop = props[name];
    const strProp = typeof prop === 'string' && !prop.startsWith('bind') && !/\(.*\) => action/.test(prop);
    const propStr = strProp ? `'${prop}'` : '';
    // eslint-disable-next-line no-underscore-dangle
    const objProp = typeof prop === 'object' && prop._val;
    // eslint-disable-next-line no-underscore-dangle
    const propObj = objProp ? `{${JSON.stringify(prop._val)}}` : '';
    const exprProp = typeof prop === 'string' && (prop.startsWith('bind') || /\(.*\) => action/.test(prop));
    const propExpr = exprProp ? `{${prop}}` : '';
    const compProp = typeof prop === 'object' && !objProp;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const propComp = compProp ? `{${assembler(prop)}}` : '';
    retVal += ` ${name}=${propStr}${propObj}${propExpr}${propComp}`;
  });
  return retVal;
};

const assembler = (components: object): string => {
  let retVal = '';
  Object.keys(components).forEach((name) => {
    const comp = components[name];
    const nullChildren: boolean = !comp.children;
    const textChildren: boolean = comp.children && typeof comp.children === 'string';
    const nestedChildren: boolean = comp.children && typeof comp.children === 'object';
    const endTag = `</${name}>`;
    retVal += `<${name}`
            + `${propsAssembler(comp.props)}`
            + `${nullChildren ? '\n/>' : '\n>'}`
            + `${textChildren ? comp.children : ''}`
            + `${nestedChildren ? assembler(comp.children) : ''}`
            + `${nullChildren ? '' : endTag}`;
  });
  return retVal;
};

export function appPageFiles(data: ClientendContextData) {
  HandleBars.registerHelper('propsAssembler', (context) => propsAssembler(context));
  // 创建页面目录
  const pageBasePath = path.resolve(data.intro.sourceDir, 'app', 'pages');
  if (!fs.existsSync(pageBasePath)) {
    fs.mkdirSync(pageBasePath, { recursive: true });
  }
  // 循环写入每一个页面文件mdx
  Object.keys(data.pages).forEach((uri) => {
    fs.writeFileSync(
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
