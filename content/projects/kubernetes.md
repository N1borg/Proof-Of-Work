---
id: kubernetes
label: Kubernetes
subtitle: Orchestration
category: projects
size: 14
color: "#f59e0b"
icon: Network
connections: ["homelabs","docker"]
---
# K3s Kubernetes Cluster

## Overview
A lightweight, production-grade Kubernetes distribution running a 3-node cluster for deploying modern homelab applications with GitOps workflows.

## Cluster Layout
```
┌─────────────────────────────────┐
│  k3s-master  (10.0.20.50)      │
│  API Server + etcd + Scheduler  │
├────────────────┬────────────────┤
│ k3s-worker-1   │ k3s-worker-2  │
│ (10.0.20.51)   │ (10.0.20.52)  │
└────────────────┴────────────────┘
```

## Core Add-ons
- **ArgoCD** — GitOps continuous delivery, syncs from GitHub
- **Cilium** — eBPF-based CNI for high-performance networking
- **Longhorn** — Distributed block storage across nodes
- **cert-manager** — Automatic TLS with Let's Encrypt
- **MetalLB** — Bare-metal load balancer

## Namespaces
| Namespace | Purpose |
|-----------|---------|
| `monitoring` | Prometheus, Grafana, Alertmanager |
| `media` | Jellyfin, *arr suite |
| `security` | Falco, Network Policies |
| `dev` | Staging + CI pipelines |
