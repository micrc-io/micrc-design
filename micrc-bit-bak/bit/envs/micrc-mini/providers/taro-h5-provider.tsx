/**
 * taro h5 provider
 */
import React from 'react';

import Taro from '@tarojs/taro';
import { defineCustomElements, applyPolyfills } from '@tarojs/components/loader';

import '@tarojs/components/dist/taro-components/taro-components.css';

export const TaroH5Provider = ({ children }:any) => {
  applyPolyfills().then(() => {
    defineCustomElements(window);
  });
  Taro.initPxTransform({
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      828: 1.81 / 2,
    },
  });
  return (
    <>{children}</>
  );
};
