/**
 * state/protocol/aggre.json
 */
import fs from 'fs';
import path from 'path';

import { ModuleContextData } from '../../../_parse';

export function stateProtocolAggreFile(data: ModuleContextData) {
  const aggreFilePath = path.join(data.intro.metaBasePath, data.intro.modelFilePath);
  if (fs.existsSync(aggreFilePath) && fs.lstatSync(aggreFilePath).isFile()) {
    return fs.readFileSync(aggreFilePath);
  }
  return '';
}
