/**
 * micrc web component template
 */
import { ComponentTemplate, ComponentContext } from '@teambit/generator';

import { indexFile } from './files/index-file';

export const moduleTemplate: ComponentTemplate = {
  name: 'micrc-web-clientend',
  description: '',
  generateFiles: (context: ComponentContext) => {
    console.log('clientend template');
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
