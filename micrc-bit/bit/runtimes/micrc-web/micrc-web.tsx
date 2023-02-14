/**
 * micrc runtime: bind and action
 */
import patcher from './lib/json-patch';
import { invoke, update, validate } from './lib/action';

/**
 * 使用json-pointer绑定状态值
 *
 * @param useStore 模块/集成状态hook，组件中引入模块状态/集成状态得到
 * @returns 通过json-pointer获取状态值的函数
 */
// eslint-disable-next-line max-len
export const bind = (useStore: any) => (jsonpointer: string) => useStore((state: any) => patcher(state).path(jsonpointer));

/**
 * 使用json-path/json-patches获取/修改模块状态，主要用于模块给功能组件或通用组件绑定模块的状态或行为
 *
 * @param useStore 模块/集成状态hook，通过引入模块状态得到
 * @return 使用json-path委托useStore获取数据/执行json-patches表达的状态修改
 */
export const action = (useStore: any) => (jsonpatch: any[]) => {
  if (Array.isArray(jsonpatch)) {
    return useStore((state: any) => async (input: any) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const patch of jsonpatch) {
        switch (patch.op) {
          case 'invoke':
            // eslint-disable-next-line no-await-in-loop
            await invoke(state, patch);
            break;
          case 'validate':
            validate(state, input, patch);
            break;
          default:
            update(state, input, patch);
        }
      }
    });
  }
  throw new Error('un-excepted parameter type');
};
