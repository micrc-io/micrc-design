import React from 'react';

import type { NextPageContext } from 'next';

import Comp from '@/unites/comp';

export default function Index() {
  // 各子域自行维护微端口元数据，包括其布局，对业务单元更直观的表达和预览(主题、国际化)
  return (
    <>
      <h1>Page Index</h1>
      <Comp />
    </>
  );
}

Index.getInitialProps = async (_ctx: NextPageContext) => ({_dummy: ''});
