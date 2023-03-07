/**
 * micrc web generator
 */
import { MainRuntime } from '@teambit/cli';
import { GeneratorMain, GeneratorAspect } from '@teambit/generator';
import { MicrcWebAspect } from './micrc-web.aspect';

import { atomTemplate } from './templates/atom';
import { componentTemplate } from './templates/component';
import { moduleTemplate } from './templates/module';
import { clientendTemplate } from './templates/clientend';

export class MicrcWebMain {
  static slots = [];

  static dependencies = [GeneratorAspect];

  static runtime = MainRuntime;

  static async provider([generator]: [GeneratorMain]) {
    if (generator) {
      generator.registerComponentTemplate([
        atomTemplate,
        componentTemplate,
        moduleTemplate,
        clientendTemplate,
      ]);
    }

    return new MicrcWebMain();
  }
}

MicrcWebAspect.addRuntime(MicrcWebMain);
