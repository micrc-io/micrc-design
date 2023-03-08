/**
 * app/meta/submission/i18n.json
 */
import prettier from 'prettier';

import { ClientendContextData } from '../../../../_parser';

export function appI18nSubmissionFile(data: ClientendContextData) {
  return prettier.format(
    JSON.stringify(data.i18n.submission),
    {
      parser: 'json',
    },
  );
}
