/**
 * 组件入口文件模版
 */
import { ComponentContext } from '@teambit/generator';

export function indexFile(context: ComponentContext) {
  return `// 必须这样写注释
export { ${context.namePascalCase} } from './${context.name}';
export type { ${context.namePascalCase}Props } from './${context.name}';
`;
}
