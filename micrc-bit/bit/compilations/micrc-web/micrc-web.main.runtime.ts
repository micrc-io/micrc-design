
import { MainRuntime, CLIAspect, CLIMain } from '@teambit/cli';
import { MicrcWebAspect } from './micrc-web.aspect';

import {
  MicrcSyncCmd, MicrcGenCmd, MicrcRunningCmd, MicrcLocalRunningCmd,
} from './commands';

export class MicrcWebMain {
  static slots = [];

  static dependencies = [CLIAspect];

  static runtime = MainRuntime;

  static async provider([cli]: [CLIMain]) {
    cli.registerGroup('micrc', 'Micrc configure');
    cli.register(
      new MicrcSyncCmd(),
      new MicrcGenCmd(),
      new MicrcRunningCmd(),
      new MicrcLocalRunningCmd(),
    );
    return new MicrcWebMain();
  }
}

MicrcWebAspect.addRuntime(MicrcWebMain);
