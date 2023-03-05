import { MainRuntime } from '@teambit/cli';
import { GeneratorMain, GeneratorAspect } from '@teambit/generator';
import { MicrcSystemAspect } from './micrc-system.aspect';
import { workspaceTemplate } from './template';

export class MicrcSystemMain {
  static slots = [];

  static dependencies = [GeneratorAspect];

  static runtime = MainRuntime;

  static async provider([generator]: [GeneratorMain]) {
    generator.registerWorkspaceTemplate([workspaceTemplate]);
    return new MicrcSystemMain();
  }
}

MicrcSystemAspect.addRuntime(MicrcSystemMain);
