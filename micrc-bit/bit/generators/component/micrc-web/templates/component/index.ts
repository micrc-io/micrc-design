/**
 * micrc web component template
 */
import path from 'path';
import fs from 'fs';
import { ComponentTemplate, ComponentContext } from '@teambit/generator';

import type { ComponentContextData } from './_parse';
import { parse } from './_parse';

import { indexFile } from './files/index-file';
import { componentFile } from './files/component-file';

const SCHEMA_PATH = '.cache/micrc/schema/components';

export const componentTemplate: ComponentTemplate = {
  name: 'micrc-web-component',
  description: 'test for micrc web',
  generateFiles: (context: ComponentContext) => {
    const nodeModulesPath = path.resolve(
      require.resolve('@micrc/bit.generators.component.micrc-web'),
      '../../../../',
    );
    const metaFile = `${context.componentId.toStringWithoutVersion().replace(/\//g, '-')}.json`;
    const metaFilePath = path.resolve(nodeModulesPath, SCHEMA_PATH, metaFile);
    const data: ComponentContextData = parse(
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
      // component file
      {
        relativePath: `${context.name}.tsx`,
        content: componentFile(data),
      },
      // scss file
      {
        relativePath: `${context.name}.module.scss`,
        content: '',
      },
    ];
  },
};
