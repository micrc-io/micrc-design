/**
 * kustomize/local/kustomization.yaml
 */
import type { ClientendContextData } from '../../../../_parser';

export function localFile(data: ClientendContextData) {
  return `apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - ../base

patchesStrategicMerge:
  - |-
    apiVersion: autoscaling/v2beta1
    kind: HorizontalPodAutoscaler
    metadata:
      name: ${data.context.name}-gateway
    $patch: delete

patches:
  - patch: |-
      - op: replace
        path: /spec/template/spec/containers/0/env/0/value
        value: local
    target:
      kind: Deployment
  - patch: |-
      - op: replace
        path: /spec/template/spec/containers/0/env/1/value
        value: local
    target:
      kind: Deployment
`;
}
