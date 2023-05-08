/**
 * kustomize/dev/traffic-manager.yaml
 */
import type { ClientendContextData } from '../../../../_parser';

export function devTrafficManagerFile(data: ClientendContextData) {
  return `---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ${data.context.name}-gateway
spec:
  hosts:
  - "${data.intro.context.gateway.host.replace('*', 'dev')}"
  gateways:
  - ${data.intro.context.gateway.entry}
  http:
  - route:
    - destination:
        port:
          number: 8000
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
