/**
 * helm/templates/serviceaccount.yaml
 */
import type { ClientendContextData } from '../../../../_parser';

export function serviceaccountFile(data: ClientendContextData) {
  return `{{- if .Values.serviceAccount.create -}}
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ include "${data.context.name}-gateway.serviceAccountName" . }}
  labels:
    {{- include "${data.context.name}-gateway.labels" . | nindent 4 }}
  {{- with .Values.serviceAccount.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
{{- end }}
`;
}
