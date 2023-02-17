/**
 * 组件入口文件模版
 */
import { ComponentContext } from '@teambit/generator';

export function compositionFile(context: ComponentContext) {
  return `// 必须这样写注释
import React from 'react';

import { Basic } from './${context.name}.stories';

export const Basic${context.namePascalCase} = () => <Basic {...Basic.args} />;
`;
}
