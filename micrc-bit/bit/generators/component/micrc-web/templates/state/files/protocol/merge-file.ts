/**
 * protocol/merge.json
 */
import type { ModuleContextData } from '../../_parse';

export function protocolMergeFile(data: ModuleContextData) {
  return `{
  "openapi": "3.0.3",
  "info": {
    "title": "${data.intro.caseName}}",
    "version": "${data.intro.version}"
  },
  "servers": [
    {
      "url": "${data.integration.rpc.url}",
      "x-host": "${data.integration.rpc.host}"
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
