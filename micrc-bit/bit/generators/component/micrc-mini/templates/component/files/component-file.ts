/**
 * 组件主文件模版
 */
import { ComponentContext } from '@teambit/generator';

export function componentFile(context: ComponentContext) {
  return `// 必须这样写注释
import React from 'react';

import styles from './${context.name}.module.scss';

export type ${context.namePascalCase}Props = {
/**
* a text to be rendered in the component.
*/
text: string
};

export function ${context.namePascalCase}({ text }: ${context.namePascalCase}Props) {
return (
<div className={styles.text}>
  {text}
</div>
);
`;
}
