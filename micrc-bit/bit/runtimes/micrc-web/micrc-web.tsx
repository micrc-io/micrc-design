/* eslint-disable no-await-in-loop */
/**
 * micrc runtime: bind and action
 */
import {
  StoreScope, PatchOperation, globalAction, moduleAction, statesAction, propsAction,
} from './lib/action';
import patcher from './lib/json-patch';

type LocalStore = {
  props?: any,
  states?: Record<string, any>,
};

type ModuleStore = {
  global?: any,
  module?: any,
  states?: Record<string, any>,
};

export const useModuleStore = (stores: ModuleStore) => {
  const {
    global, module, states,
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
    // 获取指定json pointer在scope(module or global)中的值，scope在path中指定global:///path
    // 如：const xxxBinding = bind('global:///json pointer path');
    bind: (bindingPath: string): any => {
      const [scope, path] = bindingPath.split('://');
      if (!scope || !path) {
        throw Error('binding path must format of [global|module|states]://[json pointer]');
      }
      if (scope === StoreScope[StoreScope.global]) {
        return global((state: any) => patcher(state).path(path));
      }
      if (scope === StoreScope[StoreScope.module]) {
        return module((state: any) => patcher(state).path(path));
      }
      if (scope === StoreScope[StoreScope.states]) {
        return patcher(stateStore).path(path);
      }
      throw Error('unexpected scope. "global, module, states" allowed');
    },
    // 包装一个函数，组合执行global,module,states的多个action，使用action的path前缀指明scope
    // 响应函数的arguments传入作为input，一组jsonpointer对应在input中为actions的value取值
    // 如：(a, b, c) => action1({a, b, c}, ['/a/path', null, '/c/path'])
    // 程序会分别使用三个路径对input取值，并应用于对应的action，其中第二个action不存在传入值，使用action中的
    action: (actions: Array<PatchOperation>) => async (inputs: any, paths: Array<string>) => {
      for (let idx = 0; idx < actions.length; idx += 1) {
        const action = actions[idx];
        const [fullScope, path] = action.path.split('://');
        // 当执行范围为global，可以执行add, replace, remove操作，表示更新global状态
        if (fullScope === StoreScope[StoreScope.global]) {
          globalAction(action, path, global, inputs, paths[idx]);
        } else if (fullScope === StoreScope[StoreScope.module]) {
          await moduleAction(action, path, module, inputs, paths[idx]);
        } else {
          execStatesAction(action, path, fullScope, inputs, paths[idx]);
        }
      }
    },
  };
};

export const useComponentStore = (stores: LocalStore) => {
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
      // 仅能对state进行修改，以及执行props中传入的函数
      for (let idx = 0; idx < actions.length; idx += 1) {
        const action = actions[idx];
        const [fullScope, path] = action.path.split('://');
        // 当执行范围为props，仅能存在perform操作，表示执行props中的函数
        if (fullScope === StoreScope[StoreScope.props]) {
          await propsAction(action, path, props, inputs, paths[idx]);
        } else { // 当执行范围为states，可以有add, replace, remove操作，表示更新state状态
          execStatesAction(
            fullScope, action, path,
            inputs || {}, // 当没有输入参数时，默认为空对象
            paths && paths.length === actions.length ? paths[idx] : '', // input取值json pointer数组存在，且与actions数量一致
          );
        }
      }
    },
  };
};
