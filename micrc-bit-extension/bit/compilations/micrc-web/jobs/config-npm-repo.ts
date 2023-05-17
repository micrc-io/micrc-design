/**
 * 配置组件的npm仓库
 */
import path from 'path';
import fs from 'fs';

import chalk from 'chalk';
import log from 'loglevel';

import { execCmd } from '../lib/process';
import { nodeModulesBasePath, bitBasePath, workspaceConfigPath, workspaceConfig } from '../lib/workspace-config';

log.setLevel('INFO');

const SCHEMA_LOCATION = ['.cache', 'micrc', 'schema'];

export const repo = async () => {
  try {
    const contextIntro = JSON.parse(
      fs.readFileSync(path.join(nodeModulesBasePath, ...SCHEMA_LOCATION, 'intro.json'), { encoding: 'utf8' }),
    );
    const repoUrl = contextIntro?.global?.npmRepoUrl || '';
    const publishConfig: any = {};
    const newConfig = workspaceConfig;
    if (repoUrl) {
      publishConfig.registry = repoUrl;
    }
    newConfig['teambit.workspace/variants']['{*}'] = {
      'teambit.pkg/pkg': {
        packageJson: {
          publishConfig,
        },
      },
    };
    fs.writeFileSync(
      workspaceConfigPath,
      JSON.stringify(newConfig, null, 2),
      { encoding: 'utf8' },
    );
    await execCmd('bit', ['link'], bitBasePath);
    await execCmd('bit', ['status'], bitBasePath);
  } catch (e) {
    log.error(chalk.red(`config npm repo error: ${e}`));
  }
};
