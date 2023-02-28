// 组件
// 注释
import React, { useState, ReactNode } from 'react';
import type { ColumnsType } from 'antd/es/table';

import { Button, Card, Input } from 'antd';

import { useComponentStore as useStore } from '@micrc/bit.runtimes.micrc-web';

import styles from './card-test.module.scss';

export type CardTestProps = {
  title: string;
  style: any;
};

export function CardTest(props: CardTestProps) {
  const show = useState({ value: false });
  const message = useState({ value: 'initial value' });
  const { bind, action } = useStore({
    props,
    states: {
      show,
      message,
    },
  });

  return (
    <>
      <Card
        title="example card"
        style={{ width: 300 }}
        extra={<Button type="link">More</Button>}
      >
        <Input />
        <Button type="primary">{bind('states@message:///value')}</Button>
      </Card>
    </>
  );
}
