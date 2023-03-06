import { PreviewRuntime } from '@teambit/preview';
import { ReactAspect, ReactPreview } from '@teambit/react';

import { MicrcWebAspect } from './micrc-web.aspect';

export class MicrcWebPreviewMain {
  static runtime = PreviewRuntime;

  static dependencies = [ReactAspect];

  static async provider([react]: [ReactPreview]) {
    const micrcWebPreviewMain = new MicrcWebPreviewMain();
    react.registerProvider([]);
    return micrcWebPreviewMain;
  }
}

MicrcWebAspect.addRuntime(MicrcWebPreviewMain);
