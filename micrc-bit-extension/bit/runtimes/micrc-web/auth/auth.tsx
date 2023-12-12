/**
 * Authorized组件, 用于模块鉴权
 */
import React, { ReactNode, useEffect, useState } from 'react';
import { ConfigProvider, Result } from 'antd';
import en_US from 'antd/locale/en_US';
import zh_CN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

import { hasPermission } from '../lib/auth';
import { useGlobalStore } from '../store/global';

type AuthorizedProps = {
  permissions: Array<string>,
  children: ReactNode,
  display?: boolean,
};

const UnAuthorized = () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
  />
);

export const Authorized = ({ permissions, children, display }: AuthorizedProps) => {
  const [authorized, setAuthorized] = useState(false);
  const [locale, setLocal] = useState(en_US);
  const [mount, setMount] = useState(false);
  const state: any = useGlobalStore.getState();

  useEffect(() => {
    setAuthorized(hasPermission(permissions));
    setMount(true);
  }, []);

  useEffect(() => {
    if (state?.i18n?.locale === 'en_US') setLocal(en_US);
    if (state?.i18n?.locale === 'zh_CN') setLocal(zh_CN);
  }, [state?.i18n?.locale]);

  const instead = display && mount ? <UnAuthorized /> : null;
  return <ConfigProvider locale={locale}>{authorized ? children : instead}</ConfigProvider>;
};

Authorized.defaultProps = {
  display: false,
};
