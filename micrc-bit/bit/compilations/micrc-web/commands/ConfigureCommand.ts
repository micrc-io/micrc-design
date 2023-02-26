/**
 * 配置命令
 * 执行install, compile, link, status等命令配置workspace
 * 下载(局部clone当前仓库)schema目录中的元数据文件, 放在node_modules/.cache/micrc/schema中
 * 读取schema中的context信息，判断当前是system还是domain，system仅允许atom, component类型组件和clientend客户端
 * domain仅允许module和state两类组件，检查schema中的目录，确定符合条件
 */
import path from 'path';

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
    return Promise.resolve(`${this.name} complete`);
  }
}
