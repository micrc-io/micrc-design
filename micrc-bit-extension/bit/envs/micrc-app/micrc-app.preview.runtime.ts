import { PreviewRuntime } from '@teambit/preview';
import { ReactAspect, ReactPreview } from '@teambit/react';

import { MicrcAppAspect } from './micrc-app.aspect';

export class MicrcAppPreviewMain {
  static runtime = PreviewRuntime;

  static dependencies = [ReactAspect];

  static async provider([react]: [ReactPreview]) {
    const micrcAppPreviewMain = new MicrcAppPreviewMain();
    react.registerProvider([]);
    return micrcAppPreviewMain;
  }
}

MicrcAppAspect.addRuntime(MicrcAppPreviewMain);
