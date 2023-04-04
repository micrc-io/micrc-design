// 入口文件, 处理端口布局、global store初始化(i18n、tracker、integration)
import React, { ReactNode } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { MDXProvider } from '@mdx-js/react';

import { initGlobalStore, Authorized, useGlobalStore } from '@micrc/bit.runtimes.micrc-web';

import { AuthcGenericLayout } from '@micrc/demo.web.components.authc-generic-layout';
import { AdminGenericLayout } from '@micrc/demo.web.components.admin-generic-layout';

import { LogoLogin } from '@micrc/demo.web.modules.logo-login';
import { ProductInfo } from '@micrc/demo.web.modules.product-info';
import { LogoMain } from '@micrc/demo.web.modules.logo-main';

import '../styles/antd-themes/default.less';
import '../styles/globals.css';

import permission from '../meta/permission.json';
import i18n from '../meta/i18n.json';
import tracker from '../meta/tracker.json';
import integration from '../meta/integration.json';

const permissions: Record<string, Array<string>> = permission;

const layouts: Record<string, { uris: Array<string>; layout: (props: any) => ReactNode }> = {
  AuthcGenericLayout: {
    uris: ['/security/authc'],
    layout: (props) => (
      <AuthcGenericLayout
        logo={
          <>
            <LogoLogin />
          </>
        }
        productInfo={
          <>
            <ProductInfo router={{}} />
          </>
        }
        login={props.children}
      />
    ),
  },
  AdminGenericLayout: {
    uris: ['/'],
    layout: (props: any) => (
      <AdminGenericLayout
        logo={
          <>
            <LogoMain router={{}}  />
          </>
        }
        page={props.children}
      />
    ),
  },
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
    throw Error(`unhandled clientends layout for page: ${router.pathname}`);
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
  const router = useRouter();
  const t = useGlobalStore((state: any) => state.i18n);
  return (
    <MDXProvider components={components}>
      <Authorized
        permissions={permissions[router.pathname]}
        display={true}
      >
        {/* <pre>
          <code>{JSON.stringify(t, null, 2)}</code>
        </pre> */}
        {/* @ts-ignore */}
        <Component
          {...pageProps}
          router={router}
        />
      </Authorized>
    </MDXProvider>
  );
}
