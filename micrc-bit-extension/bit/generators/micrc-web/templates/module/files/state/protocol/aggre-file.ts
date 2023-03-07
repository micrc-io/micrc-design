/**
 * state/protocol/aggre.json
 */
import fs from 'fs';
import path from 'path';

import { ModuleContextData } from '../../../_parse';

export function stateProtocolAggreFile(data: ModuleContextData) {
  return fs.readFileSync(path.join(data.intro.metaBasePath, data.intro.modelFilePath));
}
