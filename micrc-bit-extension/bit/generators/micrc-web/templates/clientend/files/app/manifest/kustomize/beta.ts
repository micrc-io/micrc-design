/**
 * kustomize/dev/kustomization.yaml
 */
import type { ClientendContextData } from '../../../../_parser';

export function betaFile(data: ClientendContextData) {
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
        value: beta
    target:
      kind: Deployment
  - patch: |-
      - op: replace
        path: /spec/template/spec/containers/0/env/1/value
        value: beta
    target:
      kind: Deployment
`;
}
