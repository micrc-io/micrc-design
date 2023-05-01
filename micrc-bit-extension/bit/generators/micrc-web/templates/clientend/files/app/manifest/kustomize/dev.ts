/**
 * kustomize/dev/kustomization.yaml
 */

export function devFile() {
  return `apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - ../base

patches:
  - patch: |-
      - op: replace
        path: /spec/template/spec/containers/0/env/0/value
        value: dev
    target:
      kind: Deployment
  - patch: |-
      - op: replace
        path: /spec/template/spec/containers/0/env/1/value
        value: dev
    target:
      kind: Deployment
`;
}
