---
id: pi-hole
label: Pi-hole
subtitle: DNS Ad Blocking
category: projects
size: 12
icon: ShieldOff
connections: ["pi","docker"]
---
# Pi-hole — Network-Wide Ad Blocking

## Overview
A DNS sinkhole running on a Raspberry Pi 4B that blocks advertisements, trackers, and malicious domains for every device on the network — no client configuration needed.

## Setup
Runs as a Docker container on the Pi, providing a redundant DNS resolver alongside pfBlockerNG in pfSense.

```yaml
# docker-compose.yml on the Pi
services:
  pihole:
    image: pihole/pihole:latest
    environment:
      TZ: 'America/Los_Angeles'
      WEBPASSWORD: '${PIHOLE_PASS}'
    dns:
      - 127.0.0.1
      - 1.1.1.1
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "80:80/tcp"
    volumes:
      - ./etc-pihole:/etc/pihole
      - ./etc-dnsmasq.d:/etc/dnsmasq.d
    restart: unless-stopped
```

## Stats
- ~25% of DNS queries blocked on average
- 1.2M domain blocklist (aggregated from 8 lists)
- Dashboard accessible at `http://pihole.lab.home/admin`

## Redundancy
pfSense's Unbound DNS is the primary resolver. The Pi-hole is a secondary — if the Pi goes down, DNS automatically falls back to pfSense's upstream resolvers.
