/**
 * micrc web component template
 */
import fs from 'fs';

import { ComponentTemplate, ComponentContext } from '@teambit/generator';

import { handlePath } from '../../lib/schema-path';
import type { ComponentContextData } from './_parse';
import { parse } from './_parse';

import { indexFile } from './files/index-file';
import { componentFile } from './files/component-file';
import { docFile } from './files/doc-file';
import { testFile } from './files/test-file';
import { storiesFile } from './files/stories-file';
import { compositionFile } from './files/composition-file';

export const componentTemplate: ComponentTemplate = {
  name: 'micrc-web-component',
  description: 'test for micrc web',
  generateFiles: (context: ComponentContext) => {
    const { metaFilePath, metaBasePath } = handlePath(context);
    const data: ComponentContextData = parse(
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
