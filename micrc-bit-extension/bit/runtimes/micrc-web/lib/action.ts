/**
 * action lib
 * global, module, states, props
 */
import { notification } from 'antd';

import patcher from './json-patch';
import { integratePath } from '../store';
import { invoke, update, validate } from './operation';

export enum StoreScope {
  global, module, states, props, i18n, integrate, invalid, router,
}

export enum PatchOperationType {
  add,
  replace,
  remove,
  perform,
  verify,
  integrate,
}

export type PatchOperation = {
  op: string,
  path: string,
  value?: any,
};

const getValueByPointer = (
  pointer: string,
  globalStore: any,
  moduleStore: any,
  stateStore: any,
  propStore: any,
  router: any = null,
  id: string = '',
  fix: string = null,
) => {
  const [scope, path] = pointer.split('://'); // scope:integrate@switchPage
  if (!scope || !path) {
    throw Error('value is path must format of [scope]://[json pointer]');
  }
  if (scope.includes('@')) { // bind('integrate@switchPage:///url')
    const [fullScope, fullPath] = scope.split('@');
    if (fullScope === StoreScope[StoreScope.integrate]) {
      return patcher(globalStore.getState()).path(integratePath(router, id, pointer, fix));
    }
    if (fullScope === StoreScope[StoreScope.states]) {
      return patcher(stateStore).path(`/${fullPath}${path}`);
    }
  }
  if (scope === StoreScope[StoreScope.global]) {
    return patcher(globalStore.getState()).path(path);
  }
  if (scope === StoreScope[StoreScope.module]) {
    return patcher(moduleStore.getState()).path(path);
  }

  if (scope === StoreScope[StoreScope.props]) {
    return patcher(propStore).path(path);
  }
  throw Error('unexpected scope. "integrate, global, module, states, props" allowed');
};

const handleValue = (
  action: PatchOperation,
  globalStore: any, moduleStore: any, stateStore: any, propStore: any,
  inputs: any, inputPath: string,
  router: any = null,
  id: string = '',
  fix: string = null,
) => {
  const { value } = action;
  // 存在输入参数，优先取值
  if (inputPath) {
    return patcher(inputs).path(inputPath);
  }
  // 没有输入参数，那么检查action中的value是否是个pointer. states@xxx:///xxx
  if (typeof value === 'string' && value.includes('://')) {
    return getValueByPointer(
      value, globalStore, moduleStore, stateStore, propStore, router, id, fix,
    );
  }
  return value;
};

// 判断window存在，并且是default和local环境 , 再次刷新页面
const refreshPage = () => {
  if (typeof window !== 'undefined') {
    const env = process.env.APP_ENV;
    if (env && (env === 'local' || env === 'default')) {
      window.location.reload();
    }
  }
};

const handleRoute = (router: any, uri: any) => {
  if (!uri) {
    throw Error(`Illegal router path: ${uri}`);
  }
  const { redirectUri } = router.query;
  if (redirectUri) {
    window.location.replace(redirectUri);
  } else {
    router?.push(uri);
    refreshPage();
  }
};

const handleIntegrate = (
  _ctx: any, state: any, topicName: string, router: any, id: string, fix: any,
) => {
  let pageUri = '#';
  if (!fix) {
    pageUri = (router?.pathname || '#');
  }
  if (!id) { // 模块独立启动, 集成模拟器的使用
    const arr = topicName.split(':');
    // eslint-disable-next-line no-param-reassign, prefer-destructuring
    topicName = arr[0];
    // eslint-disable-next-line no-param-reassign, prefer-destructuring
    id = arr[2];
    // eslint-disable-next-line prefer-destructuring
    pageUri = arr[1];
  }
  const topic = state.integration[topicName];
  if (!topic) {
    throw Error(`Illegal topic: ${topicName}`);
  }
  // 校验生产方信息
  if (topic.producer.pageUri !== pageUri || topic.producer.moduleId !== id) {
    throw Error(`Illegal producer: ${JSON.stringify({ pageUri, moduleId: id })}`);
  }
  // 更新消费方状态
  Object.keys(topic.consumers).forEach((consumerId) => {
    const consumer = topic.consumers[consumerId];
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const consumerState = new Function(`return ${consumer.schema}`).call(_ctx);
    update(state, null, {
      op: 'replace',
      path: `/integration/${topicName}/consumers/${consumerId.replace(/\//g, '~1')}/state`,
      value: consumerState,
    });
  });
  // 如果消费方只有一个并且不是同一个页面, 且router存在, 进行跳转
  if (Object.keys(topic.consumers).length === 1) {
    const consumer: any = Object.values(topic.consumers)[0];
    if (consumer.pageUri !== pageUri) {
      router?.push(consumer.pageUri);
      refreshPage();
    }
  }
};

export const globalAction = (
  action: PatchOperation, path: string, globalStore: any, moduleStore: any, router: any = null, id: string = '', fix:string = null,
) => globalStore((state: any) => (inputs: any, inputPath: string) => {
  const input = handleValue(
    action, globalStore, moduleStore, null, null, inputs, inputPath, router, id, fix,
  );
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
    case PatchOperationType[PatchOperationType.integrate]:
      if (path.startsWith('/route')) {
        handleRoute(router, action.value || input);
      } else {
        handleIntegrate(action.value || input, state, path.replace('/', ''), router, id, fix);
      }
      break;
    default:
      throw Error('un-excepted operation for store of global. "add, replace, remove, integrate" allowed');
  }
});

export const moduleAction = (
  action: PatchOperation, path: string, globalStore: any, moduleStore: any, router: any = null, id: string = '', fix: string = null,
) => moduleStore((state: any) => async (inputs: any, inputPath: string) => {
  const input = handleValue(
    action, globalStore, moduleStore, null, null, inputs, inputPath, router, id, fix,
  );
  const newAction: PatchOperation = {
    ...action,
    path,
  };
  switch (action.op) {
    case PatchOperationType[PatchOperationType.perform]:
      try {
        await invoke(state, newAction);
      } catch (e) {
        const { config, message, description } = globalStore.getState().error;
        if (!config.custom) {
          notification.error({
            message: 'Oops! System Error. ',
            description: '',
          });
        } else {
          globalStore.setState({
            error: {
              message,
              description,
            },
          });
        }
      }
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
});

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
