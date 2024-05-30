import React from 'react';

import type { NextPageContext } from 'next';

import { Button, Pagination } from 'antd';

import Comp from '@/unites/comp';

export default function Index() {
  return (
    <>
      <Pagination defaultCurrent={4} total={50} showSizeChanger />
      <Button>aaaa</Button>
      <Comp />
    </>
  );
}

Index.getInitialProps = async (_ctx: NextPageContext) => ({_dummy: ''});
