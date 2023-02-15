/**
 * micrc web component template
 */
import { ComponentTemplate, ComponentContext } from '@teambit/generator';

import { indexFile } from './files/index-file';

export const moduleTemplate: ComponentTemplate = {
  name: 'micrc-web-module',
  description: '',
  generateFiles: (context: ComponentContext) => {
    console.log('module template');
    return [
      // index file
      {
        relativePath: 'index.ts',
        isMain: true,
        content: indexFile(context),
      },
    ];
  },
};
