/**
 * app doc file
 */
import type { ClientendContextData } from '../_parser';

export function appDocFile(data: ClientendContextData) {
  return `---
description: 'app desc ${data.context.name}'
labels: []
---
`;
}
