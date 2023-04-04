// 模块
import React, { useState } from 'react';

import { ProductLogo } from '@micrc/demo.web.components.product-logo';
import { BlankLayout } from '@micrc/demo.web.components.blank-layout';

import { remoteStore, Authorized } from '@micrc/bit.runtimes.micrc-web';
import { useStore as module } from './state';

import LogoPngSource from './images/logo.png';

// @ts-ignore
const LogoPng = LogoPngSource.src || LogoPngSource;

const permissions = [];

export type LogoMainProps = {
  router?: any;
};

export function LogoMain({ router }: LogoMainProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = remoteStore(
    {
      module,
      states: {},
    },
    router,
    'micrc.demo/web/modules/logo-main',
  );
  const { bind, action } = store;

  return (
    <Authorized permissions={permissions}>
      <BlankLayout
        content={
          <>
            <ProductLogo img={LogoPng} />
          </>
        }
      />
    </Authorized>
  );
}

LogoMain.defaultProps = {
  router: null,
};
