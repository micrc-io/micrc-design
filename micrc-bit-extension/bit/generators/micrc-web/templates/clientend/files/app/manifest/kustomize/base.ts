/**
 * kustomize/base/kustomization.yaml
 */
import type { ClientendContextData } from '../../../../_parser';

export function baseFile(data: ClientendContextData) {
  return `apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

helmGlobals:
  chartHome: ../../helm

helmCharts:
  - name: ${data.context.name}-gateway
    includeCRDs: false
    releaseName: ${data.context.name}-gateway
    version: ${data.intro.version}
`;
}
