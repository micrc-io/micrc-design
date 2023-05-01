/**
 * helm/Chart.yaml
 */
import type { ClientendContextData } from '../../../../_parser';

export function chartFile(data: ClientendContextData) {
  return `apiVersion: v2
name: ${data.context.name}-gateway
description: A Helm chart for gateway of ${data.context.name}
type: application
version: ${data.intro.version}
appVersion: "${data.intro.version}"
`;
}
