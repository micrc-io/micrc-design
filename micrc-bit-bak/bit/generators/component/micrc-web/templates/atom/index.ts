/**
 * micrc web atom component template
 */
import path from 'path';
import fs from 'fs';

import { ComponentTemplate, ComponentContext } from '@teambit/generator';

import type { AtomContextData } from './_parse';
import { parse } from './_parse';

import { indexFile } from './files/index-file';
import { componentFile } from './files/component-file';
import { storiesFile } from './files/stories-file';
import { specFile } from './files/spec-file';
import { docsFile } from './files/docs-file';
import { compositionFile } from './files/composition-file';

const SCHEMA_PATH = ['.cache', 'micrc', 'schema'];

export const atomTemplate: ComponentTemplate = {
  name: 'micrc-web-atom',
  description: '',
  generateFiles: (context: ComponentContext) => {
    const contextName = context.componentId.scope.split('.')[1];
    const typeName = 'atoms';
    const nodeModulesPath = path.resolve(
      require.resolve('@micrc/bit.generators.component.micrc-web'),
      '../../../../',
    );
    const metaFile = `${context.componentId.toStringWithoutVersion().replace(/\//g, '-')}.json`;
    const metaFilePath = path.resolve(
      nodeModulesPath, ...SCHEMA_PATH, contextName, typeName, metaFile,
    );
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
      {
        relativePath: `${context.name}.stories.tsx`,
        content: storiesFile(data),

      },
      // composition.tsx file
      {
        relativePath: `${context.name}.composition.tsx`,
        content: compositionFile(data),
      },
      // spec.tsx
      {
        relativePath: `${context.name}.spec.tsx`,
        content: specFile(data),
      },
      {
        relativePath: `${context.name}.docs.mdx`,
        isMain: true,
        content: docsFile(data),
      },
    ];
  },
};
