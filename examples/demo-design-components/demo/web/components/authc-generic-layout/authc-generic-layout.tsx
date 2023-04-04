/* eslint-disable react/no-unused-prop-types */
// 登录认证
import React, { ReactElement } from 'react';

import { Layout, Space, Skeleton, Tooltip } from 'antd';

import { localStore } from '@micrc/bit.runtimes.micrc-web';

import styles from './authc-generic-layout.module.scss';

export type AuthcGenericLayoutProps = {
  logo?: ReactElement;
  productInfo?: ReactElement;
  language?: ReactElement;
  login?: ReactElement;
};

export function AuthcGenericLayout(props: AuthcGenericLayoutProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = localStore({
    props,
    states: {},
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { bind, action } = store;

  return (
    <>
      <Space
        direction="vertical"
        style={{ width: '100%' }}
      >
        <>
          <Layout>
            <>
              <Layout.Sider
                width={683}
                style={{
                  height: '900px',
                  background: '#3ba0e9',
                  padding: '44px',
                }}
              >
                <>
                  <Layout.Header
                    style={{
                      background: 'none',
                    }}
                    className={styles.logo}
                  >
                    {props?.logo}
                  </Layout.Header>
                  <Layout.Content className={styles.productInfo}>
                    {props?.productInfo}
                  </Layout.Content>
                </>
              </Layout.Sider>
              <Layout.Content
                style={{
                  width: '804px',
                  height: '900px',
                  background: '#FFFFFF',
                }}
              >
                <>
                  <Layout.Header className={styles.language}>
                    {props?.language}
                  </Layout.Header>
                  <Layout.Content>{props?.login}</Layout.Content>
                </>
              </Layout.Content>
            </>
          </Layout>
        </>
      </Space>
    </>
  );
}

AuthcGenericLayout.defaultProps = {
  logo: (
    <>
      <Tooltip title="logo：展示logo的位置">
        <>
          <Skeleton.Image style={{ width: '162px', height: '62px' }} />
        </>
      </Tooltip>
    </>
  ),
  productInfo: (
    <>
      <Tooltip title="productInfo：展示产品介绍">
        <>
          <Skeleton />
          <Skeleton.Image style={{ width: '518px', height: '504px' }} />
        </>
      </Tooltip>
    </>
  ),
  language: (
    <>
      <Tooltip title="language：展示多语言">
        <>
          <Skeleton.Input />
        </>
      </Tooltip>
    </>
  ),
  login: (
    <>
      <Tooltip title="login：登录">
        <>
          <Layout.Content className={styles.login} />
        </>
      </Tooltip>
    </>
  ),
};
