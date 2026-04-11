---
id: jolly_chimp
label: Jolly Chimp
subtitle: Creative Project
category: projects
size: 12
color: "#f472b6"
icon: Sparkles
connections: ["robin"]
---
# Jolly-Chimp — Homelab Uptime Monitor

## Overview
A lightweight uptime and service monitor built specifically for the homelab stack. Provides a clean dashboard showing real-time status of all critical services with historical uptime percentages.

## Stack
- **Frontend:** React + TypeScript + Vite
- **Backend:** Fastify (Node.js) with scheduled health checks
- **Storage:** SQLite for uptime history
- **Hosting:** Docker on Proxmox VM, served via Traefik

## Features
- HTTP/HTTPS endpoint monitoring with configurable intervals
- TCP port checking for non-HTTP services (Proxmox API, PostgreSQL)
- Historical uptime graphs (7-day, 30-day rolling)
- Slack + SMS webhook alerts on state transitions

```typescript
interface ServiceCheck {
  id:       string;
  name:     string;
  url:      string;
  interval: number;   // seconds
  timeout:  number;   // ms
  method:   'GET' | 'POST' | 'TCP';
}

async function checkService(svc: ServiceCheck): Promise<CheckResult> {
  const start = Date.now();
  try {
    const resp = await fetch(svc.url, { signal: AbortSignal.timeout(svc.timeout) });
    return { status: resp.ok ? 'up' : 'down', latency: Date.now() - start };
  } catch {
    return { status: 'down', latency: -1 };
  }
}
```
