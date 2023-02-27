/**
 * global store
 * i18n语言包，tracker埋点配置，token，integration
 */
import create from 'zustand';

export const useGlobalStore = create((set) => ({
  token: '',
  i18n: {},
  tracker: {},
  integration: {},
  set,
}));

export const initGlobalStore = (
  locale: string,
  i18n: any,
  tracker: any,
  integration: any,
) => {
  useGlobalStore.setState({
    i18n: {
      locale: locale || 'en',
      languages: i18n,
    },
    tracker,
    integration,
  });
};
