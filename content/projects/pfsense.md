---
id: pfsense
label: pfSense
subtitle: Network Firewall
category: projects
size: 14
color: "#f59e0b"
icon: Shield
connections: ["homelabs"]
---
# pfSense Firewall

## Overview
Enterprise-grade open-source firewall acting as the edge router and core internal gateway for all homelab traffic.

## Network Topology
```
WAN (ISP Fiber)
    └─▶ pfSense
            ├─▶ VLAN 10 — Management (10.0.10.0/24)
            ├─▶ VLAN 20 — Servers     (10.0.20.0/24)
            ├─▶ VLAN 30 — IoT         (10.0.30.0/24)
            └─▶ VLAN 40 — Guest       (10.0.40.0/24)
```

## Packages Installed
- **pfBlockerNG** — DNS-level ad/tracker blocking + IP threat feeds
- **Suricata** — IDS/IPS with Emerging Threats rule set
- **HAProxy** — Reverse proxy with SSL termination
- **WireGuard** — Secure remote access VPN

## Firewall Rules (Key)
| Rule | Source | Destination | Action |
|------|--------|-------------|--------|
| Block IoT → Management | VLAN 30 | VLAN 10 | **Block** |
| Allow Servers → WAN | VLAN 20 | WAN | **Allow** |
| Allow VPN → All | WireGuard | Any | **Allow** |
