/**
 * micrc runtime: bind and action
 */
import { useGlobalStore } from './store/global';

import patcher from './lib/json-patch';
import { keyPath, replaceKey } from './lib/i18n';

import {
  StoreScope, PatchOperation, globalAction, moduleAction, statesAction, propsAction,
} from './lib/action';

type LocalStore = {
  props?: any,
  states?: Record<string, any>,
};

type ModuleStore = {
  module?: any,
  states?: Record<string, any>,
};

export const moduleStore = (stores: ModuleStore, router: any, id: string) => {
  const {
    module, states,
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
      const [scope, stateName] = fullScope.split('@');
      if (!scope || !stateName) {
        throw Error('state scope of binding path must format of [states@stateName]://[json pointer]');
      }
      if (scope === StoreScope[StoreScope.states]) {
        return patcher(stateStore).path(`/${stateName}${path}`);
      }
      throw Error('unexpected scope. "global, module, states, i18n" allowed');
    },
    action: (action: PatchOperation) => {
      const [fullScope, path] = action.path.split('://');
      if (!fullScope || !path) {
        throw Error('action path must format of [global|module|states]://[json pointer]');
      }
      // ??????????????????global???????????????add, replace, remove?????????????????????global??????
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

export const innerStore = (stores: LocalStore) => {
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
    bind: (bindingPath: string) => {
      const [fullScope, path] = bindingPath.split('://');
      if (!fullScope || !path) {
        throw Error('path of binding must format of [states@stateName|props]://[json pointer]');
      }
      if (fullScope === StoreScope[StoreScope.props]) {
        return patcher(props).path(path);
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
      inputs?: Record<string, any>, paths?: Array<string>,
    ) => {
      // ?????????state???????????????????????????props??????????????????
      for (let idx = 0; idx < actions.length; idx += 1) {
        const action = actions[idx];
        const [fullScope, path] = action.path.split('://');
        // ??????????????????props???????????????perform?????????????????????props????????????
        if (fullScope === StoreScope[StoreScope.props]) {
          // eslint-disable-next-line no-await-in-loop
          await propsAction(action, path, props, inputs, paths[idx]);
        } else { // ??????????????????states????????????add, replace, remove?????????????????????state??????
          execStatesAction(
            fullScope, action, path,
            inputs || {}, // ?????????????????????????????????????????????
            paths && paths.length === actions.length ? paths[idx] : '', // input??????json pointer?????????????????????actions????????????
          );
        }
      }
    },
  };
};
