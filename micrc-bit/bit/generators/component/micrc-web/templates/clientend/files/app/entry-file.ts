/**
 * pages/_app.ts
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import type { ClientendContextData } from '../../_parser';

const tmpl = `// 入口文件, 处理端口布局、global store初始化(i18n、tracker、integration)
import React, { ReactNode } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { MDXProvider } from '@mdx-js/react';

{{#each componentImports}}
import { {{@key}} } from '{{this}}';
{{/each}}

{{#each moduleImports}}
import { {{@key}} } from '{{this}}';
{{/each}}

import '../styles/antd-themes/default.less';
import '../styles/globals.css';

const layouts: Record<string, { uris: Array<string>, layout: ReactNode }> = {
  {{#each layouts}}
  {{@key}}: { uris: {{this.uris}}, layout: {{@key}} }
  {{/each}}
};

const Wrapper = (props: JSX.IntrinsicAttributes) => {
  const router = useRouter();
  let Layout;
  Object.keys(layouts).forEach((layout) => {
    if (layouts[layout].uris.includes(router.pathname)) {
      Layout = layouts[layout].layout;
    }
  });
  return (
    // @ts-ignore
    <Layout
      {{{propsAssembler props}}}
      {...props}
    />
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider components={{ wrapper: Wrapper }}>
      {/* @ts-ignore */}
      <Component {...pageProps} router={useRouter()} />
    </MDXProvider>
  );
}
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

export function appEntryFile(data: ClientendContextData) {
  HandleBars.registerHelper('propsAssembler', (context) => propsAssembler(context));
  return prettier.format(
    HandleBars.compile(tmpl)(data.entry),
    {
      parser: 'typescript',
      semi: true,
      singleQuote: true,
      bracketSameLine: false,
      singleAttributePerLine: true,
    },
  );
}
