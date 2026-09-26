---
name: jenkins-pro
description: Jenkins guidance — pipeline-as-code, agents, shared libraries, credentials, scaling, and hardening.
category: development
---

## Overview

Jenkins is the veteran CI server: endlessly flexible, self-hosted, and capable of modeling any pipeline imaginable through Pipeline-as-Code (Jenkinsfile). That flexibility is also its burden — Jenkins installations accumulate plugins, freestyle jobs, and snowflake controllers that become unmaintainable without discipline.

Modern Jenkins practice: declarative pipelines in Jenkinsfiles, ephemeral agents (Kubernetes/Docker/cloud), shared libraries for common patterns, and configuration-as-code for the controller. This skill covers running Jenkins in a way that stays maintainable.

## When to use

- Maintaining or modernizing a Jenkins installation.
- Writing declarative pipelines (Jenkinsfile best practices).
- Setting up agents (static, cloud, Kubernetes, Docker).
- Creating shared libraries for common pipeline patterns.
- Managing credentials securely in Jenkins.
- Scaling Jenkins (controller/agent topology, performance).
- Hardening Jenkins (auth, authorization, plugin hygiene).
- Migrating from freestyle jobs to pipelines.

## Core concepts

- **Pipeline as code.** Jenkinsfiles (declarative preferred over scripted) versioned with the repo — pipelines become reviewable, reproducible, and portable. Freestyle jobs configured in the UI are technical debt.
- **Declarative vs scripted.** Declarative (`pipeline { agent; stages }`) for structure with guardrails; scripted for escape hatches. Prefer declarative; drop to `script {}` blocks sparingly.
- **Controllers and agents.** The controller orchestrates; agents execute. Never build on the controller (security + stability) — agents should be ephemeral (Kubernetes pods, Docker containers, cloud VMs).
- **Agent types.** Static agents (persistent, simple, snowflakes), cloud agents (EC2/GCE/Azure VMs on demand), Kubernetes agents (pods per build, the modern default), Docker agents (containers per stage). Ephemeral agents eliminate "works on agent-3" mysteries.
- **Shared libraries.** Versioned Groovy libraries (`vars/`, `src/`) for common steps (notify, deploy, scan) — the DRY mechanism across hundreds of Jenkinsfiles. Version them; untrusted libraries are code execution.
- **Credentials.** The credentials store with scoped bindings (`withCredentials`) — secrets never in Jenkinsfiles or logs. Credential types: secret text, username/password, SSH keys, certificates, vault integrations.
- **Configuration as Code (JCasC).** Controller config in YAML — plugins, agents, credentials references, security settings. JCasC makes controllers reproducible and reviewable; without it, the controller is a snowflake.
- **Multibranch pipelines.** Auto-discovered Jenkinsfiles per branch/PR with branch-specific behavior — the standard for GitHub/GitLab repos on Jenkins.
- **Blue Ocean (legacy) vs classic UI.** Blue Ocean is deprecated; the classic UI with modern plugins is the current path. Don't build new workflows on Blue Ocean.
- **Plugins.** The ecosystem's strength and risk: minimize plugin count, keep them updated, remove unused ones. Each plugin is attack surface and maintenance burden.
- **Security.** Authentication (SSO/LDAP), authorization (matrix/project-based), CSRF protection, agent-to-controller security (inbound agents with secrets, not JNLP without auth). Jenkins has a long CVE history — patch promptly.
- **Pipeline libraries and sandbox.** Shared library code runs in the Groovy sandbox (or with approvals); understand what needs whitelisting.
- **Build retention.** Discard old builds (`buildDiscarder`) — unbounded history fills disks. Keep what compliance needs, not everything.
- **Monitoring.** Controller health (heap, executors, queue), agent availability, plugin versions — Jenkins needs its own observability; a sick CI blocks everyone.
- **Pipeline unit testing.** JenkinsPipelineUnit for testing shared library logic — shared code used by hundreds of pipelines deserves tests.
- **CloudBees vs OSS.** The enterprise distribution adds support and governance features; evaluate whether the team needs it or OSS suffices.

## Practical workflow

1. **Define the controller as code.** JCasC YAML for all controller config; controller in a container or VM managed by IaC; no manual UI configuration for anything that matters.
2. **Write declarative Jenkinsfiles.** Agent per stage (or per pipeline), `options` for timeouts/retention, `post` for notifications/cleanup, `when` for conditional stages.
   ```groovy
   pipeline {
     agent { kubernetes { yamlFile 'build-pod.yaml' } }
     options { timeout(time: 30, unit: 'MINUTES'); buildDiscarder(logRotator(numToKeepStr: '20')) }
     stages {
       stage('Test') { steps { sh 'npm ci && npm test' } }
       stage('Build') { when { branch 'main' } steps { sh 'docker build -t app:${BUILD_NUMBER} .' } }
     }
     post { failure { slackSend channel: '#builds', message: "Failed: ${env.JOB_NAME}" } }
   }
   ```
3. **Use ephemeral agents.** Kubernetes pods per build (or Docker/cloud agents); resource requests/limits; no builds on the controller — enforce with agent labels and authorization.
4. **Extract shared libraries.** Common patterns (checkout+setup, notifications, deployments, scans) into versioned `vars/` steps; pin library versions in Jenkinsfiles.
5. **Manage credentials properly.** Scoped credentials, `withCredentials` bindings, rotation procedures; integrate with Vault/cloud secret stores for central management.
6. **Harden the instance.** SSO auth, least-privilege authorization, updated plugins/Jenkins core, no anonymous access, agent-to-controller access control, CSRF protection on.
7. **Scale deliberately.** Controller sized for the job count (heap, CPU); agent pools autoscaled; build queue monitored; heavy jobs on labeled agents.
8. **Plan the exit or the upkeep.** Jenkins needs ongoing care (upgrades, plugin management). If the team can't staff it, that's the argument for a managed CI service — make it explicitly.

## Common pitfalls

- **Building on the controller** — resource exhaustion and security risk; agents only.
- **Freestyle jobs** — unversioned, unreviewable config; pipelines as code.
- **Plugin sprawl** — dozens of unmaintained plugins; minimize and update.
- **Unpatched Jenkins** — long CVE history; patch core and plugins promptly.
- **Snowflake controllers** — UI-configured instances; JCasC for everything.
- **Static pet agents** — "works on agent-3" mysteries; ephemeral agents.
- **Credentials in Jenkinsfiles** — secrets in code; credentials store + bindings.
- **No build retention** — disks filling with history; `buildDiscarder` everywhere.
- **Scripted-pipeline sprawl** — unmaintainable Groovy; prefer declarative.
- **Missing timeouts** — hung builds blocking executors; `timeout` options.
- **Anonymous/admin-everyone access** — the classic Jenkins breach; proper auth + authorization.
- **Shared libraries unversioned** — breaking every pipeline at once; version libraries.
- **Ignoring controller health** — sick CI discovered when builds queue; monitor heap, queue, agents.
- **Upgrading without backups** — core/plugin upgrades breaking the controller; snapshot and test upgrades in staging.
