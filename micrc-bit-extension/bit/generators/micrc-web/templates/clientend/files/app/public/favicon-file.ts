/**
 * app/public/favicon-file
 */
import fs from 'fs';
import path from 'path';
import request from 'sync-request';

import chalk from 'chalk';
import log from 'loglevel';

import { ClientendContextData } from '../../../_parser';

log.setLevel('INFO');

const PUBLIC_PATH = ['app', 'public'];

export function faviconFile(data: ClientendContextData) {
  const publicPath = path.resolve(data.intro.sourceDir, ...PUBLIC_PATH);
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }
  try {
    fs.writeFileSync(path.join(publicPath, 'favicon.ico'), request('GET', data.intro.favicon).body);
  } catch (e) {
    log.error(chalk.red(`download image error: ${e}`));
  }
  return '';
}
