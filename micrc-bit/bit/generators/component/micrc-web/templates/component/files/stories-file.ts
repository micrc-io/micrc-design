/**
 * test file
 */
import { ComponentContextData } from '../_parse';

export function storiesFile(data: ComponentContextData) {
  return `// ${data.context.name} stories
import React from 'react';
import { ${data.context.namePascalCase} } from './${data.context.name}';

export default {
  component: ${data.context.namePascalCase},
  title: '${data.context.componentId}',
};

const Template = () => <${data.context.namePascalCase} />;

export const Default = Template.bind({});
Default.args = {
  children: 'hello world! -- default',
};
`;
}
