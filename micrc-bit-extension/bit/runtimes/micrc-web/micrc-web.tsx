/**
 * micrc runtime: bind and action
 */
import { useGlobalStore } from './store/global';

import patcher from './lib/json-patch';

import { keyPath, replaceKey, templateValue } from './i18n';
import { integratePath } from './store';

import {
  StoreScope, PatchOperation, PatchOperationType,
  globalAction, moduleAction, statesAction, propsAction,
} from './lib/action';

type LocalStore = {
  props?: any,
  states?: Record<string, any>,
};

type ModuleStore = {
  module?: any,
  states?: Record<string, any>,
};

export const remoteStore = (
  stores: ModuleStore, router: any, id: string,
) => {
  const {
    module = {}, states = {},
  } = stores;
  const stateStore = {};
  Object.keys(states).forEach((it) => {
    // eslint-disable-next-line prefer-destructuring
    stateStore[it] = states[it][0];
  });
  const execStatesAction = (
    action: PatchOperation, path: string, fullScope: string, inputs: any, inputPath: any,
  ) => {
    if (!fullScope.includes('@')) {
      throw Error('states scope must format of "states@stateName"');
    }
    const [scope, subScope] = fullScope.split('@');
    if (scope === StoreScope[StoreScope.states]) {
      statesAction(action, path, states, subScope, stateStore, inputs, inputPath);
    } else {
      throw Error('un-excepted scope. "global, module, states" allowed');
    }
  };
  return {
    subscribe: (topic: string, listener: () => any) => useGlobalStore.subscribe(
      (state: any) => patcher(state).path(integratePath(router, id, `integrate@${topic}:///`)),
      listener,
      { fireImmediately: true },
    ),
    appendState: (stateObj : object) => {
      Object.keys(stateObj).forEach((it) => {
        states[it] = stateObj[it];
        // eslint-disable-next-line prefer-destructuring
        stateStore[it] = stateObj[it][0];
      });
    },
    bind: (bindingPath: string): any => {
      const [fullScope, path] = bindingPath.split('://');
      if (!fullScope || !path) {
        throw Error('binding path must format of [global|module|states|i18n]://[json pointer]');
      }
      if (fullScope === StoreScope[StoreScope.global]) {
        return useGlobalStore((state: any) => patcher(state).path(path));
      }
      if (fullScope === StoreScope[StoreScope.module]) {
        return replaceKey(module((state: any) => patcher(state).path(path)));
      }
      if (fullScope === StoreScope[StoreScope.i18n]) {
        return useGlobalStore(
          (state: any) => patcher(state).path(keyPath(state, router, id, bindingPath)),
        );
      }
      if (fullScope === StoreScope[StoreScope.integrate]) {
        return useGlobalStore(
          (state: any) => patcher(state).path(integratePath(router, id, bindingPath)),
        );
      }
      const [scope, subScope] = fullScope.split('@');
      if (!scope || !subScope) {
        throw Error('state scope of binding path must format of [states@stateName|integrate@topic]://[json pointer]');
      }
      if (scope === StoreScope[StoreScope.integrate]) {
        return useGlobalStore(
          (state: any) => patcher(state).path(integratePath(router, id, bindingPath)),
        );
      }
      if (scope === StoreScope[StoreScope.states]) {
        return patcher(stateStore).path(`/${subScope}${path}`);
      }
      throw Error('unexpected scope. "global, module, states, i18n, integrate" allowed');
    },
    action: (action: PatchOperation) => {
      if (action.op === PatchOperationType[PatchOperationType.integrate]) {
        return globalAction(action, action.path, useGlobalStore, router, id);
      }
      const [fullScope, path] = action.path.split('://');
      if (!fullScope || !path) {
        throw Error('action path must format of [global|module|states]://[json pointer]');
      }
      // 当执行范围为global，可以执行add, replace, remove操作，表示更新global状态
      if (fullScope === StoreScope[StoreScope.global]) {
        return globalAction(action, path, useGlobalStore);
      }
      if (fullScope === StoreScope[StoreScope.module]) {
        return moduleAction(action, path, module);
      }
      return (inputs: object, inputPath: string) =>
        execStatesAction(action, path, fullScope, inputs, inputPath);
    },
  };
};

export const localStore = (stores: LocalStore) => {
  const {
    props, states,
  } = stores;
  const stateStore = {};
  Object.keys(states).forEach((it) => {
    // eslint-disable-next-line prefer-destructuring
    stateStore[it] = states[it][0];
  });
  const execStatesAction = (
    fullScope: string, action: PatchOperation, path: string,
    inputs: Record<string, any>, inputPath: string,
  ) => {
    const [scope, stateName] = fullScope.split('@');
    if (!scope || !stateName) {
      throw Error('states scope of action path must format of "[states@stateName]://[json pointer]');
    }
    if (scope === StoreScope[StoreScope.states]) {
      statesAction(
        action, path, states,
        stateName, stateStore,
        inputs,
        inputPath,
      );
    } else {
      throw Error('un-excepted scope. "props, states" allowed');
    }
  };
  return {
    appendState: (stateObj : object) => {
      Object.keys(stateObj).forEach((it) => {
        states[it] = stateObj[it];
        // eslint-disable-next-line prefer-destructuring
        stateStore[it] = stateObj[it][0];
      });
    },
    bind: (bindingPath: string) => {
      const [fullScope, path] = bindingPath.split('://');
      if (!fullScope || !path) {
        throw Error('path of binding must format of [states@stateName|props]://[json pointer]');
      }
      if (fullScope === StoreScope[StoreScope.props]) {
        const [realPath, dataContextPath] = path.split('@');
        if (!realPath || !dataContextPath) { // 没有数据上下文
          return patcher(props).path(path);
        }
        const tmpl = patcher(props).path(realPath);
        const dataContext = patcher(props).path(dataContextPath);
        return templateValue(dataContext, tmpl);
      }
      const [scope, stateName] = fullScope.split('@');
      if (!scope || !stateName) {
        throw Error('state scope of binding path must format of [states@stateName]://[json pointer]');
      }
      if (scope === StoreScope[StoreScope.states]) {
        return patcher(stateStore).path(`/${stateName}${path}`);
      }
      throw Error('unexpected scope. "states, props" allowed');
    },
    action: (actions: Array<PatchOperation>) => async (
      inputs: Record<string, any> = {}, paths: Array<string> = [],
    ) => {
      // 仅能对state进行修改，以及执行props中传入的函数
      for (let idx = 0; idx < actions.length; idx += 1) {
        const action = actions[idx];
        const [fullScope, path] = action.path.split('://');
        // 当执行范围为props，仅能存在perform操作，表示执行props中的函数
        if (fullScope === StoreScope[StoreScope.props]) {
          // eslint-disable-next-line no-await-in-loop
          await propsAction(action, path, props,
            inputs,
            paths.length === actions.length ? paths[idx] : null);
        } else { // 当执行范围为states，可以有add, replace, remove操作，表示更新state状态
          execStatesAction(
            fullScope, action, path,
            inputs,
            paths.length === actions.length
              ? paths[idx] : null, // input取值json pointer数组存在，且与actions数量一致
          );
        }
      }
    },
  };
};
