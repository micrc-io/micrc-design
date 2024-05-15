/**
 * helm/templates/deployment.yaml
 */
import type { ClientendContextData } from '../../../../_parser';

export function deploymentFile(data: ClientendContextData) {
  return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "${data.context.name}-gateway.fullname" . }}
  labels:
    {{- include "${data.context.name}-gateway.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "${data.context.name}-gateway.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      {{- with .Values.podAnnotations }}
      annotations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      labels:
        {{- include "${data.context.name}-gateway.selectorLabels" . | nindent 8 }}
    spec:
      {{- with .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "${data.context.name}-gateway.serviceAccountName" . }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      containers:
        - name: {{ .Chart.Name }}
          securityContext:
            {{- toYaml .Values.securityContext | nindent 12 }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          env:
            - name: APP_ENV
              value: "prod"
            - name: NEXT_PUBLIC_APP_ENV
              value: "prod"
            - name: LOGIN_URI
              value: {{ .Values.loginUrl }}
            - name: SERVER_TOKEN_POINTER
              value: {{ .Values.serverTokenPointer }}
            - name: GRAY
              value: { { .Values.gray } }    
          ports:
            - name: http
              containerPort: {{ .Values.service.port }}
              protocol: TCP
          livenessProbe:
            failureThreshold: 3
            httpGet:
              path: /
              port: http
            periodSeconds: 10
            successThreshold: 1
            timeoutSeconds: 10
            initialDelaySeconds: 60
          readinessProbe:
            failureThreshold: 3
            httpGet:
              path: /
              port: http
            periodSeconds: 10
            successThreshold: 1
            timeoutSeconds: 10
            initialDelaySeconds: 30
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
      {{- with .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
`;
}
