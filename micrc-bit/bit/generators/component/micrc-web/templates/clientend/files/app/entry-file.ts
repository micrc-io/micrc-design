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
  const wrapper = Object.keys(layouts).filter((layout) => {
    if (layouts[layout].uris.includes(router.pathname)) {
      return layouts[layout].layout;
    }
  });
  if (wrapper.length !== 1) {
    throw Error(\`Current uri of page: \${router.pathname} has no layout. Check clientend and pages configuration.\`);
  }
  // @ts-ignore
  return <wrapper {...props} />;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider components={{ wrapper: Wrapper }}>
      {/* @ts-ignore */}
      <Component {...pageProps} />
    </MDXProvider>
  );
}
`;

export function appEntryFile(data: ClientendContextData) {
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
