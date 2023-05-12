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
      "url": "/api/${data.intro.ownerDomain}/${data.intro.context}",
      "x-host": "${data.intro.ownerDomain}.${data.intro.context}"
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
