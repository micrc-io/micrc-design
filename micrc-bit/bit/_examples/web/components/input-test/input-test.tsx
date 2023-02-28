// 组件
// 注释
import React, { useState, ReactNode } from 'react';

import { Button, Input, Form } from 'antd';

import { useComponentStore as useStore } from '@micrc/bit.runtimes.micrc-web';

import styles from './input-test.module.scss';

export type InputTestProps = {};

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

export function InputTest(props: InputTestProps) {
  const label = useState({ value: '店铺名称' });
  const placeholder = useState({ value: '请输入店铺名称' });
  const { bind, action } = useStore({
    props,
    states: {
      label,
      placeholder,
    },
  });

  return (
    <>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        autoComplete="off"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, display: 'flex' }}
      >
        <Form.Item label={bind('states@label:///value')}>
          <Input placeholder={bind('states@placeholder:///value')} />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
        >
          搜索
        </Button>
      </Form>
    </>
  );
}
