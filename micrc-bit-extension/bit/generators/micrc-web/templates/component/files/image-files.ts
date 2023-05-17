/**
 * image files
 */
import fs from 'fs';
import path from 'path';
import request from 'sync-request';

import chalk from 'chalk';
import log from 'loglevel';

import { ComponentContextData } from '../_parse';

log.setLevel('INFO');

const IMAGE_PATH = ['images'];

export function imageFiles(data: ComponentContextData) {
  const imagesPath = path.resolve(data.intro.sourceDir, ...IMAGE_PATH);
  if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath, { recursive: true });
  }
  data?.images?.examples.concat(data?.images?.local).forEach((image) => {
    try {
      fs.writeFileSync(path.join(imagesPath, image.filename), request('GET', image.link).body);
    } catch (e) {
      log.error(chalk.red(`download image error: ${e}`));
    }
  });
  return 'image files';
}
