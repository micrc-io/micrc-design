/**
 * app/integration.jenkinsfile
 */
import type { ClientendContextData } from '../../../_parser';

export function appIntegrationCIFile(data: ClientendContextData) {
  return `pipeline {
  options {
    overrideIndexTriggers(false)
  }
  agent {
    node {
      label 'micrc'
    }
  }
  parameters {
    string(name: 'commit', defaultValue: '', description: 'git commit num')
    choice(
      name: 'profile',
      choices: ['no-deploy', 'dev', 'ver', 'acc'],
      description: 'deploy profile'
    )
  }
  environment {
    tag='${data.intro.version}'
    git_credential='github-repo-admin'
    registry_credential='registry-admin'
    npm_credential='npm-admin'
    docker_registry='${data.intro.context.global.integration.registry}'
    gitops_repo='${data.intro.context.global.integration.gitopsRepo}'
  }

  stages {
    stage('${data.context.name} - integration') {
      when {
          expression { params.commit != '' }
      }
      steps {
        container('micrc') {
          sh "git checkout $COMMIT"
          dir("${data.intro.relativePath}") {
            withCredentials([
              usernamePassword(credentialsId: "$NPM_CREDENTIAL", usernameVariable: 'NPM_REGISTRY', passwordVariable: 'NPM_TOKEN'),
              usernamePassword(credentialsId: "$REGISTRY_CREDENTIAL", passwordVariable: 'REGISTRY_PASSWORD', usernameVariable: 'REGISTRY_USERNAME')
            ]) {
              sh "echo $NPM_REGISTRY > ~/.npmrc"
              sh "echo $NPM_TOKEN >> ~/.npmrc"
              sh "echo @micrc:registry=https://node.bit.cloud >> ~/.npmrc"
              sh "npm i"
              sh "export TAG=$TAG && export PROXY_SERVER_URL=${data.intro.context.global.integration.proxyServerUrl}  && export DOCKER_BUILDKIT=1 && COMPOSE_DOCKER_CLI_BUILD=1 && skaffold build -p $PROFILE --default-repo=$DOCKER_REGISTRY"
              sh "docker login -u $REGISTRY_USERNAME -p $REGISTRY_PASSWORD $DOCKER_REGISTRY"
              sh "docker push $DOCKER_REGISTRY/${data.context.name}-gateway:$TAG"
            }
          }
        }
      }
    }
    stage('${data.context.name} - deployment') {
      when {
        expression { params.profile != 'no-deploy' }
      }
      steps {
        container('micrc') {
          withCredentials([
            usernamePassword(credentialsId: "$REGISTRY_CREDENTIAL", passwordVariable: 'REGISTRY_PASSWORD', usernameVariable: 'REGISTRY_USERNAME')
          ]) {
            sh "docker login -u $REGISTRY_USERNAME -p $REGISTRY_PASSWORD $DOCKER_REGISTRY"
            dir("${data.intro.relativePath}") {
              sh "/bin/cp ~/.docker/config.json ./manifests/k8s/kustomize/docker-config.json"
              sh "export TAG=$TAG && skaffold render -p $PROFILE --digest-source=tag --default-repo=$DOCKER_REGISTRY > ${data.context.name}-gateway-manifest.yaml"
            }
          }
          lock("micrc-gitops") {
            dir("../"){
              sh "chmod 777 -R ."
              withCredentials([usernamePassword(credentialsId: "$GIT_CREDENTIAL", passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                sh "export https_proxy=${data.intro.context.global.integration.proxyServerUrl} && git clone https://$GIT_USERNAME:$GIT_PASSWORD@$GITOPS_REPO gitops"
              }
            }
            sh "mkdir -p ../gitops/profiles/$PROFILE/${data.intro.context.ownerDomain}"
            sh "/bin/cp ./${data.intro.relativePath}/${data.context.name}-gateway-manifest.yaml ../gitops/profiles/$PROFILE/${data.intro.context.ownerDomain}/${data.context.name}-gateway-manifest.yaml"
            dir("../gitops"){
              sh "git config --global user.email 'developer@ouxxa.com'"
              sh "git config --global user.name 'jenkins'"
              sh "git add ."
              sh "git diff-index --quiet HEAD || git commit -m \\"jenkins ci - version: $TAG, profile: $PROFILE\\""
              sh "export https_proxy=${data.intro.context.global.integration.proxyServerUrl} && git push"
            }
          }
        }
      }
    }
  }
}
`;
}
