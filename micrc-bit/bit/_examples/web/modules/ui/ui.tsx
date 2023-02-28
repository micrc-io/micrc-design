// 组件
// 注释
import React, { useState, ReactNode } from 'react';
import type { ColumnsType } from 'antd/es/table';

import { Layout } from '@micrc/bit._examples.web.components.layout';
import { InputTest } from '@micrc/bit._examples.web.components.input-test';
import { List } from '@micrc/bit._examples.web.components.List';
import { CardTest } from '@micrc/bit._examples.web.components.card-test';

import { useModuleStore as useStore } from '@micrc/bit.runtimes.micrc-web';
import { useGlobalStore as global } from '@micrc/bit.runtimes.micrc-web/store/global';

import styles from './ui.module.scss';

export type UiProps = {};

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

export function Ui(props: UiProps) {
  const show = useState({ value: false });
  const message = useState({ value: 'initial value' });
  const columns = useState({ value: [] });
  const { bind, action } = useStore({
    global,
    module,
    states: {
      show,
      message,
      columns,
    },
  });

  return (
    <Layout
      input={<InputTest />}
      table={(
        <List
          data={bind('props:///data')}
          columns={bind('states@columns:///value')}
        />
      )}
      card={(
        <CardTest
          title="example card"
          style={{ width: 300 }}
        />
      )}
    />
  );
}
