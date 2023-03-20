/**
 * 生成组件, 处理组件依赖, 代码和版本重建
 */
import path from 'path';
import fs from 'fs';

import { execCmd } from '../lib/process';

const SCHEMA_PATH = path.join('.cache', 'micrc', 'schema');
const TYPES = ['atoms', 'components', 'modules', 'apps'];

const nodeModulesBasePath = path.resolve(
  require.resolve('react', { paths: [process.cwd()] }),
  '../../../../../', // node_modules目录
);

const bitBasePath = path.resolve(
  nodeModulesBasePath,
  '../', // bit workspace根目录
);

// 依赖处理
const dependencies = async (
  metaData: any, componentName: string, componentType: string,
) => {
  let deps: string = '';
  if (componentType === 'modules') { // 处理modules组件对components组件的依赖
    const { components } = metaData;
    deps = Object.values(components)
      .map((it: any) => `${it.packages}@${it.version}`)
      .join(' ');
  }
  if (componentType === 'components') { // 处理components组件对atoms组件的依赖
    const { atoms } = metaData;
    const storyAtoms = metaData.stories.atoms;
    deps = Object.values(atoms).concat(Object.values(storyAtoms))
      .map((it: any) => `${it.packages}@${it.version}`)
      .join(' ');
  }
  if (deps) {
    await execCmd('bit', ['deps', 'set', componentName, deps], bitBasePath);
  }
  // clientends组件依赖由generator自行处理; atoms组件依赖由workspace安装, 其只能使用workspace指定的三方组件或库
};

// 源代码处理
const codes = async (componentName: string, componentType: string) => {
  await execCmd('bit', ['create', `micrc-web-${componentType}`, componentName], bitBasePath); // 使用generator创建组件
};

// 发布处理
const tagging = async (componentName: string, version: string) => {
  await execCmd('bit', ['tag', '--soft', '-v', version, '--skip-auto-tag', componentName], bitBasePath);
};

const handleComponent = async (
  metaData: any, componentId: string, componentName: string, componentType: string,
) => {
  const { intro: { state, version } } = metaData;
  if (state === 'designing') { // 组件设计中, 生成代码用于调试
    await codes(componentName, componentType); // 创建组件并生成代码
    await dependencies(metaData, componentName, componentType); // 处理组件依赖
  }
  if (state === 'tagging') { // 组件发布中, 打soft tag等待合入, CI处理
    await codes(componentName, componentType); // 需要先创建组件并生成代码
    await tagging(componentName, version); // 打soft tag
  }
};

// 重建版本历史, 为了清理bit.cloud上的无用的版本记录(已经不再依赖的)
const rebuilding = async (
  componentPath: string, contextPath: string,
  componentId: string, componentName: string, componentType: string,
) => {
  const versionPath = path.join(contextPath, componentPath);
  if (!fs.existsSync(versionPath)) { // 如果存放历史版本元数据的目录不存在, 则不必进行重建
    return;
  }
  const versions: Array<string> = [];
  // 获取所有版本元数据
  const versionMetaFiles = fs.readdirSync(versionPath);
  // eslint-disable-next-line no-restricted-syntax
  for (const versionMetaFile of versionMetaFiles) {
    const version = versionMetaFile.replace('.json', '');
    // eslint-disable-next-line no-await-in-loop
    await codes(componentName, componentType); // 生成代码
    // eslint-disable-next-line no-await-in-loop
    await execCmd('bit', ['tag', '-v', version, '--skip-auto-tag', componentName], bitBasePath); // 发布版本
    versions.push(version);
  }
  // 删除remote scope上的组件
  await execCmd('bit', ['remove', '-r', '-f', '-s', componentId], bitBasePath);
  // 提交重建的版本
  // eslint-disable-next-line no-restricted-syntax
  for (const version of versions) {
    // eslint-disable-next-line no-await-in-loop
    await execCmd('bit', ['export', `${componentName}@${version}`], bitBasePath);
  }
};

const parseNameAndScope = (workspaceInfo: any) => {
  const contextName = workspaceInfo['teambit.workspace/workspace'].name;
  const accountScope = workspaceInfo['teambit.workspace/workspace'].defaultScope;
  const accountAndScopeArray = accountScope.split('.');
  if (accountAndScopeArray.length !== 2) {
    throw new Error('default scope must be format with account.scope');
  }
  const scope = accountAndScopeArray[1];
  // 获取组件类型
  const nameArray = contextName.split('-');
  if (nameArray.length !== 3 || nameArray[0] !== scope || nameArray[1] !== 'design' || !TYPES.includes(nameArray[2])) {
    throw new Error('workspace name must be format with [scope]-design-[componentType]s.'
      + `componentType: ${JSON.stringify(TYPES)}`
      + 'for examples: system-design-apps, order-design-components');
  }
  return {
    contextName,
    accountScope,
    componentType: nameArray[2],
  };
};

export const generate = async () => {
  const workspaceFilePath = path.join(bitBasePath, 'workspace.jsonc');
  // 读取workspace.jsonc得到上下文名称
  const workspaceInfo = JSON.parse(fs.readFileSync(workspaceFilePath, { encoding: 'utf8' }));
  // 获取上下文路径
  const { contextName, accountScope, componentType } = parseNameAndScope(workspaceInfo);
  const contextPath = path.join(nodeModulesBasePath, SCHEMA_PATH, contextName);
  if (!fs.existsSync(contextPath)) {
    throw new Error(`context in schema not exists: ${contextPath}`);
  }

  // 获取所有组件元数据
  const paths = fs.readdirSync(contextPath);
  // eslint-disable-next-line no-restricted-syntax
  for (const metaFilePath of paths) {
    const filePath = path.join(contextPath, metaFilePath);
    if (fs.existsSync(filePath) && metaFilePath.endsWith('.json')) {
      const metaData = fs.readFileSync(filePath);
      const componentPath = metaFilePath.replace('.json', '');
      const componentId = componentPath.replace(/#/, '/');
      const componentName = componentId.replace(accountScope, '');
      // 组件状态为设计中、发布中、已完成中的任意一个, 都需要首先删除workspace中已有的组件
      // 对于完成状态, 为了避免意外修改, 也应该删除这个组件, 接下来不做任何处理
      try {
        // eslint-disable-next-line no-await-in-loop
        await execCmd('bit', ['remove', '-s', '-f', componentName], bitBasePath);
      } catch (e) { /* 删除可能因为组件不存在而失败, 不做任何处理 */ }
      try {
      // eslint-disable-next-line no-await-in-loop
        await rebuilding(componentPath, contextPath, componentId, componentName, componentType);
      } catch (e) {
        throw new Error(`rebuilding history of version failure. \n${e}`);
      }
      try {
      // eslint-disable-next-line no-await-in-loop
        await handleComponent(metaData, componentId, componentName, componentType);
      } catch (e) {
        throw new Error(`generate component failure. \n${e}`);
      }
    }
  }
};
