/**
 * pages/_app.ts
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { propsAssembler, jsonObject } from '../../../../lib/assembler';

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
  {{@key}}: { uris: {{{json this.uris}}}, layout: <{{@key}} {{{propsAssembler this.props}}} /> },
  {{/each}}
};

const Wrapper = (props: JSX.IntrinsicAttributes) => {
  const router = useRouter();
  let Layout = null;
  Object.keys(layouts).forEach((layout) => {
    if (layouts[layout].uris.includes(router.pathname)) {
      Layout = layouts[layout].layout;
    }
  });
  if (!Layout) {
    throw Error(\`unhandled clientends layout for page: \${router.pathname}\`);
  }
  return React.cloneElement(Layout, { ...props });
};

export default function App({ Component, pageProps }: AppProps) {
  const components = { wrapper: Wrapper };
  return (
    <MDXProvider components={ components }>
      {/* @ts-ignore */}
      <Component {...pageProps} router={useRouter()} />
    </MDXProvider>
  );
}
`;

export function appEntryFile(data: ClientendContextData) {
  HandleBars.registerHelper('propsAssembler', (context) => propsAssembler(context));
  HandleBars.registerHelper('json', (context) => jsonObject(context));

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
