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
  // 客户端--i18n:///username.label
  const pagePath = (router.pathname || '#').replace(/\//g, '~1');
  const modulePath = (id || '#').replace(/\//g, '~1');
  return `/i18n/languages/${state.i18n.locale}/${pagePath}/${modulePath}${bindingPath.replace('i18n://', '')}`;
};

// 处理远程状态中有i18n点位
export const replaceKey = (obj: any) => {
  if (typeof obj === 'string') {
    if (obj.startsWith('i18n://')) {
      const state: any = useGlobalStore.getState();
      const patchers = patcher(state);
      //  服务端  i18n:///aggregation:model|#:username.message
      const keys = obj.replace('i18n:///', '').split(':');
      if (keys.length === 3) {
        const [aggregation, model, key] = keys;
        return patchers.path(`/i18n/languages/${state.i18n.locale}/${aggregation}/${model}/${key}`);
      }
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((it) => replaceKey(it));
  }
  if (typeof obj === 'object') {
    const retVal = {};
    if (!obj) return null;
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

// 处理i18n 非节点 字符串符/数组的高亮显示  ----   I18NHighlight无法处理字符串,只能处理ReactElement
// eslint-disable-next-line consistent-return
export const i18nHightLight = (obj: any) => {
  const { textPropName, pointerText, currentKey, target } = obj;
  // table   Select --- 处理数组
  if (Array.isArray(target)) {
    const retVal = cloneDeep(target);
    // eslint-disable-next-line array-callback-return
    retVal.forEach((item: any) => {
      // eslint-disable-next-line no-param-reassign
      item[textPropName] = item.key === currentKey ? `i18n:{ ${item[textPropName]} }` : item[textPropName];
    });
    return retVal;
  }
  if (typeof target === 'string') {
    const highlight = `${pointerText.id}/${pointerText.key}` === currentKey;
    return highlight ? `i18n:{ ${pointerText.str} }` : pointerText.str;
  }
};

export { I18NHighlight, I18NVisibleProxy } from './i18n';
