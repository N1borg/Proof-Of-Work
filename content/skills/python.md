---
id: python
label: Python
subtitle: Language
category: skills
size: 16
color: "#60a5fa"
icon: Code
connections: ["worldline"]
---
# Python

## Overview
My primary language for scripting, automation, and backend services. Chosen for its readability, vast ecosystem, and rapid prototyping speed.

## Homelab Usage

### Infrastructure Automation
- Proxmox API client scripts for automated VM provisioning
- Backup verification scripts comparing ZFS snapshot checksums
- Ansible inventory generation from dynamic sources

### Data & Monitoring
- Log parsing pipelines feeding structured data into Loki
- Custom Prometheus exporters for services without native metrics
- Grafana alerting webhook handlers

### Backend APIs
FastAPI microservices bridging homelab APIs to the dashboard:

```python
from fastapi import FastAPI
import proxmoxer

app = FastAPI()

@app.get("/api/vms")
async def list_vms():
    prox = proxmoxer.ProxmoxAPI('10.0.10.2', user='root@pam', ...)
    return prox.nodes('pve').qemu.get()
```

## Libraries I Use
`FastAPI`, `requests`, `paramiko`, `proxmoxer`, `pydantic`, `asyncio`, `click`
