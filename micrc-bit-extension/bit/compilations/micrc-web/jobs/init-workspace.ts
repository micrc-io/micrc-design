/**
 * 安装workspace依赖, 并配置
 */
import chalk from 'chalk';
import log from 'loglevel';

import { execCmd } from '../lib/process';
import { bitBasePath } from '../lib/workspace-config';

log.setLevel('INFO');

export const init = async () => {
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
