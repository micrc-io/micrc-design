/**
 * image files
 */
import fs from 'fs';
import path from 'path';
import https from 'https';

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
    const file = fs.createWriteStream(path.join(imagesPath, image.filename));
    const req = https.get(image.link, (resp) => {
      resp.pipe(file);
      file.on('finish', () => {
        file.close();
      });
    });
    req.on('error', (err) => {
      log.error(chalk.red(err));
    });
  });
  return 'image files';
}
