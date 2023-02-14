import { MainRuntime } from '@teambit/cli';
import { MicrcAppAspect } from './micrc-app.aspect';

export class MicrcAppMain {
  // your aspect API goes here.
  getSomething() {}

  static slots = [];
  // define your aspect dependencies here. 
  // in case you need to use another aspect API.
  static dependencies = [];

  static runtime = MainRuntime;

  static async provider() {
    return new MicrcAppMain();
  }
}

MicrcAppAspect.addRuntime(MicrcAppMain);
