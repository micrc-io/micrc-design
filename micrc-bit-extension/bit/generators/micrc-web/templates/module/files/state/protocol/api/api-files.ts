/**
 * state/protocol/apis/[proto].ts
 */
import fs from 'fs';
import path from 'path';

import { ModuleContextData } from '../../../../_parse';

const API_PATH = ['state', 'protocol', 'apis'];

export function stateProtocolApiFiles(data: ModuleContextData) {
  // 创建apis目录
  const apisPath = path.resolve(data.intro.sourceDir, ...API_PATH);
  if (!fs.existsSync(apisPath)) {
    fs.mkdirSync(apisPath, { recursive: true });
  }
  if (data.remoteState && data.remoteState.rpc && data.remoteState.rpc.protocols) {
    // 循环拷贝元数据目录下的协议文件
    data.remoteState.rpc.protocols.forEach((proto) => {
      fs.copyFileSync(
        path.resolve(data.intro.metaBasePath, proto),
        path.resolve(apisPath, path.basename(proto)),
      );
    });
  }
  return 'api files';
}
