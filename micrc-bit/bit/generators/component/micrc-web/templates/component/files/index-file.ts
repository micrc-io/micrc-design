/**
 * index.ts
 */
import { ComponentContextData } from '../_parse';

export function indexFile(data: ComponentContextData) {
  return `// 必须这样写注释
export { ${data.context.namePascalCase} } from './${data.context.name}';
export type { ${data.context.namePascalCase}Props } from './${data.context.name}';
`;
}
