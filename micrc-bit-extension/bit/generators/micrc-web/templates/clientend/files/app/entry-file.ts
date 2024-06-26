/**
 * pages/_app.ts
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { propsAssembler, jsonObject } from '../../../../lib/assembler';

import type { ClientendContextData } from '../../_parser';

const tmpl = `// 入口文件, 处理端口布局、global store初始化(i18n、tracker、integration)
import React, { ReactNode, useEffect } from 'react';
import App from 'next/app';
import type { AppProps } from 'next/app';
import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import { MDXProvider } from '@mdx-js/react';

import { useGlobalStore, initGlobalStore, Authorized } from '@micrc/bit.runtimes.micrc-web';

{{#each entry.componentImports}}
import { {{@key}} } from '{{this}}';
{{/each}}

{{#each entry.moduleImports}}
import { {{@key}} } from '{{this}}';
{{/each}}

import '../styles/antd-themes/default.less';
import '../styles/globals.css';

import permission from '../meta/permission.json';
import i18n from '../meta/i18n.json';
import i18ns from '../meta/i18ns.json';
import tracker from '../meta/tracker.json';
import integration from '../meta/integration.json';

const permissions: Record<string, Array<string>> = permission;

const env = process.env.NEXT_PUBLIC_APP_ENV || process.env.APP_ENV;
let locale = 'en_US';
initGlobalStore(locale, '{{intro.clientend}}', i18n, i18ns, tracker, integration);

const layouts: Record<string, {uris: Array<string>; layout: (props: any) => ReactNode }> = {
  {{#each entry.layouts}}
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
  return React.cloneElement(Layout, { ...props });
};

const redirectAuthcRouter = async (router: NextRouter) => {
  if (typeof window !== 'undefined') {
    const redirectUri = router.pathname;
    const appEnv = process.env.NEXT_PUBLIC_APP_ENV;
    if (redirectUri === '/') {
      const layoutData = Object.values(layouts);
      if (layoutData.length <= 0) {
        throw Error('at least one layout for redirect from "/". ');
      }
      const uris = layoutData[0].uris;
      if (uris.length <= 0) {
        throw Error('at least one page for redirect from "/". ');
      }
      if (appEnv === 'default' || appEnv === 'local') {
        window.location.replace(uris[0]);
      } else {
        await router.push(uris[0]);
      }
      return;
    }
    const global: any = useGlobalStore.getState();
    const loginUri = process.env.NEXT_PUBLIC_LOGIN_PAGE_URI || '/security/authc';
    if (!global.subject.id && router && redirectUri !== loginUri) {
      if (appEnv === 'default' || appEnv === 'local') {
        window.location.replace(\`\${loginUri}?redirectUri=\${redirectUri}\`);
      } else {
        await router.push(\`\${loginUri}?redirectUri=\${redirectUri}\`);
      }
    }
  }
};

export default function MicrcApp({ Component, pageProps }: AppProps) {
  const components = { wrapper: Wrapper };
  const router = useRouter();
  useEffect(() => {
    const redirect = async () => {
      await redirectAuthcRouter(router);
    };
    redirect();
  });

  return (
    <MDXProvider components={ components }>
      <Authorized
        permissions={permissions[router.pathname]}
        display={true}
      >
        {/* @ts-ignore */}
        <Component {...pageProps} router={router} />
      </Authorized>
    </MDXProvider>
  );
}

MicrcApp.getInitialProps = async (context: any) => {
  const props = await App.getInitialProps(context);
  return { ...props };
}
`;

export function appEntryFile(data: ClientendContextData) {
  HandleBars.registerHelper('propsAssembler', (context) => propsAssembler(context));
  HandleBars.registerHelper('json', (context) => jsonObject(context));

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
