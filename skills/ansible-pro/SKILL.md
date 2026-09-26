---
name: ansible-pro
description: Ansible guidance — inventory, playbooks, roles, idempotency, vault secrets, and reliable automation at scale.
category: development
---

## Overview

Ansible automates servers over SSH without agents: you describe desired state in YAML playbooks, and Ansible's modules converge machines toward it. It's the pragmatic choice for configuring VMs, deploying to bare metal, and gluing together infrastructure that isn't fully cloud-native.

Ansible's simplicity is deceptive — at scale, playbook design (roles, idempotency, inventory structure) determines whether automation is reliable or a source of outages. This skill covers writing idempotent playbooks, organizing roles and inventory, handling secrets with Vault, and running Ansible safely against production.

## When to use

- Automating server configuration (packages, files, services).
- Writing idempotent playbooks and roles.
- Structuring inventory for multiple environments.
- Managing secrets with Ansible Vault.
- Deploying applications to VMs or bare metal.
- Running Ansible at scale (performance, strategies, pull mode).
- Choosing between Ansible, Terraform, Chef/Puppet, or cloud-init.

## Core concepts

- **Idempotency is the contract.** Running a playbook twice should produce the same result as running it once. Use modules (not shell commands) — `apt`, `copy`, `template`, `systemd` are idempotent; `shell: apt-get install` is not. Test by running twice and expecting zero changes the second time.
- **Inventory.** Hosts and groups in INI/YAML or dynamic inventory scripts (cloud providers). Group variables layer: `group_vars/all`, `group_vars/webservers`, `host_vars/` — most-specific wins. Keep environments as separate inventories or directories.
- **Playbooks.** Ordered plays mapping hosts to roles/tasks. Keep plays focused; one playbook per purpose beats a mega-playbook with conditionals everywhere.
- **Roles.** Reusable units (`tasks/`, `handlers/`, `templates/`, `defaults/`, `vars/`, `meta/`). `defaults/` are overridable; `vars/` are not — put user-configurable values in defaults. Roles from Galaxy are starting points, not gospel — vet them.
- **Handlers.** Restart/reload services only when notified by changed tasks. Handlers run once at the end of the play — the mechanism that makes config changes safe and non-disruptive when nothing changed.
- **Templates.** Jinja2 templates for config files with variables, loops, and conditionals. Validate rendered configs (`validate:` on template/copy) — a bad nginx.conf that fails validation never gets installed.
- **Vault.** Encrypt secrets (`ansible-vault encrypt_string`, vault files) with passwords from files/scripts/CI, never typed interactively in automation. Separate vault passwords per environment.
- **Check mode and diff.** `--check --diff` previews changes without applying — the plan/apply equivalent. Run it before production changes; treat unexpected diffs as a stop signal.
- **Tags.** Tag tasks/roles for selective runs (`--tags`, `--skip-tags`). Essential for large playbooks when you need to run just the app deploy without touching the base config.
- **Facts.** Ansible gathers host facts automatically (OS, IPs, memory) — use them for conditional logic instead of hardcoding per-host values. Disable fact gathering (`gather_facts: no`) for speed when you don't need them.
- **Delegation and run_once.** `delegate_to: localhost` for control-node tasks (API calls, local builds); `run_once` for cluster-singleton operations (DB migrations). Getting this wrong runs migrations N times.
- **Strategies.** `linear` (default, lockstep) vs `free` (hosts proceed independently, faster at scale). For rolling deploys, `serial` batches hosts — the rolling-update primitive.
- **Become (privilege escalation).** `become: yes` for root tasks; scope it per task, not globally — least privilege applies to automation too.
- **Dynamic inventory.** Cloud inventory plugins query the provider for hosts — no static host files drifting out of date. Tag-based grouping keeps it organized.
- **Ansible vs Terraform.** Ansible configures machines; Terraform provisions infrastructure. They complement: Terraform creates the servers, Ansible configures them (or use cloud-init/user-data for immutable approaches).

## Practical workflow

1. **Structure the project.** Inventories per environment, roles per component, playbooks per operation.
   ```
   ansible/
     inventories/prod/hosts.yml  inventories/staging/hosts.yml
     group_vars/all.yml          group_vars/webservers.yml
     roles/app/{tasks,handlers,templates,defaults}/
     site.yml  deploy-app.yml
   ```
2. **Write idempotent tasks.** Modules over shell; `creates:`/`removes:` guards when shell is unavoidable; notify handlers for restarts.
   ```yaml
   - name: Deploy app config
     template:
       src: app.conf.j2
       dest: /etc/app/app.conf
       validate: /usr/sbin/app --check-config %s
     notify: Restart app
   ```
3. **Template configs with validation.** Jinja2 for dynamic config; `validate:` commands prevent installing broken configs; handlers restart services once.
4. **Encrypt secrets with Vault.** `ansible-vault encrypt_string` for inline secrets, vault files for bundles; per-environment vault passwords from a secure source in CI.
   ```bash
   ansible-vault encrypt_string 'db_password' --name 'db_password'
   ansible-playbook site.yml --vault-password-file .vault-pass-prod
   ```
5. **Preview with check mode.** `ansible-playbook site.yml --check --diff --limit staging` before touching production; investigate every unexpected change.
6. **Roll with serial.** `serial: 2` (or percentages) for rolling restarts; `max_fail_percentage` to abort a bad rollout early.
   ```yaml
   - hosts: webservers
     serial: "25%"
     max_fail_percentage: 25
     roles: [app]
   ```
7. **Limit blast radius.** `--limit` for canary hosts first, then expand; separate inventories per environment so prod is never an accident away.
8. **Run reliably in CI.** Pin Ansible version (collections included via `requirements.yml`), vault passwords from CI secrets, `--diff` output in logs, and idempotency checks (second run shows zero changes).

## Common pitfalls

- **Non-idempotent tasks** — shell commands that change things every run; use modules, test with double runs.
- **Vault passwords in the repo** — committed vault password files; source them from CI secrets or a password manager.
- **Running against prod by accident** — one inventory, no `--limit` discipline; separate inventories and canary limits.
- **Handlers that never fire** — `notify` name mismatches (case-sensitive); handlers silently skipped.
- **Unvalidated templates** — broken configs installed and services failing; always `validate:` service configs.
- **Shell instead of modules** — `command: systemctl restart` instead of the `systemd` module; loses idempotency and error handling.
- **Global `become: yes`** — everything as root; scope privilege escalation per task.
- **Forgetting `run_once`/`delegate_to`** — migrations or API calls running per-host; singleton operations need explicit scoping.
- **Unpinned collections** — Galaxy updates breaking playbooks; pin versions in `requirements.yml`.
- **No check-mode preview** — applying blind to production; `--check --diff` first, always.
- **Serial-less restarts** — restarting all web servers simultaneously; `serial` for rolling changes.
- **Facts gathering overhead** — slow runs from unneeded facts; `gather_facts: no` when unused.
- **Secrets in plaintext vars** — passwords in `group_vars`; vault-encrypt anything sensitive.
