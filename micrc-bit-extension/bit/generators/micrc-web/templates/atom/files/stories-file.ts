/**
 * stories file
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
Basic.parameters = {
  micrc: {
    type: 'web',
    // eslint-disable-next-line global-require
    locale: require('antd/locale/zh_CN').default,
  },
};
  `;
}
