/**
 * micrc web atom component template
 */
import { ComponentTemplate, ComponentContext } from '@teambit/generator';

import { indexFile } from './files/index-file';

export const moduleTemplate: ComponentTemplate = {
  name: 'micrc-web-atom',
  description: '',
  generateFiles: (context: ComponentContext) => {
    console.log('atom template');
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
