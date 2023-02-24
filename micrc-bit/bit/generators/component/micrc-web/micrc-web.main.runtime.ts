/**
 * micrc web generator
 */
import { MainRuntime } from '@teambit/cli';
import { GeneratorMain, GeneratorAspect } from '@teambit/generator';
import { MicrcWebAspect } from './micrc-web.aspect';

import { componentTemplate } from './templates/component';
import { moduleTemplate } from './templates/module';
import { clientendTemplate } from './templates/clientend';
import { stateTemplate } from './templates/state';
import { atomTemplate } from './templates/atom';

export class MicrcWebMain {
  static slots = [];

  static dependencies = [GeneratorAspect];

  static runtime = MainRuntime;

  static async provider([generator]: [GeneratorMain]) {
    generator.registerComponentTemplate([
      atomTemplate,
      componentTemplate,
      stateTemplate,
      moduleTemplate,
      clientendTemplate,
    ]);
    return new MicrcWebMain();
  }
}

MicrcWebAspect.addRuntime(MicrcWebMain);
