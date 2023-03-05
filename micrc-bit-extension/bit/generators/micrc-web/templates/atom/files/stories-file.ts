/*
 * @Author: wuwanping
 * @Date: 2023-02-23 20:58:08
 * @LastEditTime: 2023-02-24 09:46:26
 * @LastEditors: wuwanping
 * @Description: 
 * @FilePath: /micrc-bit/bit/generators/component/micrc-web/templates/module/files/stories-file.ts
 */

import { AtomContextData } from '../_parse';

export function storiesFile(data: AtomContextData) {

    return `// 必须这样写注释
      import React from 'react';
      import { ${data.context.namePascalCase}, ${data.context.namePascalCase}Props } from './${data.context.name}';
      export default {
        component:${data.context.namePascalCase},
        title:'micrc.bit/${data.context.name}/${data.context.namePascalCase}'
      };
      const Template = (props:${data.context.namePascalCase}Props) => <${data.context.namePascalCase} {...props} />;
  
      export const Basic = Template.bind({});
      Basic.args = {
        text: 'hello world! -- basic'
      };
    `;
  }