import React from 'react';

import { AppProps } from 'next/app';

// todo 处理布局。根据页面uri选择布局
const layout = ({Component, pageProps}: AppProps) => ({
  Component: (props: any) => (
    <div>
      <h1 className="text-3xl font-bold underline">布局</h1>
      <Component {...props} />
    </div>
  ),
  pageProps,
});

export default layout;
