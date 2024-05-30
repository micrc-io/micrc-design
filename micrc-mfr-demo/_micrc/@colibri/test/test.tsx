import React from 'react';

import useStyles from '../../../_micrc/hooks/useStyles';

import { Button, Pagination } from 'antd';

import styles from './test.module.scss';

export const Test = () => {
  useStyles(styles as any);
  return (
    <>
      <p className={styles.h1}>测试组件</p>
      <Button className={styles.btn}>测试Antd - 按钮</Button>
      <Pagination defaultCurrent={1} total={50} showSizeChanger />
    </>
  );
};
