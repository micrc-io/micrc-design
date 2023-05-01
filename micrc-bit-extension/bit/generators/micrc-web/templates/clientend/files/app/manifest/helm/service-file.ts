/**
 * helm/templates/service.yaml
 */
import type { ClientendContextData } from '../../../../_parser';

export function serviceFile(data: ClientendContextData) {
  return `apiVersion: v1
kind: Service
metadata:
  name: {{ include "${data.context.name}-gateway.fullname" . }}
  labels:
    {{- include "${data.context.name}-gateway.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: http
      protocol: TCP
      name: http
  selector:
    {{- include "${data.context.name}-gateway.selectorLabels" . | nindent 4 }}
`;
}
