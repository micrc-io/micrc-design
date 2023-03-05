/**
 * index.ts
 */
import type { ModuleContextData } from '../_parse';

export function indexFile(data: ModuleContextData) {
  return `// ${data.context.name}
export { useStore } from './${data.context.name}';
require('axios');
`;
}
