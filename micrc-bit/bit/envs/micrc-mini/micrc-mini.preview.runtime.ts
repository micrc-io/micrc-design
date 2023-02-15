/**
 * preview runtime
 * register provider
 */
import { PreviewRuntime } from '@teambit/preview';
import { ReactAspect, ReactPreview } from '@teambit/react';
// uncomment the line below and install the theme if you want to use our theme or create your own and import it here
// import { ThemeCompositions } from '@teambit/documenter.theme.theme-compositions';

import { MicrcMiniAspect } from './micrc-mini.aspect';

import { TaroH5Provider } from './providers/taro-h5-provider';

export class MicrcMiniPreviewMain {
  static runtime = PreviewRuntime;

  static dependencies = [ReactAspect];

  static async provider([react]: [ReactPreview]) {
    const micrcMiniPreviewMain = new MicrcMiniPreviewMain();
    // uncomment the line below to register a new provider
    // to wrap all compositions using this environment with a custom theme.
    react.registerProvider([TaroH5Provider]);
    return micrcMiniPreviewMain;
  }
}

MicrcMiniAspect.addRuntime(MicrcMiniPreviewMain);
