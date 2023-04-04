/* eslint-disable react/no-unused-prop-types */
// 空布局居中组件
import React, { ReactElement } from 'react';

import { Layout } from 'antd';

import { localStore } from '@micrc/bit.runtimes.micrc-web';

import styles from './center-layout.module.scss';

export type CenterLayoutProps = {
  content: ReactElement;
};

export function CenterLayout(props: CenterLayoutProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = localStore({
    props,
    states: {},
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { bind, action } = store;

  return (
    <>
      <>
        <>
          <Layout.Content className={styles.content}>
            {props?.content}
          </Layout.Content>
        </>
      </>
    </>
  );
}

CenterLayout.defaultProps = {

};
