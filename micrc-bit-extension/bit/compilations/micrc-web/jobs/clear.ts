/**
 * 删除所有组件
 */
import chalk from 'chalk';
import log from 'loglevel';

import { execCmd } from '../lib/process';
import { bitBasePath, parseWorkspaceConfig } from '../lib/workspace-config';

log.setLevel('INFO');

export const clear = async () => {
  const { contextName, componentType } = parseWorkspaceConfig();
  try {
    await execCmd('bit', ['remove', '-s', '-f', `${contextName}/web/${componentType}/*`], bitBasePath);
    log.info(chalk.green('clear successfully.'));
  } catch (e) {
    log.error(chalk.red(`clear err: ${e}`));
  }
};
