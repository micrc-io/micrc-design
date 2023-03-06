/**
 * preview runtime
 * register provider
 */
import { PreviewRuntime } from '@teambit/preview';
import { ReactAspect, ReactPreview } from '@teambit/react';

import { MicrcMiniAspect } from './micrc-mini.aspect';

import { TaroH5Provider } from './providers/taro-h5-provider';

export class MicrcMiniPreviewMain {
  static runtime = PreviewRuntime;

  static dependencies = [ReactAspect];

  static async provider([react]: [ReactPreview]) {
    const micrcMiniPreviewMain = new MicrcMiniPreviewMain();
    react.registerProvider([TaroH5Provider]);
    return micrcMiniPreviewMain;
  }
}

MicrcMiniAspect.addRuntime(MicrcMiniPreviewMain);
