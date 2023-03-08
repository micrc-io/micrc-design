/**
 * i18n处理工具
 */
import { useGlobalStore } from '../store/global';

import patcher from './json-patch';

export const keyPath = (state: any, router: any, id: string, bindingPath: string) => {
  if (!router) {
    return `/i18n/languages/${state.i18n.locale}${bindingPath.replace('i18n://', '')}`;
  }
  return `/i18n/languages/${state.i18n.locale}/${router.pathname || '#'}/${id || '#'}/${bindingPath.replace('i18n://', '')}`;
};

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
