/**
 * meta/integration.json
 */
import prettier from 'prettier';

import { ModuleContextData } from '../../_parse';

export function integrationMetaFile(data: ModuleContextData) {
  return prettier.format(
    JSON.stringify(data.integration),
    {
      parser: 'json',
    },
  );
}
