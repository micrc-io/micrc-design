// 登陆认证模块
import React, { useState } from 'react';

import { FormAuthc } from '@colibri-tech/design.system.web.components.form-authc';
import { BlankLayout } from '@colibri-tech/design.system.web.components.blank-layout';

import { remoteStore, Authorized } from '@micrc/bit.runtimes.micrc-web';
import { useStore as module } from './state';

const permissions = [];

export type SystemAccountLoginProps = {
  router?: any;
};

export function SystemAccountLogin({ router }: SystemAccountLoginProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = remoteStore(
    {
      module,
      states: {},
    },
    router,
    'colibri-tech.security/security/web/modules/system-account-login',
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { bind, action, subscribe } = store;

  const changeUserNameAction = action({
    op: 'replace',
    path: 'module:///bslg000046/param/username',
  });
  const validateUserNameAction = action({
    op: 'verify',
    path: 'module:///bslg000046',
    value: 'username',
  });
  const changePassWordAction = action({
    op: 'replace',
    path: 'module:///bslg000046/param/password',
  });
  const validatePassWordAction = action({
    op: 'verify',
    path: 'module:///bslg000046',
    value: 'password',
  });
  const changeAuthCodeAction = action({
    op: 'replace',
    path: 'module:///bslg000046/param/authcode',
  });
  const validateAuthCodeAction = action({
    op: 'verify',
    path: 'module:///bslg000046',
    value: 'authcode',
  });
  const submitAction = action({
    op: 'perform',
    path: 'module:///bslg000046',
    value: null,
  });

  const username = useState({
    value: {
      label: bind('i18n:///username.label'),
      placeholder: bind('i18n:///username.placeholder'),
      message: '',
    },
  });
  store.appendState({ username });
  const password = useState({
    value: {
      label: bind('i18n:///password.label'),
      placeholder: bind('i18n:///password.placeholder'),
      message: '',
    },
  });
  store.appendState({ password });
  const authCode = useState({
    value: {
      label: bind('i18n:///authcode.label'),
      placeholder: bind('i18n:///authcode.placeholder'),
      message: '',
    },
  });
  store.appendState({ authCode });
  const btnName = useState({ value: bind('i18n:///btn.btnName') });
  store.appendState({ btnName });

  return (
    <Authorized permissions={permissions}>
      <BlankLayout
        content={
          <FormAuthc
            loading={bind('module:///bslg000046/pending')}
            userName={bind('states@username:///value')}
            passWord={bind('states@password:///value')}
            authCode={bind('states@authCode:///value')}
            changeUserName={(value: any) => {
              const actions = async () => {
                // await changeUserNameAction(
                //   {
                //     value,
                //   },
                //   '/value',
                // );
                await validateUserNameAction(
                  {
                    value,
                  },
                  '',
                );
              };
              actions();
            }}
            changePassWord={(value: any) => {
              const actions = async () => {
                await changePassWordAction(
                  {
                    value,
                  },
                  '/value',
                );
                await validatePassWordAction(
                  {
                    value,
                  },
                  '',
                );
              };
              actions();
            }}
            changeAuthCode={(value: any) => {
              const actions = async () => {
                await changeAuthCodeAction(
                  {
                    value,
                  },
                  '/value',
                );
                await validateAuthCodeAction(
                  {
                    value,
                  },
                  '',
                );
              };
              actions();
            }}
            submit={() => {
              const actions = async () => {
                await submitAction({}, '');
              };
              actions();
            }}
          />
        }
      />
    </Authorized>
  );
}

SystemAccountLogin.defaultProps = {
  router: null,
};
