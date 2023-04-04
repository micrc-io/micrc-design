/* eslint-disable react/no-unused-prop-types */
// 空布局组件
import React from 'react';

import { localStore } from '@micrc/bit.runtimes.micrc-web';

import styles from './blank-layout.module.scss';

export type BlankLayoutProps = {
  content: any;
};

export function BlankLayout(props: BlankLayoutProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = localStore({
    props,
    states: {},
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { bind, action } = store;

  return (
    <>
      <>{props?.content}</>
    </>
  );
}

BlankLayout.defaultProps = {};
