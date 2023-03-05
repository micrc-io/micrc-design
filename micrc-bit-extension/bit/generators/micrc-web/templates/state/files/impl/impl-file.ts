/**
 * impl/impl.ts
 */

export function implFile() {
  return `// 协议客户端实现
import OpenAPIClient from 'openapi-client-axios';
import { applyPatch, getValueByPointer } from 'fast-json-patch';

import { spec, impl as protocols } from '../protocol';

require('./mock');

const client = new OpenAPIClient({
  definition: spec as any,
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
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
  const _apis: Record<string, Function> = {};
  Object.keys(protocols).forEach((it) => {
    const proto = protocols[it];
    _apis[it] = () => new Promise((resolve) => {
      const param = getValueByPointer(get(), \`/\${it}/param\`);
      const [valid, error, validator] = proto.invalid.validate(param);
      if (!valid) {
        console.log(\`校验失败: \${valid}\\n\`, validator.errors);
        console.log('转换后的值: ', error);
        patches([{ op: 'replace', path: \`/\${it}/invalid/err\`, value: error }]);
        return;
      }
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
      ).then((res) => { // 这里不仅仅包括正常的响应, 服务端会以200包装预期错误对象返回, 这里应该对不同错误作出不同的处理
        console.log('正确', res.status);
        patches([{ op: 'replace', path: \`/\${it}/result\`, value: res.data }]);
        resolve(res);
      }).catch((err) => { // 这里都是不期望的错误, 如4xx, 5xx, 应该封装统一的错误对象, 并做一致处理
        console.log('错了', err);
        patches([{ op: 'replace', path: \`/\${it}/error/err\`, value: err.message }]);
        resolve(err);
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
