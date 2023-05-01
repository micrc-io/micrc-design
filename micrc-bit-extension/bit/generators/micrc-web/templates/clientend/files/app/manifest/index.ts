/**
 * app/node_modules/.cache/micrc/manifests
 */
import path from 'path';
import type { ClientendContextData } from '../../../_parser';

import { chartFile } from './helm/chart-file';
import { valuesFile } from './helm/values-file';
import { helmIgnoreFile } from './helm/helmIgnore-file';
import { helperFile } from './helm/helper-file';
import { serviceFile } from './helm/service-file';
import { serviceaccountFile } from './helm/service-account-file';
import { hpaFile } from './helm/hpa-file';
import { deploymentFile } from './helm/deployment-file';
import { baseFile } from './kustomize/base';
import { devFile } from './kustomize/dev';
import { localFile } from './kustomize/local';

const PATH = ['app', 'node_modules', '.cache', 'micrc', 'manifests', 'k8s'];

export const appManifests = (data: ClientendContextData) => [
  // k8s/helm/${clientendName}/Chart.yaml
  {
    relativePath: path.join(...PATH, 'helm', `${data.context.name}-gateway`, 'Chart.yaml'),
    content: chartFile(data),
  },
  // k8s/helm/${clientendName}/Chart.yaml
  {
    relativePath: path.join(...PATH, 'helm', `${data.context.name}-gateway`, 'values.yaml'),
    content: valuesFile(data),
  },
  // k8s/helm/${clientendName}/.helmignore.yaml
  {
    relativePath: path.join(...PATH, 'helm', `${data.context.name}-gateway`, 'helmignore.yaml'),
    content: helmIgnoreFile(),
  },
  // k8s/helm/${clientendName}/templates/_helper.tpl
  {
    relativePath: path.join(...PATH, 'helm', `${data.context.name}-gateway`, 'templates', '_helper.tpl'),
    content: helperFile(data),
  },
  // k8s/helm/${clientendName}/templates/service.yaml
  {
    relativePath: path.join(...PATH, 'helm', `${data.context.name}-gateway`, 'templates', 'service.yaml'),
    content: serviceFile(data),
  },
  // k8s/helm/${clientendName}/templates/serviceaccount.yaml
  {
    relativePath: path.join(...PATH, 'helm', `${data.context.name}-gateway`, 'templates', 'serviceaccount.yaml'),
    content: serviceaccountFile(data),
  },
  // k8s/helm/${clientendName}/templates/hpa.yaml
  {
    relativePath: path.join(...PATH, 'helm', `${data.context.name}-gateway`, 'templates', 'hpa.yaml'),
    content: hpaFile(data),
  },
  // k8s/helm/${clientendName}/templates/deployment.yaml
  {
    relativePath: path.join(...PATH, 'helm', `${data.context.name}-gateway`, 'templates', 'deployment.yaml'),
    content: deploymentFile(data),
  },
  // k8s/kustomize/base/kustomization.yaml
  {
    relativePath: path.join(...PATH, 'kustomize', 'base', 'kustomization.yaml'),
    content: baseFile(data),
  },
  // k8s/kustomize/local/kustomization.yaml
  {
    relativePath: path.join(...PATH, 'kustomize', 'local', 'kustomization.yaml'),
    content: localFile(data),
  },
  // k8s/kustomize/dev/kustomization.yaml
  {
    relativePath: path.join(...PATH, 'kustomize', 'dev', 'kustomization.yaml'),
    content: devFile(),
  },
];
