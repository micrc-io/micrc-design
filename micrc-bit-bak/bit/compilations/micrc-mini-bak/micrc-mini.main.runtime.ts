import { MainRuntime } from '@teambit/cli';
import { MicrcMiniAspect } from './micrc-mini.aspect';

export class MicrcMiniMain {
  // your aspect API goes here.
  getSomething() {}

  static slots = [];
  // define your aspect dependencies here. 
  // in case you need to use another aspect API.
  static dependencies = [];

  static runtime = MainRuntime;

  static async provider() {
    return new MicrcMiniMain();
  }
}

MicrcMiniAspect.addRuntime(MicrcMiniMain);
