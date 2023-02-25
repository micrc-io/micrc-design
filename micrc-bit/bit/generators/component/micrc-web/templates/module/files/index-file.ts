/**
 * index.ts
 */
import { ModuleContextData } from '../_parse';

export function indexFile(data: ModuleContextData) {
  return `// 必须这样写注释
export { ${data.context.namePascalCase} } from './${data.context.name}';
export type { ${data.context.namePascalCase}Props } from './${data.context.name}';
`;
}
