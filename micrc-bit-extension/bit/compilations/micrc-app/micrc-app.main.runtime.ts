/**
 * micrc app compilations, for cli register
 */
import { MainRuntime, CLIAspect, CLIMain } from '@teambit/cli';
import { MicrcAppAspect } from './micrc-app.aspect';

export class MicrcAppMain {
  static slots = [];

  static dependencies = [CLIAspect];

  static runtime = MainRuntime;

  static async provider([cli]: [CLIMain]) {
    cli.registerGroup('micrc-app', 'Micrc app configure');
    cli.register();
    return new MicrcAppMain();
  }
}

MicrcAppAspect.addRuntime(MicrcAppMain);

export default MicrcAppMain;
