/**
 * meta/i18n.json
 */
import prettier from 'prettier';

import { ModuleContextData } from '../../_parse';

export function i18nMetaFile(data: ModuleContextData) {
  return prettier.format(
    JSON.stringify(data.i18n),
    {
      parser: 'json',
    },
  );
}
