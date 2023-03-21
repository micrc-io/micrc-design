/**
 * Authorized组件, 用于模块鉴权
 */
import React, { ReactNode } from 'react';

import { Result } from 'antd';

import { hasPermission } from '../lib/auth';

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
  const authorized = hasPermission(permissions);
  const instead = display ? <UnAuthorized /> : null;
  return authorized ? <>{children}</> : instead;
};

Authorized.defaultProps = {
  display: false,
};
