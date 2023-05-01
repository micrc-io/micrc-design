/**
 * app/skaffold.yaml
 */
import type { ClientendContextData } from '../../_parser';

export function appSkaffoldFile(data: ClientendContextData) {
  return `apiVersion: skaffold/v4beta4
kind: Config
metadata:
  name: ${data.context.name}-config
build:
  local:
    push: false
  tagPolicy:
    envTemplate:
      template: "{{.TAG}}"
  artifacts:
    - image: ${data.context.name}-gateway
      sync:
        infer: []
      docker:
        dockerfile: Dockerfile
        buildArgs:
          NPM_TOKEN: "{{.NPM_TOKEN}}"
        pullParent: true
        cliFlags:
          - "--rm"

profiles:
  - name: local
    build:
      tagPolicy:
        gitCommit:
          variant: AbbrevCommitSha
    manifests:
      kustomize:
        paths:
          - node_modules/.cache/micrc/manifests/k8s/kustomize/local
        buildArgs:
          - --enable-helm
          - --load-restrictor=LoadRestrictionsNone
    deploy:
      kubectl: {}
  - name: dev
    manifests:
      kustomize:
        paths:
          - node_modules/.cache/micrc/manifests/k8s/kustomize/dev
        buildArgs:
          - --enable-helm
          - --load-restrictor=LoadRestrictionsNone
`;
}
