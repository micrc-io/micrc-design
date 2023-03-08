/**
 * app/meta/i18n.json
 */
import prettier from 'prettier';

import { ClientendContextData } from '../../../_parser';

export function appMetaI18nFile(data: ClientendContextData) {
  return prettier.format(
    JSON.stringify(data.i18n.init),
    {
      parser: 'json',
    },
  );
}
