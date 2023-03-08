/**
 * app/meta/submission/tracker.json
 */
import prettier from 'prettier';

import { ClientendContextData } from '../../../../_parser';

export function appTrackerSubmissionFile(data: ClientendContextData) {
  return prettier.format(
    JSON.stringify(data.tracker.submission),
    {
      parser: 'json',
    },
  );
}
