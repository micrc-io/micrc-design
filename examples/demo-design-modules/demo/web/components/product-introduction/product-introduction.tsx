/* eslint-disable react/no-unused-prop-types */
// 产品介绍
// 欢迎内容
import React from 'react';

import { Typography, Image } from 'antd';

import { localStore } from '@micrc/bit.runtimes.micrc-web';

import styles from './product-introduction.module.scss';

export type ProductIntroductionProps = {
  img?: string;
  productTitle?: string;
  productText?: string;
  width?: string;
  height?: string;
};

export function ProductIntroduction(props: ProductIntroductionProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = localStore({
    props,
    states: {},
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { bind, action } = store;

  return (
    <>
      <Typography.Title level={5}>
        {bind('props:///productTitle')}
      </Typography.Title>
      <Typography.Paragraph>
        {bind('props:///productText')}
      </Typography.Paragraph>
      <Image
        style={{ width: props?.width, height: props?.height }}
        src={bind('props:///img')}
      />
    </>
  );
}

ProductIntroduction.defaultProps = {
  img: 'https://s1.ax1x.com/2023/03/22/ppdAqyV.png',
  productTitle: 'Manage all your stores and online sales in one place.',
  productText: '',
  width: '500px',
  height: '400px',
};
