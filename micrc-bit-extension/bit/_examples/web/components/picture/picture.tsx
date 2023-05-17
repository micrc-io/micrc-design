/* eslint-disable react/no-unused-prop-types */
// 产品logo
import React from 'react';

import { Image } from 'antd';

import {
  localStore,
  I18NVisibleProxy,
  I18NHighlight,
  i18nHightLight,
} from '@micrc/bit.runtimes.micrc-web';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './picture.module.scss';

import ImgPngSource from './images/img.png';

// @ts-ignore
const ImgPng = ImgPngSource.src || ImgPngSource;

export type PictureProps = {
  img?: string;
};

export function Picture(props: PictureProps) {
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
        src={bind('props:///img')}
        preview={false}
      />
    </>
  );
}

Picture.defaultProps = {
  img: ImgPng,
};
