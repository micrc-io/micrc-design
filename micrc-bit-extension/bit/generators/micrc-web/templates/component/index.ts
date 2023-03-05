/*
 * @Author: wuwanping
 * @Date: 2023-02-28 11:06:32
 * @LastEditTime: 2023-02-28 16:22:02
 * @LastEditors: wuwanping
 * @Description: 
 * @FilePath: /micrc-bit/bit/generators/component/micrc-web/templates/component/index.ts
 */
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
import { docFile } from './files/doc-file';
import { testFile } from './files/test-file';
import { storiesFile } from './files/stories-file';
import { compositionFile } from './files/composition-file';

const SCHEMA_PATH = ['.cache', 'micrc', 'schema'];

export const componentTemplate: ComponentTemplate = {
  name: 'micrc-web-component',
  description: 'test for micrc web',
  generateFiles: (context: ComponentContext) => {
    const contextName = context.componentId.scope.split('.')[1];
    const typeName = 'components';
    const nodeModulesPath = path.resolve(
      require.resolve('@micrc/bit.generators.component.micrc-web'),
      '../../../../',
    );
    const metaFile = `${context.componentId.toStringWithoutVersion().replace(/\//g, '-')}.json`;
    const metaFilePath = path.resolve(
      nodeModulesPath, ...SCHEMA_PATH, contextName, typeName, metaFile,
    );
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
        content: `// ${context.name} scss\n`,
      },
      // docs file
      {
        relativePath: `${context.name}.docs.mdx`,
        content: docFile(data),
      },
      // test file
      {
        relativePath: `${context.name}.spec.tsx`,
        content: testFile(data),
      },
      // stories file
      {
        relativePath: `${context.name}.stories.tsx`,
        content: storiesFile(data),
      },
      // composition file
      {
        relativePath: `${context.name}.composition.tsx`,
        content: compositionFile(data),
      },
    ];
  },
};
