/* eslint-disable react/no-unused-prop-types */
// 产品logo
import React from 'react';

import { Image } from 'antd';

import { localStore } from '@micrc/bit.runtimes.micrc-web';

import styles from './product-logo1.module.scss';

import LogoPngSource from './images/logo.png';

// @ts-ignore
const LogoPng = LogoPngSource.src || LogoPngSource;

export type ProductLogo1Props = {
  img?: string;
};

export function ProductLogo1(props: ProductLogo1Props) {
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

ProductLogo1.defaultProps = {
  img: LogoPng,
};
