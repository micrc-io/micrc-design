/**
 * micrc web module template
 */
import path from 'path';
import fs from 'fs';

import { ComponentTemplate, ComponentContext } from '@teambit/generator';

import type { ModuleContextData } from './_parse';
import { parse } from './_parse';

import { indexFile } from './files/index-file';
import { storiesFile } from './files/stories-file';
import { i18nMetaFile } from './files/meta/i18n-meta-file';
import { integrationMetaFile } from './files/meta/integration-meta-file';

const SCHEMA_PATH = ['.cache', 'micrc', 'schema'];

export const moduleTemplate: ComponentTemplate = {
  name: 'micrc-web-module',
  description: '',
  generateFiles: (context: ComponentContext) => {
    const contextName = context.componentId.scope.split('.')[1];
    const typeName = 'modules';
    const nodeModulesPath = path.resolve(
      require.resolve('@micrc/bit.generators.component.micrc-web'),
      '../../../../',
    );
    const metaFile = `${context.componentId.toStringWithoutVersion().replace(/\//g, '-')}.json`;
    const metaFilePath = path.resolve(
      nodeModulesPath, ...SCHEMA_PATH, contextName, typeName, metaFile,
    );
    const data: ModuleContextData = parse(
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
      // stories file
      {
        relativePath: `${context.name}.stories.tsx`,
        content: storiesFile(data),
      },
      // i18n meta file
      {
        relativePath: 'meta/i18n.json',
        content: i18nMetaFile(data),
      },
      // integration meta file
      {
        relativePath: 'meta/integration.json',
        content: integrationMetaFile(data),
      },
    ];
  },
};
