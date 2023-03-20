/**
 * 安装workspace依赖, 并配置
 */
import path from 'path';

import chalk from 'chalk';
import log from 'loglevel';

import { execCmd } from '../lib/process';

log.setLevel('INFO');

const bitBasePath = path.resolve(
  require.resolve('react', { paths: [process.cwd()] }),
  '../../../../../', // node_modules目录,
  '../', // bit workspace根目录
);

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
