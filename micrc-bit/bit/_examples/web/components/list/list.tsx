// 组件
// 注释
import React, { useState, ReactNode } from 'react';
import type { ColumnsType } from 'antd/es/table';

import { Table as AntTable } from 'antd';

import { useComponentStore as useStore } from '@micrc/bit.runtimes.micrc-web';

import styles from './list.module.scss';

export type ListProps = {
  columns: ColumnsType<DataType>;
  data: DataType[];
};

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

export function List(props: ListProps) {
  const columns = useState({ value: [] });
  const { bind, action } = useStore({
    props,
    states: {
      columns,
    },
  });

  return (
    <>
      <AntTable
        columns={bind('states@columns:///value')}
        dataSource={bind('props:///data')}
      />
    </>
  );
}
