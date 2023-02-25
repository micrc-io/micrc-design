/**
 * global store
 * i18n语言包，tracker埋点配置，token，integration
 */
import create from 'zustand';

export const useGlobalStore = create((set) => ({
  token: null,
  i18n: {
    locale: 'en', // 本地化
    languages: {
      zh: {
        '/xx/xx/x': { // 页面uri
          'micrc.bit/xxx/xx': { // 模块id
            'xxx.xxx': '样例文本', // key: value
          },
        },
      },
      'zh-tw': {
        '/xx/xx/x': { // 页面uri
          'micrc.bit/xxx/xx': { // 模块id
            'xxx.xxx': '樣例文本', // key: value
          },
        },
      },
      en: {
        '/xx/xx/x': { // 页面uri
          'micrc.bit/xxx/xx': { // 模块id
            'xxx.xxx': 'examples', // key: value
          },
        },
      },
    },
  },
  tracker: null,
  integration: {
    topic1: {
      producer: {
        uri: '/xxx/xx/x',
        id: 'micrc.bit/xxx/xx',
        schema: {},
      },
      consumers: [
        {
          uri: '/yyy/yy/y',
          id: 'micrc.bit/yyy/yy',
          schema: '{}',
          state: {},
        },
        {
          uri: '/zzz/zz/z',
          id: 'micrc.bit/zzz/zz',
          schema: '{}',
          state: {},
        },
      ],
    },
    topic2: {
      producer: {
        uri: '/xxx1/xx1/x1',
        id: 'micrc.bit/xxx1/xx1',
        schema: {},
      },
      consumer: {
        uri: '/yyy1/yy1/y1',
        id: 'micrc.bit/yyy1/yy1',
        schema: '{}',
        state: {},
      },
    },
  },
  set,
}));

export const initGlobalStore = (
  locale: string,
  i18n: Record<string, Record<string, Record<string, Record<string, string>>>>,
  integration: Record<string, {
    producer: { uri: string, id: string, schema: object },
    consumers?: Array<{ uri: string, id: string, schema: string, state: object }>,
    consumer?: { uri: string, id: string, schema: string, state: object },
  }>,
) => {
  useGlobalStore.setState({ i18n: { locale, languages: i18n }, integration });
};
