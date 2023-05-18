/**
 * app/public/favicon-file
 */
import request from 'sync-request';

import chalk from 'chalk';
import log from 'loglevel';

import { ClientendContextData } from '../../../_parser';

log.setLevel('INFO');

export function faviconFile(data: ClientendContextData) {
  try {
    return request('GET', data.intro.favicon).body;
  } catch (e) {
    log.error(chalk.red(`download image error: ${e}`));
    return '';
  }
}
