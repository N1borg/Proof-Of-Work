---
id: linux
label: Linux
subtitle: Operating System
category: projects
size: 14
color: "#f59e0b"
icon: TerminalSquare
connections: ["homelabs","bash"]
---
# Linux Ecosystem

## Overview
Linux is the foundational operating system underpinning every VM, container, and device in the homelab. Fluent across multiple distributions tuned for different use cases.

## Distributions in Use
| Distro | Role |
|--------|------|
| **Debian 12** | Core OS for all server VMs — stability first |
| **Alpine Linux** | Minimal container base images |
| **Kali Linux** | Penetration testing & security auditing VM |
| **Ubuntu Server** | Occasional desktop/GUI-based tooling |

## Key Administration Skills
- systemd service management and journal analysis
- Kernel tuning (`sysctl`, hugepages, IOMMU for GPU passthrough)
- Advanced networking: bridges, VLANs, bonding, iptables/nftables
- ZFS administration: pools, datasets, snapshots, replication

## Automation
All Linux VMs are bootstrapped via Ansible playbooks stored in a private Git repo. Configuration drift is tracked and corrected automatically.
