---
id: dashboard
label: Dashboard
subtitle: Monitoring UI
category: projects
size: 12
icon: LayoutDashboard
connections: ["homelabs","react"]
---
# Custom Home Dashboard

## Overview
A React-based unified dashboard consolidating metrics, service health, and quick-actions from across the entire homelab into a single, real-time glass pane.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **State** | Zustand + React Query |
| **Styling** | Tailwind CSS + Framer Motion |
| **Backend** | Node.js + Fastify |
| **Real-time** | WebSocket streams |
| **Data Store** | InfluxDB (time-series) |

## Features
- **Live Metrics** — CPU, RAM, disk, network per-VM updated every 2 seconds
- **Service Health** — Auto-discovery of Docker and K3s services with uptime tracking
- **Alert Feed** — Grafana/Prometheus alert webhook integration
- **Dark Mode** — Cyberpunk-themed UI with neon accents

## API Design
```typescript
// GET /api/v1/metrics/system
interface SystemMetrics {
  cpu:     { usage: number; temp: number };
  memory:  { total: number; used: number };
  network: { rx: number; tx: number };
}
```

> This project was my introduction to real-time web applications and WebSocket communication.
