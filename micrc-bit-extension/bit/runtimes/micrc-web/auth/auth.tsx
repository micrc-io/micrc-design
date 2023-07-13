/**
 * Authorized组件, 用于模块鉴权
 */
import React, { ReactNode, useEffect, useState } from 'react';

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
  const [authorized, setAuthorized] = useState(false);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setAuthorized(hasPermission(permissions));
    setMount(true);
  }, []);

  const instead = display && mount ? <UnAuthorized /> : null;
  return authorized ? <>{children}</> : instead;
};

Authorized.defaultProps = {
  display: false,
};
