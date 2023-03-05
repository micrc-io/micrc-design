/**
 * 配置命令
 * 执行install, compile, link, status等命令配置workspace
 * 下载(局部clone当前仓库)schema目录中的元数据文件, 放在node_modules/.cache/micrc/schema中
 * 读取schema中的context信息，判断当前是system还是domain，system仅允许atom, component类型组件和clientend客户端
 * domain仅允许module和state两类组件，检查schema中的目录，确定符合条件
 */
import path from 'path';
import fs from 'fs';

import { Command, CommandOptions } from '@teambit/cli';

import chalk from 'chalk';
import log from 'loglevel';

import { execCmd, invoke } from '../lib/process';

log.setLevel('INFO');

// 合并schema分支, 检出最新当前分支
const checkout = async () => {
  const gitBasePath = path.resolve(
    require.resolve('@micrc/bit.compilations.micrc-web'),
    '../../../../', // node_modules目录,
    '../', // bit workspace根目录
    '../', // git根目录
  );
  // 获取当前分支名
  const branch: string = await invoke('git rev-parse --abbrev-ref HEAD', gitBasePath);
  try {
    // 切换到schema分支
    await execCmd('git', ['checkout', 'schema'], gitBasePath);
    // 从服务器拉取最新内容
    await execCmd('git', ['fetch'], gitBasePath);
    // 合并最新内容到schema
    await execCmd('git', ['merge'], gitBasePath);
    // 切换回当前分支, 并merge schema分支
    await execCmd('git', ['checkout', branch.replace('\n', '')], gitBasePath);
    await execCmd('git', ['merge', 'schema'], gitBasePath);
    log.info(chalk.green('schema merged successfully.'));
  } catch (e) {
    log.error(chalk.red(`schema merge error: ${e}`));
  }
};

// 拷贝元数据到.cache/micrc/schema目录
const copy = async () => {
  const nodeModulesBasePath = path.resolve(
    require.resolve('@micrc/bit.compilations.micrc-web'),
    '../../../../', // node_modules目录,
  );
  const gitBasePath = path.resolve(
    nodeModulesBasePath,
    '../', // bit workspace根目录
    '../', // git根目录
  );
  // 首先删除.cache/micrc/schema目录
  const schemaSourcePath = path.resolve(gitBasePath, 'schema');
  const schemaTargetPath = path.resolve(nodeModulesBasePath, '.cache', 'micrc', 'schema');
  try {
    await execCmd('rm', ['-rf', schemaTargetPath], gitBasePath);
    // 创建目录并拷贝
    await execCmd('mkdir', ['-p', schemaTargetPath], gitBasePath);
    await execCmd('cp', ['-r', schemaSourcePath, schemaTargetPath], gitBasePath);
    log.info(chalk.green('schema copied successfully.'));
  } catch (e) {
    log.error(chalk.red(`schema copy error: ${e}`));
  }
};

// 初始化workspace
const init = async () => {
  const bitBasePath = path.resolve(
    require.resolve('@micrc/bit.compilations.micrc-web'),
    '../../../../', // node_modules目录,
    '../', // bit workspace根目录
  );
  try {
    await execCmd('bit', ['install'], bitBasePath);
    await execCmd('bit', ['install'], bitBasePath);
    await execCmd('bit', ['compile'], bitBasePath);
    await execCmd('bit', ['compile'], bitBasePath);
    await execCmd('bit', ['link'], bitBasePath);
    await execCmd('bit', ['status'], bitBasePath);
    log.info(chalk.green('workspace initialized successfully.'));
  } catch (e) {
    log.error(chalk.red(`workspace init error: ${e}`));
  }
};

// 设计子域组件-元数据文件映射
const mappingDesign = (contextPath: string): Record<string, string> => {
  const mappingInfo = {};
  const atomsPath = path.join(contextPath, 'atoms');
  if (fs.existsSync(atomsPath)) {
    fs.readdirSync(atomsPath).forEach((atom) => {
      mappingInfo[atom.replace('.json', '')] = path.join(atomsPath, atom);
    });
  }
  const componentsPath = path.join(contextPath, 'components');
  if (fs.existsSync(componentsPath)) {
    fs.readdirSync(componentsPath).forEach((component) => {
      mappingInfo[component.replace('.json', '')] = path.join(atomsPath, component);
    });
  }
  const clientendsPath = path.join(contextPath, 'clientends');
  if (fs.existsSync(clientendsPath)) {
    fs.readdirSync(clientendsPath).forEach((clientend) => {
      mappingInfo[clientend.replace('.json', '')] = path.join(atomsPath, clientend);
    });
  }
  return mappingInfo;
};

const handleMapping = (userCasePath: string): Record<string, string> => {
  const mappingInfo = {};
  const modulesPath = path.join(userCasePath, 'modules');
  if (fs.existsSync(modulesPath)) {
    fs.readdirSync(modulesPath).forEach((module) => {
      mappingInfo[module.replace('.json', '')] = path.join(modulesPath, module);
    });
  }
  const statesPath = path.join(userCasePath, 'states');
  if (fs.existsSync(statesPath)) {
    fs.readdirSync(statesPath).forEach((state) => {
      mappingInfo[state.replace('.json', '')] = path.join(statesPath, state);
    });
  }
  const atomsPath = path.join(userCasePath, 'atoms');
  if (fs.existsSync(atomsPath)) {
    fs.readdirSync(atomsPath).forEach((atom) => {
      mappingInfo[atom.replace('.json', '')] = path.join(atomsPath, atom);
    });
  }
  const componentsPath = path.join(userCasePath, 'components');
  if (fs.existsSync(componentsPath)) {
    fs.readdirSync(componentsPath).forEach((component) => {
      mappingInfo[component.replace('.json', '')] = path.join(componentsPath, component);
    });
  }
  return mappingInfo;
};

// 业务子域组件-元数据映射
const mappingDomain = (contextPath: string): Record<string, string> => {
  const mappingInfo = {};
  const userCasesPath = path.join(contextPath, 'usercases');
  if (fs.existsSync(userCasesPath)) {
    fs.readdirSync(userCasesPath).forEach((userCase) => {
      const userCasePath = path.join(userCasesPath, userCase);
      if (fs.statSync(userCasePath).isDirectory()) {
        Object.assign(mappingInfo, handleMapping(userCasePath));
      }
    });
  }
  return mappingInfo;
};

// 生成组件-元数据文件地址映射
const mapping = () => {
  // 读取子域元数据, 判断是否设计子域或业务子域
  const gitBasePath = path.resolve(
    require.resolve('@micrc/bit.compilations.micrc-web'),
    '../../../../', // node_modules目录,
    '../', // bit workspace根目录
    '../', // git根目录
  );
  const bitBasePath = path.resolve(
    require.resolve('@micrc/bit.compilations.micrc-web'),
    '../../../../', // node_modules目录,
    '../', // bit workspace根目录
  );
  const workspaceFilePath = path.join(bitBasePath, 'workspace.jsonc');
  const domainFilePath = path.join(gitBasePath, 'schema', 'domain-info.json');
  const domainInfo = JSON.parse(fs.readFileSync(domainFilePath, { encoding: 'utf8' }));
  const workspaceInfo = JSON.parse(fs.readFileSync(workspaceFilePath, { encoding: 'utf8' }));
  const contextName = workspaceInfo['teambit.workspace/workspace'].defaultScope.split('.')[1];
  const contextPath = path.join(gitBasePath, 'schema', contextName);
  const mappingFilePath = path.join(contextPath, 'mapping.json');
  const { isDesign } = domainInfo;
  let mappingInfo: Record<string, string>;
  if (isDesign) {
    mappingInfo = mappingDesign(contextPath);
  } else {
    mappingInfo = mappingDomain(contextPath);
  }
  fs.writeFileSync(mappingFilePath, JSON.stringify(mappingInfo));
};

export class ConfigureCmd implements Command {
  name = 'micrc:conf';

  description = 'configure workspace and download file of meta data';

  extendedDescription = '';

  alias = '';

  loader = true;

  group = 'micrc';

  options = [] as CommandOptions;

  async report(): Promise<string> {
    log.info('');
    await init();
    await checkout();
    await copy();
    mapping();
    return Promise.resolve(`${this.name} complete`);
  }
}
