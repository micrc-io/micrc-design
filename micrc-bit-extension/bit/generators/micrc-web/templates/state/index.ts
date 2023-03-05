/**
 * micrc web atom component template
 */
import path from 'path';
import fs from 'fs';

import { ComponentTemplate, ComponentContext } from '@teambit/generator';

import type { ModuleContextData } from './_parse';
import { parse } from './_parse';

import { indexFile } from './files/index-file';
import { componentFile } from './files/component-file';
import { docFile } from './files/doc-file';
import { testFile } from './files/test-file';
import { protocolIndexFile } from './files/protocol/index-file';
import { protocolSpecFile } from './files/protocol/spec-file';
import { protocolMergeFile } from './files/protocol/merge-file';
import { protocolAggreFile } from './files/protocol/aggre-file';
import { protocolApiFiles } from './files/protocol/apis/api-files';
import { implFile } from './files/impl/impl-file';
import { implMockFile } from './files/impl/mock-file';

const SCHEMA_PATH = ['.cache', 'micrc', 'schema'];

export const stateTemplate: ComponentTemplate = {
  name: 'micrc-web-state',
  description: '',
  generateFiles: (context: ComponentContext) => {
    const contextName = context.componentId.scope.split('.')[1];
    const typeName = 'states';
    const fileName = 'meta.json';
    const nodeModulesPath = path.resolve(
      require.resolve('@micrc/bit.generators.component.micrc-web'),
      '../../../../',
    );
    const metaPath = `${context.componentId.toStringWithoutVersion().replace(/\//g, '-')}`;
    const metaFilePath = path.resolve(
      nodeModulesPath, ...SCHEMA_PATH, contextName, typeName, metaPath, fileName,
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
        content: componentFile(),
      },
      // docs file
      {
        relativePath: `${context.name}.docs.mdx`,
        content: docFile(),
      },
      // test file
      {
        relativePath: `${context.name}.spec.tsx`,
        content: testFile(data),
      },
      // protocol index file
      {
        relativePath: 'protocol/index.ts',
        content: protocolIndexFile(),
      },
      // protocol spec file
      {
        relativePath: 'protocol/spec.ts',
        content: protocolSpecFile(data),
      },
      // protocol merge file
      {
        relativePath: 'protocol/merge.json',
        content: protocolMergeFile(data),
      },
      // protocol aggre file
      {
        relativePath: 'protocol/aggre.json',
        content: protocolAggreFile(data),
      },
      // protocol api files
      {
        relativePath: 'protocol/apis/readme',
        content: protocolApiFiles(data),
      },
      // impl file
      {
        relativePath: 'impl/impl.js',
        content: implFile(),
      },
      // impl mock file
      {
        relativePath: 'impl/mock.js',
        content: implMockFile(),
      },
    ];
  },
};
