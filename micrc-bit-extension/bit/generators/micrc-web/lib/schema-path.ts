/**
 * 处理元数据目录
 */
import fs from 'fs';
import path from 'path';

import { ComponentContext } from '@teambit/generator';

const SCHEMA_PATH = ['.cache', 'micrc', 'schema'];

const nodeModulesBasePath = path.resolve(
  require.resolve('react', { paths: [process.cwd()] }),
  '../../../../../',
);
const bitBasePath = path.resolve(
  nodeModulesBasePath,
  '../', // bit workspace根目录
);

export const handlePath = (context: ComponentContext) => {
  const workspaceFilePath = path.join(bitBasePath, 'workspace.jsonc');
  const workspaceInfo = JSON.parse(fs.readFileSync(workspaceFilePath, { encoding: 'utf8' }));
  const contextName = workspaceInfo['teambit.workspace/workspace'].name.split('-')[0];
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
