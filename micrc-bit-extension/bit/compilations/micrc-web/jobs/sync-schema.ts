/**
 * 更新schema分支, 并合入当前分支, 获取最新元数据
 * copy元数据
 */
import path from 'path';

import chalk from 'chalk';
import log from 'loglevel';

import { execCmd, invoke } from '../lib/process';

log.setLevel('INFO');

// 合并schema分支, 检出最新当前分支
export const checkout = async () => {
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
export const copy = async () => {
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
