/**
 * micrc web module template
 */
import path from 'path';
import fs from 'fs';

import { ComponentTemplate, ComponentContext } from '@teambit/generator';

import type { ModuleContextData } from './_parse';
import { parse } from './_parse';

import { indexFile } from './files/index-file';
import { componentFile } from './files/component-file';
import { storiesFile } from './files/stories-file';
import { testFile } from './files/test-file';
import { docFile } from './files/docs-file';
import { i18nMetaFile } from './files/meta/i18n-meta-file';
import { compositionFile } from './files/composition-file';
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
      // component file
      {
        relativePath: `${context.name}.tsx`,
        content: componentFile(data),
      },
      // scss file
      {
        relativePath: `${context.name}.module.scss`,
        content: `// ${context.name} scss`,
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
      // composition.tsx file
      {
        relativePath: `${context.name}.composition.tsx`,
        content: compositionFile(data),
      },
      // spec.tsx
      {
        relativePath: `${context.name}.spec.tsx`,
        content: testFile(data),
      },
      // integration meta file
      {
        relativePath: 'meta/integration.json',
        content: integrationMetaFile(data),
      },
      {
        relativePath: `${context.name}.docs.mdx`,
        content: docFile(data),
      },
    ];
  },
};
