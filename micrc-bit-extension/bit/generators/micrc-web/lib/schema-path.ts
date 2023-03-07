/**
 * 处理元数据目录
 */
import fs from 'fs';
import path from 'path';

import { ComponentContext } from '@teambit/generator';

const SCHEMA_PATH = ['.cache', 'micrc', 'schema'];

export const handlePath = (context: ComponentContext) => {
  const nodeModulesBasePath = path.resolve(
    require.resolve('@micrc/bit.generators.micrc-web'),
    '../../../../',
  );
  const bitBasePath = path.resolve(
    nodeModulesBasePath,
    '../', // bit workspace根目录
  );
  const workspaceFilePath = path.join(bitBasePath, 'workspace.jsonc');
  const workspaceInfo = JSON.parse(fs.readFileSync(workspaceFilePath, { encoding: 'utf8' }));
  const contextName = workspaceInfo['teambit.workspace/workspace'].name;
  const metaBasePath = path.resolve(
    nodeModulesBasePath, ...SCHEMA_PATH, contextName,
  );
  const metaFile = `${context.componentId.toStringWithoutVersion().replace(/\//g, '#')}.json`;
  const metaFilePath = path.resolve(metaBasePath, metaFile);
  return {
    metaBasePath,
    metaFilePath,
  };
};
