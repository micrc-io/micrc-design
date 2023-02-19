/**
 * action lib
 * global, module, states, props
 */
import patcher from './json-patch';
import { invoke, update, validate } from './operation';

export enum StoreScope {
  global, module, states, props,
}

export enum PatchOperationType {
  add,
  replace,
  remove,
  perform,
  verify,
}

export type PatchOperation = {
  op: string,
  path: string,
  value?: any,
};

const getValueByPointer = (
  pointer: string, globalStore: any, moduleStore: any, stateStore: any, propStore: any,
) => {
  const [scope, path] = pointer.split('://');
  if (!scope || !path) {
    throw Error('value is path must format of [scope]://[json pointer]');
  }
  if (scope === StoreScope[StoreScope.global]) {
    return patcher(globalStore.getState()).path(path);
  }
  if (scope === StoreScope[StoreScope.module]) {
    return patcher(moduleStore.getState()).path(path);
  }
  if (scope === StoreScope[StoreScope.states]) {
    return patcher(stateStore).path(path);
  }
  if (scope === StoreScope[StoreScope.props]) {
    return patcher(propStore).path(path);
  }
  throw Error('unexpected scope. "global, module, states, props" allowed');
};

const handleValue = (
  action: PatchOperation,
  globalStore: any, moduleStore: any, stateStore: any, propStore: any,
  inputs: any, inputPath: string,
) => {
  const { value } = action;
  // 存在输入参数，优先取值
  if (inputPath) {
    return patcher(inputs).path(inputPath);
  }
  // 没有输入参数，那么检查action中的value是否是个pointer. states@xxx:///xxx
  if (typeof value === 'string' && value.includes('://')) {
    return getValueByPointer(value, globalStore, moduleStore, stateStore, propStore);
  }
  return value;
};

export const globalAction = (
  action: PatchOperation, path: string, globalStore: any, inputs: any, inputPath: string,
) => {
  globalStore((state: any) => () => {
    const input = handleValue(action, globalStore, null, null, null, inputs, inputPath);
    const newAction: PatchOperation = {
      ...action,
      path,
    };
    switch (action.op) {
      case PatchOperationType[PatchOperationType.add]:
      case PatchOperationType[PatchOperationType.replace]:
      case PatchOperationType[PatchOperationType.remove]:
        update(state, input, newAction);
        break;
      default:
        throw Error('un-excepted operation for store of global. "add, replace, remove" allowed');
    }
  })();
};

export const moduleAction = async (
  action: PatchOperation, path: string, moduleStore: any, inputs: any, inputPath: string,
) => {
  await moduleStore((state: any) => async () => {
    const input = handleValue(action, moduleStore, null, null, null, inputs, inputPath);
    const newAction: PatchOperation = {
      ...action,
      path,
    };
    switch (action.op) {
      case PatchOperationType[PatchOperationType.perform]:
        await invoke(state, newAction);
        break;
      case PatchOperationType[PatchOperationType.verify]:
        validate(state, input, newAction);
        break;
      case PatchOperationType[PatchOperationType.add]:
      case PatchOperationType[PatchOperationType.replace]:
      case PatchOperationType[PatchOperationType.remove]:
        update(state, input, newAction);
        break;
      default:
        throw Error('un-excepted operation for store of module. "add, replace, remove, perform, verify" allowed');
    }
  })();
};

export const statesAction = (
  action: PatchOperation, path: string,
  states: Record<string, any>, stateName: string, stateStore: any,
  inputs: any, inputPath: string,
) => {
  if (!Object.keys(states).includes(stateName)) {
    throw Error('un-excepted state named: "subScope"');
  }
  const [state, setState] = states[stateName];
  const value = handleValue(action, null, null, stateStore, null, inputs, inputPath);
  const newAction: PatchOperation = {
    ...action,
    path,
    value,
  };
  switch (action.op) {
    case PatchOperationType[PatchOperationType.add]:
    case PatchOperationType[PatchOperationType.replace]:
    case PatchOperationType[PatchOperationType.remove]:
      setState(patcher().apply(state, [newAction]));
      break;
    default:
      throw Error('un-excepted operation for store of states. "add, replace, remove" allowed');
  }
};

export const propsAction = async (
  action: PatchOperation, path: string, props: any, inputs: any, inputPath: string,
) => {
  if (action.op !== PatchOperationType[PatchOperationType.perform]) {
    throw Error('un-excepted operation for store of states. "perform" allowed');
  }
  const func = patcher(props).path(path);
  const value = handleValue(action, null, null, null, props, inputs, inputPath);
  await func(value);
};
