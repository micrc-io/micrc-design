/**
 * micrc web atom component template
 */
import path from 'path';
import fs from 'fs';

import { ComponentTemplate, ComponentContext } from '@teambit/generator';

import type { AtomContextData } from './_parse';
import { parse } from './_parse';

import { indexFile } from './files/index-file';

const SCHEMA_PATH = '.cache/micrc/schema/atoms';

export const atomTemplate: ComponentTemplate = {
  name: 'micrc-web-atom',
  description: '',
  generateFiles: (context: ComponentContext) => {
    const nodeModulesPath = path.resolve(
      require.resolve('@micrc/bit.generators.component.micrc-web'),
      '../../../../',
    );
    const metaFile = `${context.componentId.toStringWithoutVersion().replace(/\//g, '-')}.json`;
    const metaFilePath = path.resolve(nodeModulesPath, SCHEMA_PATH, metaFile);
    const data: AtomContextData = parse(
      JSON.parse(fs.readFileSync(metaFilePath).toString()),
      context,
    );
    return [
      // index file
      {
        relativePath: 'index.ts',
        isMain: true,
        content: indexFile(data),
      },
    ];
  },
};
