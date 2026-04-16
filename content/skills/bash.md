---
id: bash
label: Bash
subtitle: Shell Scripting
category: skills
size: 16
icon: TerminalSquare
connections: []
---
# Bash Scripting

## Overview
Bash is the connective tissue of the homelab — every initialization script, cron job, and automation task starts here before graduating to a proper language.

## Core Use Cases

### VM Bootstrap Scripts
Every new VM runs an `init.sh` on first boot:
```bash
#!/bin/bash
set -euo pipefail

# Update & install base packages
apt-get update -qq && apt-get install -y \
  curl wget git htop vim \
  prometheus-node-exporter

# Configure SSH hardening
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd
```

### Maintenance Cron Jobs
- Weekly ZFS scrubs scheduled and reported via email
- Daily Docker image pruning to reclaim disk space
- Automated Let's Encrypt renewal verification

### Network Diagnostics
```bash
# Quick connectivity matrix across all VLANs
for host in 10.0.10.{1..10} 10.0.20.{1..20}; do
  ping -c1 -W1 "$host" &>/dev/null && echo "$host UP" || echo "$host DOWN"
done
```
