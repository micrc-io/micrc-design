/**
 * micrc mini compilations, for cli register
 */
import { MainRuntime, CLIAspect, CLIMain } from '@teambit/cli';
import { MicrcMiniAspect } from './micrc-mini.aspect';

export class MicrcMiniMain {
  static slots = [];

  static dependencies = [CLIAspect];

  static runtime = MainRuntime;

  static async provider([cli]: [CLIMain]) {
    cli.registerGroup('micrc-mini', 'Micrc mini configure');
    cli.register();
    return new MicrcMiniMain();
  }
}

MicrcMiniAspect.addRuntime(MicrcMiniMain);

export default MicrcMiniMain;
