/**
 * app type file
 */
import type { ClientendContextData } from '../_parser';

export function appTypeFile(data: ClientendContextData) {
  return `import { ReactAppOptions } from '@teambit/react';

export const ${data.context.namePascalCase}: ReactAppOptions = {
  name: '${data.context.name}',
  entry: [],
  // deploy: deployFunction,
};

export default ${data.context.namePascalCase};
`;
}
