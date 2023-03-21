/**
 * app/meta/permission.json
 */
import prettier from 'prettier';

import { ClientendContextData } from '../../../_parser';

export function appMetaPermissionFile(data: ClientendContextData) {
  const permissions: Record<string, Array<string>> = {};
  Object.keys(data.pages || {}).forEach((pageUri) => {
    permissions[pageUri] = data.pages[pageUri].permissions;
  });
  return prettier.format(
    JSON.stringify(permissions),
    {
      parser: 'json',
    },
  );
}
