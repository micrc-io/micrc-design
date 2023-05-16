import path from 'path';
import fs from 'fs';

export const TYPES = { ATOMS: 'atoms', COMPONENTS: 'components', MODULES: 'modules', CLIENTENDS: 'clientends' };

export const nodeModulesBasePath = path.resolve(
  require.resolve('react', { paths: [process.cwd()] }),
  '../../../../../', // node_modules目录,
);

export const bitBasePath = path.resolve(
  nodeModulesBasePath,
  '../', // bit workspace根目录
);

export const gitBasePath = path.resolve(
  bitBasePath,
  '../', // git根目录
);

export const workspaceConfigPath = path.join(bitBasePath, 'workspace.jsonc');

export const workspaceConfig = JSON.parse(
  fs.readFileSync(workspaceConfigPath, { encoding: 'utf8' }),
);

// 解析workspace配置
export const parseWorkspaceConfig = () => {
  const workspaceName = workspaceConfig['teambit.workspace/workspace'].name;
  const accountScope = workspaceConfig['teambit.workspace/workspace'].defaultScope;
  const accountAndScopeArray = accountScope.split('.');
  if (accountAndScopeArray.length !== 2) {
    throw new Error('default scope must be format with account.scope');
  }
  const nameArray = workspaceName.split('-');
  if (nameArray.length !== 3 || nameArray[1] !== 'design' || !Object.values(TYPES).includes(nameArray[2])) {
    throw new Error('workspace name must be format with [contextName]-design-[componentType]s.\n'
      + `componentType: ${JSON.stringify(Object.values(TYPES))}\n`
      + 'for examples: system-design-clientends, order-design-components');
  }
  return {
    contextName: nameArray[0],
    contextSubName: nameArray[1],
    account: accountAndScopeArray[0],
    scope: accountAndScopeArray[1],
    componentType: nameArray[2],
  };
};
