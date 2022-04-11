{{- define  "app.projectName" -}}
{{- .Chart.Name   -}}
{{- end -}}

{{- define  "app.moduleName" -}}
{{- last (splitList "/" (dir .Template.Name)) -}}
{{- end -}}

{{- define "labels.standard" -}}
module: {{ include "app.moduleName" . | quote  }}
projectName: {{ include "app.projectName" . | quote  }}
{{- end -}}

{{/*
Return the appropriate apiVersion for deployment.
*/}}
{{- define "app.deployment.apiVersion" -}}
{{- if semverCompare "<1.9-0" .Capabilities.KubeVersion.GitVersion -}}
{{- print "apps/v1beta2" -}}
{{- else -}}
{{- print "apps/v1" -}}
{{- end -}}
{{- end -}}


{{/*
Return the appropriate apiVersion for ingress.
*/}}
{{- define "app.ingress.apiVersion" -}}
{{- if semverCompare "<1.14-0" .Capabilities.KubeVersion.GitVersion -}}
{{- print "extensions/v1beta1" -}}
{{- else -}}
{{- print "networking.k8s.io/v1beta1" -}}
{{- end -}}
{{- end -}}
