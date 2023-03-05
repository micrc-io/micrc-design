/**
 * protocol/apis/[proto].ts
 */
import fs from 'fs';
import path from 'path';

import { ModuleContextData } from '../../../_parse';

export function protocolApiFiles(data: ModuleContextData) {
  // 创建apis目录
  const apisPath = path.resolve(data.intro.sourceDir, 'protocol', 'apis');
  if (!fs.existsSync(apisPath)) {
    fs.mkdirSync(apisPath, { recursive: true });
  }
  // 循环拷贝元数据目录下的协议文件
  data.integration.rpc.protocols.forEach((proto) => {
    fs.copyFileSync(
      path.resolve(data.intro.metaBasePath, `${proto}.json`),
      path.resolve(apisPath, `${proto}.json`),
    );
  });
  return 'api files';
}
