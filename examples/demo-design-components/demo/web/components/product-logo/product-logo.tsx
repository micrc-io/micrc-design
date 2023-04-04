/* eslint-disable react/no-unused-prop-types */
// 产品logo
import React from 'react';

import { Image } from 'antd';

import { localStore } from '@micrc/bit.runtimes.micrc-web';

import styles from './product-logo.module.scss';

export type ProductLogoProps = {
  img?: string;
};

export function ProductLogo(props: ProductLogoProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = localStore({
    props,
    states: {},
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { bind, action } = store;

  return (
    <>
      <Image
        width={125}
        height={48}
        src={bind('props:///img')}
      />
    </>
  );
}

ProductLogo.defaultProps = {
  img: 'https://s1.ax1x.com/2023/03/23/ppwKdYT.png',
};
