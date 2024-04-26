/**
 * kustomize/dev/traffic-manager.yaml
 */
import type { ClientendContextData } from '../../../../_parser';

export function alphaTrafficManagerFile(data: ClientendContextData) {
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
  - match:
    - headers:
        cookie:
          regex: '^(.*?;)?(profile="alpha")(;.*)?'
      route:
      -  destination:
          host: ${data.context.name}-gateway
                        
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: ${data.context.name}-gateway
spec:
  host: ${data.context.name}-gateway
`;
}
