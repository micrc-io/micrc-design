// 必须这样写注释
      import React from 'react';
      import { Layout, LayoutProps } from './layout';
      export default {
        component:Layout,
        title:'micrc.bit/layout/Layout'
      };
      const Template = (props:LayoutProps) => <Layout {...props} />;
  
      export const Basic = Template.bind({});
      Basic.args = {
        text: 'hello world! -- basic'
      };
    