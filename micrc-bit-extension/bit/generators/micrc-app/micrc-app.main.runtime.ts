/**
 * micrc app generator
 */
import { MainRuntime } from '@teambit/cli';
import { GeneratorMain, GeneratorAspect } from '@teambit/generator';
import { MicrcAppAspect } from './micrc-app.aspect';

export class MicrcAppMain {
  static slots = [];

  static dependencies = [GeneratorAspect];

  static runtime = MainRuntime;

  static async provider([generator]: [GeneratorMain]) {
    if (generator) generator.registerComponentTemplate([
    ]);
    return new MicrcAppMain();
  }
}

MicrcAppAspect.addRuntime(MicrcAppMain);
