/**
 * protocol/spec.ts
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import type { ModuleContextData } from '../../_parse';

const tmpl = `// 导入apis下所有api protocol, 加上schema, 组合成一个specification并导出
import {
  OpenAPIObject,
  PathObject,
  OperationObject,
  MediaTypeObject,
  ContentObject,
  RequestBodyObject,
  ResponseObject,
  ExampleObject,
} from 'openapi3-ts';

import mergeDeep from 'lodash.merge';
import omitDeep from 'omit-deep-lodash';
import { merge, isErrorResult } from 'openapi-merge';
import deref from 'json-schema-deref-sync';
import Ajv, { ValidateFunction } from 'ajv';
import ajvFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';
import { setupWorker } from 'msw';

import common from './merge.json';
{{#each integration.rpc.protocols}}
import {{this}} from './apis/{{this}}.json';
{{/each}}
// ...导入其他api
import schema from './aggre.json';

declare type Invalid = {
  validate: (any) => [boolean, object, ValidateFunction];
  err: object;
};
declare type Error = {
  validate: (any) => [boolean, object, ValidateFunction];
  err: object
};
declare type ProtocolImpl = {
  host: string;
  requestContentType: string;
  responseContentType: string;
  param: any;
  invalid: Invalid;
  result: any;
  error: Error;
};
declare type ProtocolMock = {
  url: string;
  host: string;
  path: string;
  method: string;
  schema: object;
};

const ajv = new Ajv({
  allErrors: true,
  $data: true,
});
ajvFormats(ajv);
ajvErrors(ajv);

const validator = (ajvValidate: ValidateFunction) => (
  data: any,
): [boolean, object, ValidateFunction] => {
  const valid = ajvValidate(data);
  const { errors } = ajvValidate;
  const errs = [];
  let errObj = {};
  if (!valid) {
    errors.forEach((it) => {
      let error = it;
      if (it.keyword === 'errorMessage') {
        [error] = it.params.errors;
        error.message = it.message;
      }
      if (error.keyword === 'required') {
        error.instancePath += \`/\${error.params.missingProperty}\`;
      }
      const err = {};
      let objStr = error.instancePath.split('/')
        .filter((p) => p !== '')
        .reduce((prev, curr) => {
          if (prev) {
            const str = \`\${prev}["\${curr}"]\`;
            // eslint-disable-next-line no-eval
            eval(\`\${str}={}\`);
            return str;
          }
          return 'err';
        }, 'err');
      objStr += \`["\${error.keyword}"]\`;
      // eslint-disable-next-line no-eval
      eval(\`\${objStr}={}\`);
      // eslint-disable-next-line no-eval
      eval(\`\${objStr}["status"]="error"\`);
      // eslint-disable-next-line no-eval
      eval(\`\${objStr}["msg"]=\\\`\${error.message.replace('\`', '\\\\\`')}\\\`\`);
      errs.push(err);
    });
    errObj = errs.reduce((prev, curr) => mergeDeep(prev, curr), {});
  }
  return [valid, errObj, ajvValidate];
};

const mergeResult = merge([
  {
    oas: common as any,
  },
  {{#each integration.rpc.protocols}}
  {
    oas: {{this}}
  },
  {{/each}}
  {
    oas: schema,
  },
]);

if (isErrorResult(mergeResult)) {
  // Oops, something went wrong
  throw new Error(\`\${mergeResult.message} (\${mergeResult.type})\`);
}

export const doc: OpenAPIObject = mergeResult.output as OpenAPIObject;
export const spec: OpenAPIObject = deref(doc, { failOnMissing: true });
export const impl: Record<string, ProtocolImpl> = {};
export const mock: ProtocolMock[] = [];

Object.keys(spec.paths).forEach((path: string) => {
  const pathObject: PathObject = spec.paths[path];
  Object.keys(pathObject).forEach((method: string) => {
    const operation: OperationObject = pathObject[method];
    const requestContent: ContentObject = (operation.requestBody as RequestBodyObject).content;
    const responseContent: ContentObject = (operation.responses.default as ResponseObject).content;
    const requestMediaType = Object.keys(requestContent)[0];
    const request: MediaTypeObject = requestContent[requestMediaType];
    const requestValidator = ajv.compile(
      mergeDeep(omitDeep(request.schema, 'x-validators'), request['x-validator'] || {}),
    );
    const responseMediaType = Object.keys(responseContent)[0];
    const response: MediaTypeObject = responseContent[responseMediaType];
    const responseValidator = ajv.compile(
      mergeDeep(omitDeep(response.schema, 'x-validators'), response['x-validator'] || {}),
    );
    impl[operation.operationId] = {
      host: spec.servers[0]['x-host'],
      requestContentType: requestMediaType,
      responseContentType: responseMediaType,
      param: (request.examples.default as ExampleObject).value,
      invalid: {
        validate: validator(requestValidator),
        err: {},
      },
      result: (response.examples.default as ExampleObject).value,
      error: {
        validate: validator(responseValidator),
        err: {},
      },
    };
    mock.push({
      url: spec.servers[0].url,
      host: spec.servers[0]['x-host'],
      path,
      method,
      schema: response.schema,
    });
  });
});

export const useHandlers = (handlers) => {
  // 浏览器环境
  // 组件运行在bit和storybook环境中时, 会注册; 而运行在端口中时, mock一定为false, 虽然注册但worker不会启动
  if (
    typeof window !== 'undefined'
    // && window.navigator // 用于jest检测. module和func组件不必进行单元测试
    // && !(window.navigator.userAgent.includes('Node.js') || navigator.userAgent.includes('jsdom'))
  ) {
    if (
      !(process.env.NEXT_PUBLIC_DEVELOPMENT === 'true' || process.env.DEVELOPMENT === 'true'
        || process.env.NEXT_PUBLIC_PRODUCTION === 'true' || process.env.PRODUCTION === 'true')
    ) {
      if (!window['msw-worker']) {
        const worker = setupWorker();
        window['msw-worker'] = worker;
        let workerPath = window.location.pathname;
        if (workerPath.endsWith('.html')) {
          workerPath = '';
        }
        worker.start({ serviceWorker: { url: \`\${workerPath}mockServiceWorker.js\` } });
      }
      window['msw-worker'].use(...handlers);
    }
  }
  // node 代理环境
  // 组件运行在端口, 浏览器mock service worker不启动
  // 请求会发送到node代理, 当缺失必要服务器环境变量值时, 代理启动mock service worker, 执行注册在node环境中的handler
  if (typeof window === 'undefined' && typeof global !== 'undefined') {
    // 当产品环境为true, 且登陆URI和token_pointer同时都配置时, 满足mock条件
    // 如果global中的msw-worker不存在, 则创建、放入global并启动
    // 每个状态组件的mock中也会这么做, 同时use(自己的handler))
    if (
      !(process.env.PRODUCTION === 'true' && process.env.LOGIN_URI && process.env.SERVER_TOKEN_POINTER)
    ) {
      if (!global['msw-worker']) {
        // eslint-disable-next-line global-require
        const worker = require('msw/node').setupServer();
        worker.listen();
        global['msw-worker'] = worker;
      }
      global['msw-worker'].use(...handlers);
    }
  }
};
`;

export function protocolSpecFile(data: ModuleContextData) {
  return prettier.format(
    HandleBars.compile(tmpl)(data),
    {
      parser: 'typescript',
      semi: true,
      singleQuote: true,
      bracketSameLine: false,
      singleAttributePerLine: true,
    },
  );
}
