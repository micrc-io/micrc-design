/**
 * copy msw service worker to artifact/env-template of micrc-web, micrc-mini, micrc-app envs
 */
import { MainRuntime } from '@teambit/cli';
import { BuilderMain, BuilderAspect } from '@teambit/builder';

import { MicrcMswServiceWorkerTask } from './tasks/msw-service-worker.task';
import { BitMicrcMswAspect } from './bit-micrc-msw.aspect';

export class BitMicrcMswMain {
  static dependencies = [BuilderAspect];

  static runtime = MainRuntime;

  static async provider([builder]: [BuilderMain]) {
    builder.registerBuildTasks([new MicrcMswServiceWorkerTask(BitMicrcMswAspect.id)]);
    return new BitMicrcMswMain();
  }
}

BitMicrcMswAspect.addRuntime(BitMicrcMswMain);

export default BitMicrcMswMain;
