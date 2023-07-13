/**
 * micrc web atom component template
 */
import fs from 'fs';

import { ComponentTemplate, ComponentContext } from '@teambit/generator';

import { handlePath } from '../../lib/schema-path';
import type { AtomContextData } from './_parse';
import { parse } from './_parse';

import { indexFile } from './files/index-file';
import { componentFile } from './files/component-file';
import { storiesFile } from './files/stories-file';
import { testFile } from './files/test-file';
import { docsFile } from './files/docs-file';
import { compositionFile } from './files/composition-file';
import { cssFile } from './files/css-file';

export const atomTemplate: ComponentTemplate = {
  name: 'micrc-web-atom',
  description: '',
  generateFiles: (context: ComponentContext) => {
    const { metaFilePath, metaBasePath } = handlePath(context);
    const data: AtomContextData = parse(
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
        content: testFile(data),
      },
      // doc.mdx
      {
        relativePath: `${context.name}.docs.mdx`,
        content: docsFile(data),
      },
      // css file
      {
        relativePath: `${context.name}.module.scss`,
        content: cssFile(data),
      },
    ];
  },
};
