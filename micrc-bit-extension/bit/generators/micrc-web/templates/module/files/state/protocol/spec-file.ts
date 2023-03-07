/**
 * state/protocol/spec.ts
 */
import path from 'path';

import HandleBars from 'handlebars';

import type { ModuleContextData } from '../../../_parse';

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
{{#each remoteState.rpc.protocols}}
{{{protocolImport this}}};
{{/each}}
import schema from './aggre.json';

declare type Invalid = {
  validate: (any: any) => [boolean, object, ValidateFunction];
  err: object;
};

declare type Error = {
  validate: (any: any) => [boolean, object, ValidateFunction];
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
  {{#each remoteState.rpc.protocols}}
  {
    oas: {{{protocolName this}}},
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

const browserWorker = (handlers: Array<any>) => {
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
};

const serverWorker = (handlers: Array<any>) => {
  if (!global['msw-worker']) {
    // eslint-disable-next-line global-require
    const worker = require('msw/node').setupServer();
    worker.listen();
    global['msw-worker'] = worker;
  }
  global['msw-worker'].use(...handlers);
};

export const useHandlers = (handlers: Array<any>) => {
  // 浏览器环境中, 仅bit/storybook环境需要启动浏览器mock worker
  if (typeof window !== 'undefined') {
    // 没有APP_ENV环境变量, 认为是bit/storybook环境
    if (typeof process.env.NEXT_PUBLIC_APP_ENV === 'undefined') {
      browserWorker(handlers);
    }
  }
  // 服务端环境中, 仅default和local环境需要启动mock server
  if (typeof window === 'undefined' && typeof global !== 'undefined') {
    // APP_ENV环境变量为default或local, 启动mock server
    const env = process.env.APP_ENV;
    if (env && (env === 'local' || env === 'default')) {
      serverWorker(handlers);
    }
  }
};
`;

export function stateProtocolSpecFile(data: ModuleContextData) {
  HandleBars.registerHelper('protocolImport', (context) => {
    const protocolFile = path.basename(context);
    const protocolName = protocolFile.replace('.json', '');
    return `import ${protocolName} from './apis/${protocolFile}'`;
  });
  HandleBars.registerHelper('protocolName', (context) => path.basename(context).replace('.json', ''));

  return HandleBars.compile(tmpl)(data);
}
