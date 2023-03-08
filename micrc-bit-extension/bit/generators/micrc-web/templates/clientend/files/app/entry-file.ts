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

import { initGlobalStore } from '@micrc/bit.runtimes.micrc-web';

{{#each componentImports}}
import { {{@key}} } from '{{this}}';
{{/each}}

{{#each moduleImports}}
import { {{@key}} } from '{{this}}';
{{/each}}

import '../styles/antd-themes/default.less';
import '../styles/globals.css';

import i18n from '../meta/i18n.json';
import tracker from '../meta/tracker.json';
import integration from '../meta/integration.json';

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
  const env = process.env.NEXT_PUBLIC_APP_ENV || process.env.APP_ENV;
  let locale = 'en_US';
  if (env && (env === 'default' || env === 'local')) {
    locale = 'zh_CN'; // todo 获取开发机系统语言
  }
  initGlobalStore(locale, i18n, integration, tracker);
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
