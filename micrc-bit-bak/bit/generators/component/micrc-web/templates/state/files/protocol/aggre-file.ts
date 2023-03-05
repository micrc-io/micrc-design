/**
 * protocol/aggre.json
 */
import fs from 'fs';
import path from 'path';

import { ModuleContextData } from '../../_parse';

export function protocolAggreFile(data: ModuleContextData) {
  // 拷贝集成的上下文下的聚合模型schema文件
  const aggreSchemaPath = path.resolve(data.intro.metaBasePath, 'aggre.json');
  return fs.readFileSync(aggreSchemaPath);
}
