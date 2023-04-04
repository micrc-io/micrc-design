// 模块
import React, { useState } from 'react';

import { ProductIntroduction } from '@micrc/demo.web.components.product-introduction';
import { BlankLayout } from '@micrc/demo.web.components.blank-layout';

import { remoteStore, Authorized } from '@micrc/bit.runtimes.micrc-web';
import { useStore as module } from './state';

import LogoPngSource from './images/logo.png';

// @ts-ignore
const LogoPng = LogoPngSource.src || LogoPngSource;

const permissions = [];

export type ProductInfoProps = {
  router?: any;
};

export function ProductInfo({ router }: ProductInfoProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = remoteStore(
    {
      module,
      states: {},
    },
    router,
    'micrc.demo/web/modules/product-info',
  );
  const { bind, action } = store;

  const productTitle = useState({ value: bind('i18n:///product.title') });
  store.appendState({ productTitle });
  const productText = useState({ value: bind('i18n:///product.text') });
  store.appendState({ productText });

  return (
    <Authorized permissions={permissions}>
      <BlankLayout
        content={
          <>
            <ProductIntroduction
              productTitle={bind('states@productTitle:///value')}
              productText={bind('states@productText:///value')}
              img={LogoPng}
              width="518px"
              height="504px"
            />
          </>
        }
      />
    </Authorized>
  );
}

ProductInfo.defaultProps = {
  router: null,
};
