import React from 'react';

import type { AppProps } from "next/app";

import AuthProvider from './auth';
import ThemeProvider from './theme';
import I18NProvider from './i18n';
import LayoutProvider from './layout';

export default function ContextProvider(appProps: AppProps) {
  const { Component, pageProps } = (function providers(props: AppProps): Function {
    return (provider: Function): Function | AppProps => provider ? providers(provider(props)) : props;
  })(appProps)(LayoutProvider)(AuthProvider)(I18NProvider)(ThemeProvider)();
  return <Component {...pageProps} />;
}
