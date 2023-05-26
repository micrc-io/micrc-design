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

import { initGlobalStore, Authorized } from '@micrc/bit.runtimes.micrc-web';

{{#each componentImports}}
import { {{@key}} } from '{{this}}';
{{/each}}

{{#each moduleImports}}
import { {{@key}} } from '{{this}}';
{{/each}}

import '../styles/antd-themes/default.less';
import '../styles/globals.css';

import permission from '../meta/permission.json';
import i18n from '../meta/i18n.json';
import I18ns from './meta/i18ns.json';
import tracker from '../meta/tracker.json';
import integration from '../meta/integration.json';

const permissions: Record<string, Array<string>> = permission;

const layouts: Record<string, {uris: Array<string>; layout: (props: any) => ReactNode }> = {
  {{#each layouts}}
  {{@key}}: { uris: {{{json this.uris}}}, layout:(props) => <{{@key}} {{{propsAssembler this.props}}} /> },
  {{/each}}
};

const Wrapper = (props: JSX.IntrinsicAttributes) => {
  const router = useRouter();
  let Layout = null;
  Object.keys(layouts).forEach((layout) => {
    if (layouts[layout].uris.includes(router.pathname)) {
      Layout = layouts[layout].layout(props);
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
  initGlobalStore(locale, i18n, I18ns, tracker, integration);
  return React.cloneElement(Layout, { ...props });
};

export default function App({ Component, pageProps }: AppProps) {
  const components = { wrapper: Wrapper };
  const router = useRouter();
  return (
    <MDXProvider components={ components }>
      <Authorized permissions={permissions[router.pathname]} display={true}>
        {/* @ts-ignore */}
        <Component {...pageProps} router={router} />
      </Authorized>
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
