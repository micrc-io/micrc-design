// 组件
// 注释
import React, { useState, ReactNode } from 'react';
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
import { useComponentStore as useStore } from '@micrc/bit.runtimes.micrc-web';

import styles from './layout.module.scss';

export type LayoutProps = {
  // children: ReactNode;
  input:any;
  table:any;
  card:any;

};

export function Layout(props: LayoutProps) {
  return (
    <>
      {Object.keys(props).map((item, i) => {
        return <div key={i}>{props[item]}</div>;
      })}
    </>
  );
}
