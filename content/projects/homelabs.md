---
id: homelabs
label: Homelab
subtitle: Self-Hosted Infrastructure
category: projects
size: 18
color: "#f59e0b"
icon: Server
connections: ["robin"]
---
# Homelab Architecture

## Overview
A self-hosted, enterprise-grade infrastructure built for learning, experimentation, and running real production services — all from hardware I own.

## Design Philosophy
1. **Infrastructure as Code** — Ansible + Terraform for reproducible environments
2. **Zero Trust Networking** — Every VLAN is isolated; traffic is explicitly permitted, never implicit
3. **Observability First** — Every service exposes metrics; nothing runs unmonitored
4. **Break and Learn** — The lab exists to be broken safely. Proxmox snapshots make recovery instant.

## Hardware
- **Dell PowerEdge R730** — Primary hypervisor (Proxmox)
- **Raspberry Pi 4 (4GB)** — Auxiliary services + Pi-KVM
- **Custom network cabinet** — 10GbE backbone, managed switch

## Key Services Running
- Firewall (pfSense), DNS, VPN (WireGuard)
- Container orchestration (Docker + K3s)
- Monitoring (Grafana, Prometheus, Loki)
- Password management (Vaultwarden)
- Media server (Jellyfin)
