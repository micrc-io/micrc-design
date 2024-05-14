/**
 * app/integration.jenkinsfile
 */
import type { ClientendContextData } from '../../../_parser';

export function appProductionCIFile(data: ClientendContextData) {
  return `def dockerHost
pipeline {
  options {
    overrideIndexTriggers(false)
  }
  agent {
    node {
      label 'micrc-dind'
    }
  }
  parameters {
    string(name: 'commit', defaultValue: '', description: 'git commit num')
    choice(
      name: 'profile',
      choices: ['alpha', 'beta', 'release'],
      description: 'deploy profile'
    )
    booleanParam(
      name: 'deploy',
      defaultValue: false,
      description: 'is deploy'
    )
    booleanParam(
      name: 'functional',
      defaultValue: false,
      description: 'is functional verification'
    )
    booleanParam(
      name: 'security',
      defaultValue: false,
      description: 'is security verification'
    )
    booleanParam(
      name: 'stress',
      defaultValue: false,
      description: 'is stress verification'
    )
    booleanParam(
      name: 'robustness',
      defaultValue: false,
      description: 'is robustness verification'
    )
  }
  environment {
    TAG='${data.intro.version}'
    GIT_CREDENTIAL='github-repo-admin'
    REGISTRY_CREDENTIAL='registry-admin'
    NPM_CREDENTIAL='npm-admin'
    DOCKER_REGISTRY='${data.intro.context.global.production.registry}'
    GITOPS_REPO='${data.intro.context.global.production.gitopsRepo}'
  }
  stages {
    stage('Prepare Docker Daemon'){
      steps {
        container('micrc-dind') {
          script {
            dockerHost = sh(
              returnStdout: true,
              script: 'echo tcp://\${DOCKER_HOST_IP}:\${DOCKER_HOST_PORT}'
            ).trim()
          }
        }
      }
    }
    stage('Execution') {
      agent {
        label 'micrc'
      }
      stages {
        stage('${data.context.name} - Build') {
          when {
              expression { params.commit != '' }
          }
          steps {
            script {
              env.DOCKER_HOST=dockerHost
            }
            container('micrc') {
              sh "git config --global --add safe.directory '*'"
              sh "git checkout $COMMIT"
              dir("${data.intro.relativePath}") {
                withCredentials([
                  usernamePassword(credentialsId: "$NPM_CREDENTIAL", usernameVariable: 'NPM_REGISTRY', passwordVariable: 'NPM_TOKEN'),
                  usernamePassword(credentialsId: "$REGISTRY_CREDENTIAL", passwordVariable: 'REGISTRY_PASSWORD', usernameVariable: 'REGISTRY_USERNAME')
                ]) {
                  sh "echo registry=${data.intro.context.global.production.proxyRepoUrl} > ~/.npmrc"
                  sh "echo $NPM_REGISTRY >> ~/.npmrc"
                  sh "echo $NPM_TOKEN >> ~/.npmrc"
                  sh "echo @micrc:registry=https://node.bit.cloud >> ~/.npmrc"
                  sh "rm -rf ./package-lock.json"
                  sh "npm i"
                  sh "export TAG=$TAG && export PROXY_SERVER_URL=${data.intro.context.global.production.proxyServerUrl} && export DOCKER_BUILDKIT=1 && export COMPOSE_DOCKER_CLI_BUILD=1 && skaffold build -p $PROFILE --default-repo=$DOCKER_REGISTRY"
                  sh "docker login -u $REGISTRY_USERNAME -p $REGISTRY_PASSWORD $DOCKER_REGISTRY"
                  sh "docker push $DOCKER_REGISTRY/${data.context.name}-gateway:$TAG"
                }
              }
            }
          }
        }
        stage('security - Functional Verification') {
          when {
            expression { params.functional == true }
          }
          steps {
            println 'Not Ready...'
          }
        }
        stage('security - Security Verification') {
          when {
            expression { params.security == true }
          }
          steps {
            println 'Not Ready...'
          }
        }
        stage('security - Stress Verification') {
          when {
            expression { params.stress == true }
          }
          steps {
            println 'Not Ready...'
          }
        }
        stage('security - Robustness Verification') {
          when {
            expression { params.robustness == true }
          }
          steps {
            println 'Not Ready...'
          }
        }
        stage('${data.context.name} - Deployment') {
          when {
            expression { params.deploy == true }
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
                    sh "export https_proxy=${data.intro.context.global.production.proxyServerUrl} && git clone https://$GIT_USERNAME:$GIT_PASSWORD@$GITOPS_REPO gitops"
                  }
                }
                sh "mkdir -p ../gitops/profiles/$PROFILE/${data.intro.context.ownerDomain}"
                sh "/bin/cp ./${data.intro.relativePath}/${data.context.name}-gateway-manifest.yaml ../gitops/profiles/$PROFILE/${data.intro.context.ownerDomain}/${data.context.name}-gateway-manifest.yaml"
                dir("../gitops"){
                  sh "git config --global user.email 'operator@ouxxa.com'"
                  sh "git config --global user.name 'jenkins'"
                  sh "git add ."
                  sh "git diff-index --quiet HEAD || git commit -m \\"jenkins ci - version: $TAG, profile: $PROFILE\\""
                  sh "export https_proxy=${data.intro.context.global.production.proxyServerUrl} && git push"
                }
              }
            }
          }
        }
      }
    }
  }
}
`;
}
