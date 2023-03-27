/**
 * micrc web module template
 */
import fs from 'fs';

import { ComponentTemplate, ComponentContext } from '@teambit/generator';

import { handlePath } from '../../lib/schema-path';
import type { ModuleContextData } from './_parse';
import { parse } from './_parse';

import { indexFile } from './files/index-file';
import { componentFile } from './files/component-file';
import { storiesFile } from './files/stories-file';
import { testFile } from './files/test-file';
import { docFile } from './files/docs-file';
import { imageFiles } from './files/image-files';
import { i18nMetaFile } from './files/meta/i18n-meta-file';
import { compositionFile } from './files/composition-file';
import { integrationMetaFile } from './files/meta/integration-meta-file';
import { stateIndexFile } from './files/state/state-index-file';
import { stateImplFile } from './files/state/impl/impl-file';
import { stateMockFile } from './files/state/impl/mock-file';
import { stateProtocolIndexFile } from './files/state/protocol/index-file';
import { stateProtocolSpecFile } from './files/state/protocol/spec-file';
import { stateProtocolMergeFile } from './files/state/protocol/merge-file';
import { stateProtocolAggreFile } from './files/state/protocol/aggre-file';
import { stateProtocolApiFiles } from './files/state/protocol/api/api-files';

export const moduleTemplate: ComponentTemplate = {
  name: 'micrc-web-module',
  description: '',
  generateFiles: (context: ComponentContext) => {
    const { metaFilePath, metaBasePath } = handlePath(context);
    const data: ModuleContextData = parse(
      JSON.parse(fs.readFileSync(metaFilePath).toString()),
      context,
    );
    data.intro.metaBasePath = metaBasePath;
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
      // image files
      {
        relativePath: 'images/readme',
        content: imageFiles(data),
      },
      // integration meta file
      {
        relativePath: 'meta/integration.json',
        content: integrationMetaFile(data),
      },
      // dock file
      {
        relativePath: `${context.name}.docs.mdx`,
        content: docFile(data),
      },
      // state index file
      {
        relativePath: 'state/index.tsx',
        content: stateIndexFile(),
      },
      // impl file
      {
        relativePath: 'state/impl/impl.js',
        content: stateImplFile(),
      },
      // impl mock file
      {
        relativePath: 'state/impl/mock.js',
        content: stateMockFile(),
      },
      // protocol index file
      {
        relativePath: 'state/protocol/index.ts',
        content: stateProtocolIndexFile(),
      },
      // protocol spec file
      {
        relativePath: 'state/protocol/spec.ts',
        content: stateProtocolSpecFile(data),
      },
      // protocol merge file
      {
        relativePath: 'state/protocol/merge.json',
        content: stateProtocolMergeFile(data),
      },
      // protocol aggre file
      {
        relativePath: 'state/protocol/aggre.json',
        content: stateProtocolAggreFile(data),
      },
      // protocol api files
      {
        relativePath: 'state/protocol/apis/readme',
        content: stateProtocolApiFiles(data),
      },
    ];
  },
};
