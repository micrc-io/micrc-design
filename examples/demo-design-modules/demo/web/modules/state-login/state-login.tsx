// 模块
// 注释
import React, { useState } from 'react';

import { LoginTest } from '@micrc/demo.web.components.login-test';
import { BlankLayout } from '@micrc/demo.web.components.blank-layout';

import { remoteStore, Authorized } from '@micrc/bit.runtimes.micrc-web';
import { useStore as module } from './state';

const permissions = [];

export type StateLoginProps = {
  router?: any;
};

export function StateLogin({ router }: StateLoginProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = remoteStore(
    {
      module,
      states: {},
    },
    router,
    'micrc.demo/web/modules/state-login',
  );
  const { bind, action } = store;

  const changeUserNameAction = action({
    op: 'replace',
    path: 'module:///register_post/param/username',
  });
  const validateUserNameAction = action({
    op: 'verify',
    path: 'module:///register_post',
    value: 'username',
  });
  const changePassWordAction = action({
    op: 'replace',
    path: 'module:///register_post/param/password',
  });
  const validatePassWordAction = action({
    op: 'verify',
    path: 'module:///register_post',
    value: 'password',
  });
  const changeRepeatPasswordAction = action({
    op: 'replace',
    path: 'module:///register_post/param/repeatPassword',
  });
  const validateRepeatPasswordAction = action({
    op: 'verify',
    path: 'module:///register_post',
    value: 'repeatPassword',
  });
  const openLoadingAction = action({
    op: 'replace',
    path: 'module:///register_post/pending',
    value: true,
  });
  const submitAction = action({
    op: 'perform',
    path: 'module:///register_post',
    value: null,
  });
  const closeLoadingAction = action({
    op: 'replace',
    path: 'module:///register_post/pending',
    value: false,
  });

  const userName = useState({
    value: {
      label: bind('i18n:///userName.label'),
      placeholder: bind('i18n:///userName.placeholder'),
    },
  });
  store.appendState({ userName });
  const passWord = useState({
    value: {
      label: bind('i18n:///passWord.label'),
      placeholder: bind('i18n:///passWord.placeholder'),
    },
  });
  store.appendState({ passWord });
  const repeatPassword = useState({
    value: {
      label: bind('i18n:///repeatPassword.label'),
      placeholder: bind('i18n:///repeatPassword.placeholder'),
    },
  });
  store.appendState({ repeatPassword });
  const btnName = useState({ value: bind('i18n:///btn.btnName') });
  store.appendState({ btnName });

  return (
    <Authorized permissions={permissions}>
      <BlankLayout
        content={
          <>
            <LoginTest
              loading={bind('module:///register_post/pending')}
              userName={bind('states@userName:///value')}
              passWord={bind('states@passWord:///value')}
              repeatPassword={bind('states@repeatPassword:///value')}
              result={bind('module:///register_post/invalid/err')}
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
              changeRepeatPassword={(value: any) => {
                const actions = async () => {
                  await changeRepeatPasswordAction(
                    {
                      value,
                    },
                    '/value',
                  );
                  await validateRepeatPasswordAction(
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
                  await openLoadingAction({}, '');
                  await submitAction({}, '');
                  await closeLoadingAction({}, '');
                };
                actions();
              }}
            />
          </>
        }
      />
    </Authorized>
  );
}

StateLogin.defaultProps = {
  router: null,
};
