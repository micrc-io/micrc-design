/**
 * pages/_app.ts
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';
import { propsAssembler } from '../../../assembler';

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
  {{@key}}: { uris: "uris", layout: {{@key}} },
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
      {{{propsAssembler layouts.props}}}
      {...props}
    />
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider components=\\{{ wrapper: Wrapper }}>
      {/* @ts-ignore */}
      <Component {...pageProps} router={useRouter()} />
    </MDXProvider>
  );
}
`;

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
