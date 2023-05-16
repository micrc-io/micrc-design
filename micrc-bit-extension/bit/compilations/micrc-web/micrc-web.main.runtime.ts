/**
 * micrc web compilations, for cli register
 */
import { MainRuntime, CLIAspect, CLIMain } from '@teambit/cli';
import { MicrcWebAspect } from './micrc-web.aspect';

import {
  ClearCmd,
  ConfigureCmd,
  GenerateCmd,
} from './commands';

export class MicrcWebMain {
  static slots = [];

  static dependencies = [CLIAspect];

  static runtime = MainRuntime;

  static async provider([cli]: [CLIMain]) {
    cli.registerGroup('micrc-web', 'Micrc configure');
    cli.register(
      new ConfigureCmd(),
      new GenerateCmd(),
      new ClearCmd(),
    );
    return new MicrcWebMain();
  }
}

MicrcWebAspect.addRuntime(MicrcWebMain);

export default MicrcWebMain;
