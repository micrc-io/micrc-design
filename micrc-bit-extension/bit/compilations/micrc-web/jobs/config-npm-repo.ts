/**
 * 配置组件的npm仓库
 */
import path from 'path';
import fs from 'fs';

import chalk from 'chalk';
import log from 'loglevel';

import { execCmd } from '../lib/process';
import {
  nodeModulesBasePath,
  bitBasePath,
  workspaceConfigPath,
  workspaceConfig,
  parseWorkspaceConfig,
} from '../lib/workspace-config';

log.setLevel('INFO');

const SCHEMA_LOCATION = ['.cache', 'micrc', 'schema'];

export const repo = async () => {

};
