/**
 * operation lib.
 * update state, invoke api, validate, integrate
 */
import pick from 'lodash.pick';
import omit from 'lodash.omit';
import patcher from './json-patch';

/**
 * 更新状态
 *
 * @param state 原状态
 * @param input 待更新的值
 * @param patch json patch对象/数组
 */
export const update = (state: any, input: any, patch: any) => {
  if (input || input === '') {
    // eslint-disable-next-line no-param-reassign
    (patch[0] || patch).value = input;
  }
  const jsonpatch: any[] = Array.isArray(patch) ? patch : [patch];
  patcher(state).patches(jsonpatch);
};

/**
 * 执行api调用
 *
 * @param state 存放api的store
 * @param patch 扩展的json-patch: {op: 'invoke', path: 'api路径'}
 */
export const invoke = async (state: any, patch: any) => {
  await patcher(state).path(patch.path.replace('/', '/_apis/'))();
};

/**
 * 执行参数校验
 *
 * @param state api参数所在store
 * @param input 待修改的参数值
 * @param patch 扩展的json-patch: {op: 'validate', path: 'api路径', value: 'param属性'}
 */
export const validate = (state: any, input: any, patch: any) => {
  // eslint-disable-next-line no-underscore-dangle,@typescript-eslint/naming-convention
  const _patcher = patcher(state);
  let param = _patcher.path(`${patch.path}/param`); // 用于手动更新param状态
  let errors = _patcher.path(`${patch.path}/invalid/err`); // 用于合并json.value指定的校验结果
  // 如果存在参数input，那么认为状态修改和校验一起进行，这时的state还没有被更新，需要手动同步
  // 同时，value值必须存在且为input的相对于param的path
  if (input) {
    if (!patch.value) {
      throw new Error('value must be exists if validate with change in action');
    }
    param = _patcher.apply(
      param,
      [{ op: 'replace', path: `/${patch.value}`, value: input }],
    );
  }
  const [valid, newErrors] = _patcher.path(
    patch.path.replace('/', '/_validators/'),
  )(param);
  if (valid) {
    return;
  }
  // 是否指定验证的属性，如果指定，则仅修改指定属性的错误
  if (patch.value) {
    // note: 不清理错误对象，保留上次校验产生的其他属性的错误信息
    // 清除指定属性原校验结果，获取指定属性新校验结果，合并创建完整错误信息
    errors = Object.assign(omit(errors, [patch.value]), pick(newErrors, [patch.value]));
  } else {
    errors = newErrors;
  }
  _patcher.patches([{ op: 'replace', path: `${patch.path}/invalid/err`, value: errors }]);
};
