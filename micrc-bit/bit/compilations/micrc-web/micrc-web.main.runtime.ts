/**
 * micrc命令注册
 */
import { MainRuntime, CLIAspect, CLIMain } from '@teambit/cli';
import { MicrcWebAspect } from './micrc-web.aspect';

import {
  ConfigureCmd, GenerateCmd,
} from './commands';

export class MicrcWebMain {
  static slots = [];

  static dependencies = [CLIAspect];

  static runtime = MainRuntime;

  static async provider([cli]: [CLIMain]) {
    cli.registerGroup('micrc', 'Micrc configure');
    cli.register(
      new ConfigureCmd(),
      new GenerateCmd(),
    );
    return new MicrcWebMain();
  }
}

MicrcWebAspect.addRuntime(MicrcWebMain);
