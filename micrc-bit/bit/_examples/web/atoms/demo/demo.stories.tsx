// 必须这样写注释
      import React from 'react';
      import { Demo, DemoProps } from './demo';
      export default {
        component:Demo,
        title:'micrc.bit/demo/Demo'
      };
      const Template = (props:DemoProps) => <Demo {...props} />;
  
      export const Basic = Template.bind({});
      Basic.args = {
        text: 'hello world! -- basic'
      };
    