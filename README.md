# returnforlife
aws\
    aws configure
    terraform init && terraform apply\
gcp\
    gcloud auth application-default login
    terraform init && terraform apply -var="project=<your-project-id>"

filebeat -> logstash -> elasticsearch -> kibana 

filebeat\
file: service/helm/filebeat/values.yaml
- output.logstash hosts: [logstash-logstash:5044]
  why: send logs to logstash first (not straight to elasticsearch)


logstash\
file: service/helm/logstash/values.yaml
- service port beats 5044
  why: filebeat connects to logstash on this port
- logstashPipeline input beats port 5044
  why: the image has a hardcoded logstash.conf, must override it to accept beats
- logstashPipeline output elasticsearch add cacert, user, password
  why: elasticsearch 8 uses https with self-signed cert + auth,
  without cacert -> error "PKIX path building failed"
- extraEnvs ELASTICSEARCH_USERNAME / ELASTICSEARCH_PASSWORD from secret elasticsearch-master-credentials
  why: user/password used in pipeline output
- secretMounts elasticsearch-master-certs -> /usr/share/logstash/config/certs
  why: mount ca.crt for cacert
- indent of pipeline output must match input (yaml parse error "did not find expected key")


elasticsearch\
file: service/helm/elasticsearch/values.yaml
- replicas: 1, minimumMasterNodes: 1
  why: local cluster has only 1 node, 3 replicas use too much memory
  and master waits for 2 nodes forever
- antiAffinity: soft
  why: hard antiAffinity can not schedule more than 1 pod on 1 node
- clusterHealthCheckParams: wait_for_status=yellow
  why: 1 node can not place replica shards -> cluster is yellow,
  readiness probe waits for green -> pod never Ready
- note: after changing replicas 3 -> 1 must delete old pvc
  (old data still remembers 3 node cluster)
  

elasticsearch password\
file: service/helm/elasticsearch/secret-values.yaml (in .gitignore, not in git)
- secret.password: fixed elastic password
  why: values.yaml has password: "" -> chart makes a new random password
  on every helm upgrade -> logstash gets 401 until restart
  keep password out of values.yaml so it is not committed
- first time: copy secret-values.example.yaml -> secret-values.yaml and set password
- always upgrade with both files:
  helm upgrade elasricsearch ./elasticsearch -n default \
    -f elasticsearch/values.yaml -f elasticsearch/secret-values.yaml
- does password change on helm upgrade?
  -f values.yaml only                        -> YES, new random password every time
  -f values.yaml -f secret-values.yaml       -> NO, uses fixed password
- what happens when password changes
  1. secret elasticsearch-master-credentials gets new password
  2. elasticsearch pod restarts and uses new password
  3. logstash / kibana still use old password until restart
     -> logstash gets 401, logs stop going to elasticsearch
- if password changes (forgot secret-values.yaml), restart apps that use it:
  kubectl rollout restart sts logstash-logstash
  kubectl rollout restart deploy kibana-kibana
- login kibana (http://kibana.k8s.orb.local)
  username: elastic
  password: kubectl get secret elasticsearch-master-credentials -o jsonpath='{.data.password}' | base64 -d; echo
  note: without "; echo" zsh shows "%" at the end, "%" is not part of the password
- who uses this password
  logstash: extraEnvs ELASTICSEARCH_USERNAME / ELASTICSEARCH_PASSWORD
  kibana: elasticsearchCredentialSecret (pre-install job uses it to create kibana-kibana-es-token)
  filebeat: env from elasticsearch-master-credentials (only for output.elasticsearch)
  all read secret elasticsearch-master-credentials


kibana\
file: service/helm/kibana/values.yaml
- ingress enabled, className: traefik
  why: this cluster (orbstack/k3s) has only traefik, nginx class does nothing
- ingress host: kibana.k8s.orb.local
  why: orbstack resolves *.k8s.orb.local by itself, no need to edit /etc/hosts
- note: chart 8.5.1 upgrade bug (secret kibana-kibana-es-token already exists)
  kubectl delete secret kibana-kibana-es-token
  helm upgrade kibana ./kibana -n default -f kibana/values.yaml
  kubectl rollout restart deploy/kibana-kibana


referent 
    k8s:https://kubernetes.io/docs/concepts/services-networking/service/
    dockerForNestjs:https://docs.nestjs.com/deployment
    docker-compose:https://docs.docker.com/compose/gettingstarted
    terraform:https://developer.hashicorp.com/terraform/tutorials
    helm:https://artifacthub.io/

