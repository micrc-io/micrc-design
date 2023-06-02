// 登陆认证模块
import React, { useState, useEffect } from 'react';

import { FormAuthc } from '@colibri-tech/design.system.web.components.form-authc';
import { BlankLayout } from '@colibri-tech/design.system.web.components.blank-layout';

import { remoteStore, Authorized } from '@micrc/bit.runtimes.micrc-web';
import { useStore as module } from './state';

const permissions = [];

export type SystemAccountLoginProps = {
  router?: any;
  fix?: any;
};

export function SystemAccountLogin({ router, fix }: SystemAccountLoginProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = remoteStore(
    {
      module,
      states: {},
    },
    router,
    'colibri-tech.examples/examples/web/modules/system-account-login',
    fix,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { bind, action, subscribe } = store;

  const changeUserNameAction = action({
    op: 'replace',
    path: 'module:///bslg000046/param/username/username',
  });
  const validateUserNameAction = action({
    op: 'verify',
    path: 'module:///bslg000046',
    value: null,
  });
  const changePassWordAction = action({
    op: 'replace',
    path: 'module:///bslg000046/param/password/password',
  });
  const validatePassWordAction = action({
    op: 'verify',
    path: 'module:///bslg000046',
    value: null,
  });
  const changeAuthCodeAction = action({
    op: 'replace',
    path: 'module:///bslg000046/param/authCode/authCode',
  });
  const validateAuthCodeAction = action({
    op: 'verify',
    path: 'module:///bslg000046',
    value: null,
  });
  const updateAuthCodeAction = action({
    op: 'perform',
    path: 'module:///inve000019',
    value: null,
  });
  const submitAction = action({
    op: 'perform',
    path: 'module:///bslg000046',
    value: null,
  });
  const routerAction = action({ op: 'integrate', path: '/route', value: '/' });
  const updatePermissionsAction = action({
    op: 'replace',
    path: 'global:///subject/permissions',
    value: 'module:///bslg000046/result/data/permissions',
  });
  const updateIdAction = action({
    op: 'replace',
    path: 'global:///subject/id',
    value: 'module:///bslg000046/result/data/id/id',
  });
  const updateAuthCodeKeyAction = action({
    op: 'replace',
    path: 'module:///bslg000046/param/identity/identity',
    value: 'module:///inve000019/result/data/identity',
  });

  const userName = useState({
    value: {
      label: bind('i18n:///username.label'),
      placeholder: bind('i18n:///username.placeholder'),
    },
  });
  store.appendState({ userName });
  const passWord = useState({
    value: {
      label: bind('i18n:///password.label'),
      placeholder: bind('i18n:///password.placeholder'),
    },
  });
  store.appendState({ passWord });
  const authCode = useState({
    value: {
      label: bind('i18n:///authcode.label'),
      placeholder: bind('i18n:///authcode.placeholder'),
    },
  });
  store.appendState({ authCode });
  const btnName = useState({ value: bind('i18n:///login.btn') });
  store.appendState({ btnName });

  useEffect(() => {
    const mount = async () => {
      await updateAuthCodeAction();
      await updateAuthCodeKeyAction();
    };
    mount();
  }, []);

  return (
    <Authorized permissions={permissions}>
      <BlankLayout
        content={
          <FormAuthc
            loading={bind('module:///bslg000046/pending')}
            btnName={bind('states@btnName:///value')}
            userName={bind('states@userName:///value')}
            passWord={bind('states@passWord:///value')}
            authCode={bind('states@authCode:///value')}
            userNameMsg={bind(
              'invalid:///bslg000046/invalid/err/username/username/pattern/msg',
            )}
            passWordMsg={bind(
              'invalid:///bslg000046/invalid/err/password/password/pattern/msg',
            )}
            authCodeMsg={bind(
              'invalid:///bslg000046/invalid/err/authCode/authCode/pattern/msg',
            )}
            userNameStatus={bind(
              'invalid:///bslg000046/invalid/err/username/username/pattern/status',
            )}
            passWordStatus={bind(
              'invalid:///bslg000046/invalid/err/password/password/pattern/status',
            )}
            authCodeStatus={bind(
              'invalid:///bslg000046/invalid/err/authCode/authCode/pattern/status',
            )}
            authCodeImg={bind('module:///inve000019/result/data/imageString')}
            changeUserName={(value: any) => {
              const actions = async () => {
                await changeUserNameAction(
                  {
                    value,
                  },
                  '/value',
                );
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
            changeAuthCodeImg={() => {
              const actions = async () => {
                await updateAuthCodeAction({}, '');
                await updateAuthCodeKeyAction({}, '');
              };
              actions();
            }}
            submit={() => {
              const actions = async () => {
                await submitAction({}, '');
                await updatePermissionsAction({}, '');
                await updateIdAction({}, '');
                await routerAction({}, '');
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
  fix: null,
};
