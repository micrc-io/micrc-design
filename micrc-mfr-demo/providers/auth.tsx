import React from 'react';

import type { AppProps } from 'next/app';

// auth provider
// todo 处理鉴权跳转或403

const auth = ({Component, pageProps}: AppProps) => ({
  Component: (props: any) => {
    return <Component {...props} />;
  },
  pageProps,
});

export default auth;

