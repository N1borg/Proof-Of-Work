---
id: debian
label: Debian
subtitle: Server OS
category: projects
size: 12
color: "#f59e0b"
icon: HardDrive
connections: ["homelabs"]
---
# Debian GNU/Linux

## Overview
My preferred OS for production server workloads inside the homelab. Chosen for its rock-solid stability, conservative release cycle, and massive package repository.

## Why Debian?
- **Stability:** No surprise upgrades breaking services. Testing → Stable pipeline.
- **Minimal footprint:** Clean base install, add only what's needed.
- **Wide ecosystem:** Every homelab tool has a Debian package or documented install path.

## Active Deployments
- Docker host VM (Debian 12 minimal)
- K3s master + worker nodes
- Internal DNS/DHCP utility server
- Prometheus scrape target VMs

## Notable Skills
- Custom Debian preseed files for automated unattended installation
- Hardening via CIS benchmarks (disable unused services, SSH key-only auth, fail2ban)
- Packaging custom `.deb` files for internal tooling
