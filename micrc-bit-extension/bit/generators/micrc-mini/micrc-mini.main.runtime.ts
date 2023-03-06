/**
 * micrc mini generator
 */
import { MainRuntime } from '@teambit/cli';
import { GeneratorMain, GeneratorAspect } from '@teambit/generator';
import { MicrcMiniAspect } from './micrc-mini.aspect';

export class MicrcMiniMain {
  static slots = [];

  static dependencies = [GeneratorAspect];

  static runtime = MainRuntime;

  static async provider([generator]: [GeneratorMain]) {
    if (generator) generator.registerComponentTemplate([]);

    return new MicrcMiniMain();
  }
}

MicrcMiniAspect.addRuntime(MicrcMiniMain);
