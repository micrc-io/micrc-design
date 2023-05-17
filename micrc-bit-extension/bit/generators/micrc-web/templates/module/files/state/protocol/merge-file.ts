/**
 * state/protocol/merge.json
 */
import type { ModuleContextData } from '../../../_parse';

export function stateProtocolMergeFile(data: ModuleContextData) {
  return `{
  "openapi": "3.0.3",
  "info": {
    "title": "${data.context.name}",
    "version": "${data.intro.version}"
  },
  "servers": [
    {
      "url": "/api/${data.intro.context.ownerDomain}/${data.intro.context.contextName}",
      "x-host": "${data.intro.context.ownerDomain}.${data.intro.context.contextName}.${data.intro.context.namespace}"
    }
  ],
  "externalDocs": {
    "url": ""
  },
  "security": [],
  "tags": [{}]
}
`;
}
