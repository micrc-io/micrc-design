/**
 * index.ts
 */
import type { ClientendContextData } from '../_parser';

export function indexFile(data: ClientendContextData) {
  return `export { ${data.context.namePascalCase} } from './app.react-app';
`;
}
