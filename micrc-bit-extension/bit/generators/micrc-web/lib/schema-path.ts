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
  const workspaceName = workspaceInfo['teambit.workspace/workspace'].name;
  const scope = workspaceInfo['teambit.workspace/workspace'].defaultScope.split('.')[1];
  const contextName = workspaceName.split('-')[0];
  const componentType = workspaceName.split('-')[2];
  const metaBasePath = path.resolve(
    nodeModulesBasePath, ...SCHEMA_PATH,
  );
  const metaFile = `${context.componentId.toStringWithoutVersion().replace(/\//g, '#')}.json`;
  const metaFilePath = path.resolve(metaBasePath, metaFile);

  return {
    metaBasePath,
    metaFilePath,
    relativePath: `${workspaceName}/${scope}/${contextName}/web/${componentType}/${context.componentId}/app`,
  };
};
