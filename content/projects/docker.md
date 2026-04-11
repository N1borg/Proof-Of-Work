---
id: docker
label: Docker
subtitle: Container Platform
category: projects
size: 14
color: "#f59e0b"
icon: Box
connections: ["homelabs","bash"]
---
# Docker Infrastructure

## Overview
Primary container runtime hosting stateless services, monitoring stacks, and internal tooling via Docker Compose. Runs on a dedicated Debian VM inside Proxmox.

## Core Services
- **Traefik** — Reverse proxy with automatic Let's Encrypt SSL + Docker service discovery
- **Portainer** — GUI for container management
- **Prometheus + Grafana** — Metrics collection and dashboards
- **Loki** — Log aggregation
- **Vaultwarden** — Self-hosted Bitwarden-compatible password manager

## Example Compose Snippet
```yaml
services:
  traefik:
    image: traefik:v3.0
    command:
      - "--providers.docker=true"
      - "--entrypoints.websecure.address=:443"
    ports:
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

## Resource Usage
| Service | CPU | RAM |
|---------|-----|-----|
| Traefik | ~0.5% | 64 MB |
| Grafana | ~2% | 256 MB |
| Prometheus | ~5% | 2 GB |
