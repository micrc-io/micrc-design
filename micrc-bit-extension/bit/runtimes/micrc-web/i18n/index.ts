/**
 * i18n工具库和支持组件
 */
import cloneDeep from 'lodash.clonedeep';

import { useGlobalStore } from '../store/global';

import patcher from '../lib/json-patch';

// 处理i18n取值path
export const keyPath = (state: any, router: any, id: string, bindingPath: string) => {
  if (!router) {
    return `/i18n/languages/${state.i18n.locale}${bindingPath.replace('i18n://', '')}`;
  }
  const pagePath = (router.pathname || '#').replace(/\//g, '~1');
  const modulePath = (id || '#').replace(/\//g, '~1');
  return `/i18n/languages/${state.i18n.locale}/${pagePath}/${modulePath}${bindingPath.replace('i18n://', '')}`;
};

// 处理远程状态中有i18n点位
export const replaceKey = (obj: any) => {
  if (typeof obj === 'string') {
    if (obj.startsWith('i18n://')) {
      return useGlobalStore((state: any) => patcher(state).path(obj.replace('i18n://', '')));
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((it) => replaceKey(it));
  }
  if (typeof obj === 'object') {
    const retVal = {};
    Object.keys(obj).forEach((it) => {
      const item = obj[it];
      retVal[it] = replaceKey(item);
    });
    return retVal;
  }
  return obj;
};

// 处理i18n值中存在占位符, 也就是i18n的值是模版字符串
export const templateValue = (dataContext: any, tmpl: any) => {
  if (!dataContext) {
    return tmpl;
  }
  if (typeof tmpl === 'string') {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return new Function(`return \`${tmpl}\``).call(dataContext);
  }
  if (Array.isArray(tmpl)) {
    return tmpl.map((it) => templateValue(dataContext, it));
  }
  const retVal = cloneDeep(tmpl);
  if (typeof tmpl === 'object') {
    Object.keys(tmpl).forEach((key) => {
      // eslint-disable-next-line no-param-reassign
      retVal[key] = templateValue(dataContext, tmpl[key]);
    });
  }
  return retVal;
};

export { I18NHighlight, I18NVisibleProxy } from './i18n';
