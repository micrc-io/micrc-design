/**
 * global store
 * i18n语言包，tracker埋点配置，token，integration
 */
import create from 'zustand';

export const useGlobalStore = create((set) => ({
  token: null,
  i18n: null,
  tracker: null,
  integration: null,
  set,
}));
