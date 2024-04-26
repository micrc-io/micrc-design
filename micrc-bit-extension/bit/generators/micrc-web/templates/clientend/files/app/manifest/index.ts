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
import { devTrafficManagerFile } from './kustomize/dev-traffic-manager-file';
import {alphaFile} from "./kustomize/alpha";
import { alphaTrafficManagerFile} from "./kustomize/alpha-traffic-manager-file";
import { betaFile }from './kustomize/beta';
import { betaTrafficManagerFile} from "./kustomize/beta-traffic-manager-file";
import { gaFile} from "./kustomize/ga";
import { gaTrafficManagerFile } from "./kustomize/ga-traffic-manager-file";

const PATH = ['app', 'manifests', 'k8s'];

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
    content: devFile(data),
  },
  // k8s/kustomize/dev/traffic-manager.yaml
  {
    relativePath: path.join(...PATH, 'kustomize', 'dev', 'traffic-manager.yaml'),
    content: devTrafficManagerFile(data),
  },
  // k8s/kustomize/alpha/kustomization.yaml
  {
    relativePath: path.join(...PATH, 'kustomize', 'alpha', 'kustomization.yaml'),
    content: alphaFile(data),
  },
  // k8s/kustomize/dev/traffic-manager.yaml
  {
    relativePath: path.join(...PATH, 'kustomize', 'alpha', 'traffic-manager.yaml'),
    content: alphaTrafficManagerFile(data),
  },
  // k8s/kustomize/beta/kustomization.yaml
  {
    relativePath: path.join(...PATH, 'kustomize', 'beta', 'kustomization.yaml'),
    content: betaFile(data),
  },
  // k8s/kustomize/beta/traffic-manager.yaml
  {
    relativePath: path.join(...PATH, 'kustomize', 'beta', 'traffic-manager.yaml'),
    content: betaTrafficManagerFile(data),
  },
  // k8s/kustomize/ga/kustomization.yaml
  {
    relativePath: path.join(...PATH, 'kustomize', 'ga', 'kustomization.yaml'),
    content: gaFile(data),
  },
  // k8s/kustomize/ga/traffic-manager.yaml
  {
    relativePath: path.join(...PATH, 'kustomize', 'ga', 'traffic-manager.yaml'),
    content: gaTrafficManagerFile(data),
  },
];
