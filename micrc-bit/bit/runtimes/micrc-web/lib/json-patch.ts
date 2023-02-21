import { applyPatch, getValueByPointer } from 'fast-json-patch';

export default (state?: any) => ({
  path: (json: string) => getValueByPointer(state, json),
  patches: (json: any[]) => {
    state.set((_state: any) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { _apis, _validators, set } = _state;
      const newDoc = applyPatch(_state, json, false, false).newDocument;
      // eslint-disable-next-line no-underscore-dangle
      newDoc._apis = _apis;
      // eslint-disable-next-line no-underscore-dangle
      newDoc._validators = _validators;
      newDoc.set = set;
      return newDoc;
    });
  },
  apply: (doc: any, json: any[]) => {
    const newDoc = applyPatch(doc, json, false).newDocument;
    // 必须返回一个新的对象实例，否则组件不刷新
    return { ...newDoc };
  },
});
