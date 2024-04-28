/**
 * kustomize/dev/traffic-manager.yaml
 */
import type { ClientendContextData } from '../../../../_parser';

export function gaTrafficManagerFile(data: ClientendContextData) {
  // 默认发布alpha 环境
  const publish = data.intro.publish || 'alpha';
  const nameSpaceSuffix = v => '.'+data.intro.domainName+'-'+v+'.svc.cluster.local';
  let suffix = nameSpaceSuffix(publish);

  return `---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ${data.context.name}-gateway
spec:
  hosts:
  - "${data.intro.domainName}.${data.intro.context.gateway.fqdn}"
  gateways:
  - ${data.intro.context.gateway.entry}
  http:
  - route:
    - destination:
        port:
          number: 8000
        host: ${data.context.name}-gateway${suffix}                      
                        
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: ${data.context.name}-gateway
spec:
  host: ${data.context.name}-gateway
`;
}
