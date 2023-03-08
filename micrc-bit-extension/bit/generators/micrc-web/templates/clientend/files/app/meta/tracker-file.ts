/**
 * app/meta/tracker.json
 */
import prettier from 'prettier';

import { ClientendContextData } from '../../../_parser';

export function appMetaTrackerFile(data: ClientendContextData) {
  return prettier.format(
    JSON.stringify(data.tracker.init),
    {
      parser: 'json',
    },
  );
}
