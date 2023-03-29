/**
 * app/public/favicon-file
 */
import fs from 'fs';
import path from 'path';
import https from 'https';

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
  const file = fs.createWriteStream(path.join(publicPath, 'favicon.ico'));
  const req = https.get(data.intro.favicon, (resp) => {
    resp.pipe(file);
    file.on('finish', () => {
      file.close();
    });
  });
  req.on('error', (err) => {
    log.error(chalk.red(err));
  });
  return '';
}
