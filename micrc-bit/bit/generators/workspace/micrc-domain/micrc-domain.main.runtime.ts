import { MainRuntime } from '@teambit/cli';
import { GeneratorMain, GeneratorAspect } from '@teambit/generator';
import { MicrcDomainAspect } from './micrc-domain.aspect';
import { workspaceTemplate } from './template';

export class MicrcDomainMain {
  static slots = [];

  static dependencies = [GeneratorAspect];

  static runtime = MainRuntime;

  static async provider([generator]: [GeneratorMain]) {
    generator.registerWorkspaceTemplate([workspaceTemplate]);
    return new MicrcDomainMain();
  }
}

MicrcDomainAspect.addRuntime(MicrcDomainMain);
