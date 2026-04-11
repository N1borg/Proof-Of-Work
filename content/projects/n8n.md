---
id: n8n
label: n8n
subtitle: Workflow Automation
category: projects
size: 12
color: "#f59e0b"
icon: Workflow
connections: ["homelabs","docker"]
---
# n8n Automation — SMS Alert Engine

## Overview
A self-hosted n8n workflow engine running on bare-metal infrastructure, powering an SMS notification system for homelab monitoring events. When Prometheus fires a critical alert, the pipeline triggers within 30 seconds and delivers a formatted SMS.

## Stack
- **n8n** (self-hosted, Docker) — Workflow orchestration
- **Prometheus Alertmanager** — Alert source (webhook)
- **Python FastAPI** — Custom webhook receiver and message formatter
- **Twilio API** — SMS delivery
- **Proxmox / Docker** — Hosting

## Architecture

```
Prometheus Alert
       │
       ▼
Alertmanager ──webhook──▶ Python FastAPI Receiver
                                   │
                                   ▼
                             n8n Webhook Node
                                   │
                         ┌─────────┴──────────┐
                         ▼                    ▼
                  Format Message         Log to DB
                         │
                         ▼
                    Twilio SMS ──▶  📱 Your phone
```

## Python Webhook Receiver

```python
from fastapi import FastAPI, Request
from pydantic import BaseModel
import httpx, os

app = FastAPI()
N8N_WEBHOOK = os.getenv("N8N_WEBHOOK_URL")

class AlertPayload(BaseModel):
    status: str
    labels: dict
    annotations: dict

@app.post("/alert")
async def receive_alert(payload: AlertPayload):
    severity  = payload.labels.get("severity", "unknown")
    alertname = payload.labels.get("alertname", "Unknown Alert")
    summary   = payload.annotations.get("summary", "No summary")

    message = (
        f"🚨 [{severity.upper()}] {alertname}\n"
        f"📝 {summary}\n"
        f"⏱ {payload.status}"
    )

    async with httpx.AsyncClient() as client:
        await client.post(N8N_WEBHOOK, json={"message": message, "severity": severity})

    return {"status": "forwarded"}
```

## n8n Workflow (key nodes)
```json
{
  "nodes": [
    { "type": "n8n-nodes-base.webhook", "name": "Alert Intake" },
    { "type": "n8n-nodes-base.if",
      "name": "Filter: Severity ≥ Warning",
      "parameters": { "conditions": [{ "value1": "{{$json.severity}}", "operation": "notEqual", "value2": "info" }] }
    },
    { "type": "n8n-nodes-base.twilio",
      "name": "Send SMS",
      "parameters": { "body": "={{$json.message}}", "to": "={{$env.PHONE_NUMBER}}" }
    }
  ]
}
```

## Metrics
- Average latency alert → SMS: **28 seconds**
- Uptime: **99.7%** (3 months production)
- Alerts processed: **~1,200/month** (filtered to ~40 SMS)
