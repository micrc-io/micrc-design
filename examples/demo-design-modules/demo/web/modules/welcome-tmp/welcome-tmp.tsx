// 欢迎模块
import React, { useState } from 'react';

import { ProductIntroduction } from '@micrc/demo.web.components.product-introduction';
import { BlankLayout } from '@micrc/demo.web.components.blank-layout';

import { remoteStore, Authorized } from '@micrc/bit.runtimes.micrc-web';
import { useStore as module } from './state';

import WelcomePngSource from './images/welcome.png';

// @ts-ignore
const WelcomePng = WelcomePngSource.src || WelcomePngSource;

const permissions = [];

export type WelcomeTmpProps = {
  router?: any;
};

export function WelcomeTmp({ router }: WelcomeTmpProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = remoteStore(
    {
      module,
      states: {},
    },
    router,
    'micrc.demo/web/modules/welcome-tmp',
  );
  const { bind, action } = store;

  const welcomeText = useState({ value: bind('i18n:///welcome.text') });
  store.appendState({ welcomeText });

  return (
    <Authorized permissions={permissions}>
      <BlankLayout
        content={
          <>
            <ProductIntroduction
              productTitle={bind('states@welcomeText:///value')}
              img={WelcomePng}
              width="727px"
              height="403px"
            />
          </>
        }
      />
    </Authorized>
  );
}

WelcomeTmp.defaultProps = {
  router: null,
};
