/**
 * app/meta/integration.json
 */
import prettier from 'prettier';

import { ClientendContextData } from '../../../_parser';

export function appMetaIntegrationFile(data: ClientendContextData) {
  return prettier.format(
    JSON.stringify(data.integration),
    {
      parser: 'json',
    },
  );
}
