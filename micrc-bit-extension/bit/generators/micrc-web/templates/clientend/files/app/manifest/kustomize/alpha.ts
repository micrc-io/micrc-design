/**
 * kustomize/dev/kustomization.yaml
 */
import type { ClientendContextData } from '../../../../_parser';

export function alphaFile(data: ClientendContextData) {
  return `apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

generatorOptions:
  disableNameSuffixHash: true

secretGenerator:
  - name: ${data.context.name}-docker-registry
    type: kubernetes.io/dockerconfigjson
    files:
      - .dockerconfigjson=../docker-config.json

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
      - op: add
        path: /spec/template/spec/imagePullSecrets
        value:
          - name: ${data.context.name}-docker-registry
    target:
      kind: Deployment
  - patch: |-
      - op: replace
        path: /spec/template/spec/containers/0/env/0/value
        value: alpha
    target:
      kind: Deployment
  - patch: |-
      - op: replace
        path: /spec/template/spec/containers/0/env/1/value
        value: alpha
    target:
      kind: Deployment
`;
}
