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
      "url": "/api/${data.intro.context.ownerDomain}/${data.intro.context.contextName}/${data.remoteState.aggregations.toLowerCase()}",
      "x-host": "${data.intro.context.namespace}.${data.intro.context.ownerDomain}.${data.intro.context.contextName}"
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
