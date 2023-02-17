/**
 * micrc mini component template
 */
import { ComponentTemplate, ComponentContext } from '@teambit/generator';

import { indexFile } from './files/index-file';
import { componentFile } from './files/component-file';
import { scssFile } from './files/scss-file';
import { docsFile } from './files/docs-file';
import { compositionFile } from './files/composition-file';

export const componentTemplate: ComponentTemplate = {
  name: 'micrc-web-component',
  description: 'test for micrc web',
  generateFiles: (context: ComponentContext) => {
    // todo 读取元数据文件，自动生成mini通用组件
    console.log('todo: 读取元数据文件，自动生成mini通用组件');
    return [
      // index file
      {
        relativePath: 'index.ts',
        isMain: true,
        content: indexFile(context),
      },
      // component file
      {
        relativePath: `${context.name}.tsx`,
        content: componentFile(context),
      },
      // scss file
      {
        relativePath: `${context.name}.module.scss`,
        content: scssFile(),
      },
      // docs file
      {
        relativePath: `${context.name}.docs.mdx`,
        content: docsFile(context),
      },
      // composition file
      {
        relativePath: `${context.name}.composition.tsx`,
        content: compositionFile(context),
      },
      // stories file
      {
        relativePath: `${context.name}.stories.tsx`,
        content:
`// 必须这样写注释
import React from 'react';

import { ${context.namePascalCase}, ${context.namePascalCase}Props } from './${context.name}';

export default {
component: ${context.namePascalCase},
title: '${context.componentId}/${context.namePascalCase}'
};

const Template = (props:${context.namePascalCase}Props) => <${context.namePascalCase} {...props} />;

export const Basic = Template.bind({});
Basic.args = {
text: 'hello world! -- basic'
};
`,
      },
    ];
  },
};
