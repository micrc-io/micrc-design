/**
 * 更新schema分支, 并合入当前分支, 获取最新元数据
 * copy元数据
 */
import path from 'path';
import fs from 'fs';

import chalk from 'chalk';
import log from 'loglevel';

import { execCmd, invoke } from '../lib/process';
import { nodeModulesBasePath, bitBasePath, gitBasePath } from '../lib/workspace-config';

log.setLevel('INFO');

const STABLE_BRANCHES = ['main', 'master', 'dev', 'develop', 'main', 'hotfix', 'schema'];
const SCHEMA_BRANCH = 'schema';

const contextName = JSON.parse(
  fs.readFileSync(path.join(bitBasePath, 'workspace.jsonc'), { encoding: 'utf8' }),
)['teambit.workspace/workspace'].name.split('-')[0];

// 合并schema分支, 检出最新当前分支
export const checkout = async () => {
  // 获取远程库名称和当前分支名
  let repo: string = await invoke('git remote show', gitBasePath);
  let branch: string = await invoke('git branch --show-current', gitBasePath);
  repo = repo.trim().replace(/[\r\n]/g, '');
  branch = branch.trim().replace(/[\r\n]/g, '');
  if (STABLE_BRANCHES.includes(branch) || branch === '') {
    return;
  }
  try {
    // 从服务器拉取最新内容
    await execCmd('git', ['fetch'], gitBasePath);
    // 合并schema分支下, schema目录当前上下文/intro.json和aggregations目录下的最新内容到当前分支的
    await execCmd('git', ['restore', '--source', `${repo}/${SCHEMA_BRANCH}`, `schema/${contextName}/intro.json`], gitBasePath);
    await execCmd('git', ['restore', '--source', `${repo}/${SCHEMA_BRANCH}`, `schema/${contextName}/aggregations`], gitBasePath);
    // 添加合并的文件
    await execCmd('git', ['add', `schema/${contextName}`], gitBasePath);
    log.info(chalk.green('schema merged successfully.'));
  } catch (e) {
    log.error(chalk.red(`schema merge error: ${e}`));
  }
};

// 拷贝元数据到.cache/micrc/schema目录
export const copy = async () => {
  // 首先删除.cache/micrc/schema目录
  const schemaSourcePath = path.resolve(gitBasePath, 'schema', contextName);
  const schemaTargetPath = path.resolve(nodeModulesBasePath, '.cache', 'micrc', 'schema');
  try {
    await execCmd('rm', ['-rf', schemaTargetPath], gitBasePath);
    // 创建目录并拷贝
    await execCmd('mkdir', ['-p', schemaTargetPath], gitBasePath);
    await execCmd('cp', ['-r', `${schemaSourcePath}/`, `${schemaTargetPath}/`], gitBasePath);
    log.info(chalk.green('schema copied successfully.'));
  } catch (e) {
    log.error(chalk.red(`schema copy error: ${e}`));
  }
};
