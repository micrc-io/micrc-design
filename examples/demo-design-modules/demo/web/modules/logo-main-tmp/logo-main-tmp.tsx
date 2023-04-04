// 模块
import React, { useState } from 'react';

import { ProductLogo } from '@micrc/demo.web.components.product-logo';
import { BlankLayout } from '@micrc/demo.web.components.blank-layout';

import { remoteStore, Authorized } from '@micrc/bit.runtimes.micrc-web';
import { useStore as module } from './state';

import ImgPngSource from './images/img.png';

// @ts-ignore
const ImgPng = ImgPngSource.src || ImgPngSource;

const permissions = [];

export type LogoMainTmpProps = {
  router?: any;
};

export function LogoMainTmp({ router }: LogoMainTmpProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = remoteStore(
    {
      module,
      states: {},
    },
    router,
    'micrc.demo/web/modules/logo-main-tmp',
  );
  const { bind, action } = store;

  const img = useState({ value: 'https://s1.ax1x.com/2023/03/23/ppwKdYT.png' });
  store.appendState({ img });

  return (
    <Authorized permissions={permissions}>
      <BlankLayout
        content={
          <>
            <ProductLogo img={bind('states@img:///value')} />
          </>
        }
      />
    </Authorized>
  );
}

LogoMainTmp.defaultProps = {
  router: null,
};
