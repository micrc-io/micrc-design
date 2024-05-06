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
      context: .
      sync:
        infer: []
      docker:
        dockerfile: Dockerfile
        buildArgs:
          HTTPS_PROXY: "{{.PROXY_SERVER_URL}}"
          HTTP_PROXY: "{{.PROXY_SERVER_URL}}"
          https_proxy: "{{.PROXY_SERVER_URL}}"
          http_proxy: "{{.PROXY_SERVER_URL}}"
        secrets:
          - id: npmrc
            src: ~/.npmrc
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
          - manifests/k8s/kustomize/local
        buildArgs:
          - --enable-helm
          - --load-restrictor=LoadRestrictionsNone
    deploy:
      kubectl: {}
    patches:
      - op: remove
        path: /build/artifacts/0/docker/buildArgs
  - name: dev
    manifests:
      kustomize:
        paths:
          - manifests/k8s/kustomize/dev
        buildArgs:
          - --enable-helm
          - --load-restrictor=LoadRestrictionsNone
  - name: alpha
    manifests:
      kustomize:
        paths:
          - manifests/k8s/kustomize/alpha
        buildArgs:
          - --enable-helm
          - --load-restrictor=LoadRestrictionsNone
  - name: beta
    manifests:
      kustomize:
        paths:
          - manifests/k8s/kustomize/beta
        buildArgs:
          - --enable-helm
          - --load-restrictor=LoadRestrictionsNone
  - name: ga
    manifests:
      kustomize:
        paths:
          - manifests/k8s/kustomize/ga
        buildArgs:
          - --enable-helm
          - --load-restrictor=LoadRestrictionsNone
`;
}
