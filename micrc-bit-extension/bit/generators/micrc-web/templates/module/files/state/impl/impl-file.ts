/**
 * state/impl/impl.ts
 */
export function stateImplFile() {
  return `// 协议客户端实现
import OpenAPIClient from 'openapi-client-axios';
import { applyPatch, getValueByPointer } from 'fast-json-patch';

import { spec, impl as protocols } from '../protocol';

require('./mock');

const client = new OpenAPIClient({
  definition: spec,
}).initSync();

export const apis = (get, set) => {
  const patches = (json) => {
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow,@typescript-eslint/naming-convention
      const { _apis, _validators, set } = state;
      const newDoc = applyPatch(state, json, false, false).newDocument;
      // eslint-disable-next-line no-underscore-dangle
      newDoc._apis = _apis;
      // eslint-disable-next-line no-underscore-dangle
      newDoc._validators = _validators;
      newDoc.set = set;
      return newDoc;
    });
  };
  const loadingState = (it, value) => {
    patches([{ op: 'replace', path: \`/\${it}/pending\`, value }]);
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
  const _apis = {};
  Object.keys(protocols).forEach((it) => {
    const proto = protocols[it];
    _apis[it] = () => new Promise((resolve) => {
      const param = getValueByPointer(get(), \`/\${it}/param\`);
      const [isValidParam, paramValidError] = proto.invalid.validate(param);
      if (!isValidParam) {
        patches([{ op: 'replace', path: \`/\${it}/invalid/err\`, value: paramValidError }]);
        loadingState(it, false);
        return;
      }
      loadingState(it, true);
      client[it](
        null,
        param,
        {
          headers: {
            'x-host': proto.host, // 不带这个头会报400
            'Content-Type': proto.requestContentType,
            // eslint-disable-next-line
            'Accept': proto.responseContentType,
          },
        },
      ).then((res) => {
        const [isValidResult, reaultValidError] = proto.error.validate(res.data);
        if (!isValidResult) {
          patches([{ op: 'replace', path: \`/\${it}/error/err\`, value: reaultValidError }]);
        } else {
          patches([{ op: 'replace', path: \`/\${it}/result\`, value: res.data }]);
        }
        resolve(res);
        loadingState(it, false);
      }).catch((err) => { // 非预期错误. 4xx,5xx
        patches([{ op: 'replace', path: \`/\${it}/error/err\`, value: 'i18n:///#:#:global.error.message' }]);
        resolve(err);
        loadingState(it, false);
      });
    });
  });
  return _apis;
};

export const validators = () => {
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
  const _validators = {};
  Object.keys(protocols).forEach((it) => {
    const proto = protocols[it];
    _validators[it] = proto.invalid.validate;
  });
  return _validators;
};

export const states = () => {
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
  const _states = {};
  Object.keys(protocols).forEach((it) => {
    const proto = protocols[it];
    _states[it] = {
      pending: false,
      param: proto.param,
      invalid: proto.invalid,
      result: proto.result,
      error: proto.error,
    };
  });
  return _states;
};
`;
}
