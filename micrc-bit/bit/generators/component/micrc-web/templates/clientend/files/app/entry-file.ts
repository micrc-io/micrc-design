/**
 * pages/_app.ts
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import type { ClientendContextData } from '../../_parser';

const tmpl = `// 入口文件, 处理端口布局、global store初始化(i18n、tracker、integration)
import React from 'react';
import type { AppProps } from 'next/app';

import { MDXProvider } from '@mdx-js/react';

import { AdminGenericLayout, AdminGenericLayoutProps} from '@colibri-tech/system-design.base-ui.web.layout.admin-generic-layout';

import '../styles/antd-themes/default.less';
import '../styles/globals.css';

const Wrapper = (props: JSX.IntrinsicAttributes & AdminGenericLayoutProps) => (<AdminGenericLayout {...props} />);

export default function App({ Component, pageProps, ...props }: AppProps) {
  return (
    <MDXProvider components={{ wrapper: Wrapper }}>
      {/* @ts-ignore */}
      <Component {...pageProps} parentId={props.router.pathname} />
    </MDXProvider>
  );
}
`;

export function appEntryFile(data: ClientendContextData) {
  return prettier.format(
    HandleBars.compile(tmpl)(data),
    {
      parser: 'typescript',
      semi: true,
      singleQuote: true,
      bracketSameLine: false,
      singleAttributePerLine: true,
    },
  );
}
