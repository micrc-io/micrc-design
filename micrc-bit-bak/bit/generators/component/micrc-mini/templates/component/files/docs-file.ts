/**
 * 组件入口文件模版
 */
import { ComponentContext } from '@teambit/generator';

export function docsFile(context: ComponentContext) {
  return `
  ---
description: 'A React Component for rendering text.'
labels: ['text', 'ui']
---

import 'taro-ui/dist/style/index.scss';
import { ${context.namePascalCase} } from './${context.name}';
`;
}
