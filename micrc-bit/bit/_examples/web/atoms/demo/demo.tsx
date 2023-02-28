// 组件
// 注释
import React, { useState, ReactNode } from 'react';

import { Button, Card } from 'antd';
import { useComponentStore as useStore } from '@micrc/bit.runtimes.micrc-web';

import styles from './demo.module.scss';

export type DemoProps = { children: ReactNode };

export function Demo(props: DemoProps) {
  const show = useState({ value: false });
  const message = useState({ value: 'initial value' });
  const { bind, action } = useStore({ props, states: { show, message } });

  return (
    <>
      <Button
        onClick={() =>
          action([
            {
              op: 'replace',
              path: 'states@show:///value',
              value: !bind('states@show:///value'),
            },
          ])()
        }
        type="dashed"
      >
        修改State
      </Button>
      {bind('states@show:///value') ? (
        <Card
          title="example card"
          style={{ width: 300 }}
          extra={<Button type="link">More</Button>}
        />
      ) : (
        <Button type="primary">{bind('states@message:///value')}</Button>
      )}
    </>
  );
}
