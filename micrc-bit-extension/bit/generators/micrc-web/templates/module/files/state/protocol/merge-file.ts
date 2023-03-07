/**
 * state/protocol/merge.json
 */
import type { ModuleContextData } from '../../../_parse';

export function stateProtocolMergeFile(data: ModuleContextData) {
  return `{
  "openapi": "3.0.3",
  "info": {
    "title": "${data.intro.caseName}}",
    "version": "${data.intro.version}"
  },
  "servers": [
    {
      "url": "${data.remoteState.rpc.url}",
      "x-host": "${data.remoteState.rpc.host}"
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
