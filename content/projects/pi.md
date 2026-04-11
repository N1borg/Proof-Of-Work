---
id: pi
label: Raspberry Pi
subtitle: SBC Ecosystem
category: projects
size: 16
color: "#f59e0b"
icon: Cpu
connections: ["homelabs"]
---
# Raspberry Pi Ecosystem

## Overview
Single-board computers (SBCs) serving auxiliary roles outside the main Proxmox cluster — low-power, always-on tasks that don't warrant a full VM.

## Active Deployments

### Pi 4 (4GB RAM)
- **Pi-hole** — Secondary DNS ad blocker (primary is pfBlockerNG in pfSense)
- **Pi-KVM** — Remote KVM-over-IP for the Dell server (HDMI capture + HID emulation)
- Acts as a Proxmox cluster quorum tie-breaker

### General Purpose
- Running lightweight Prometheus exporters
- Local network monitoring with custom Python scripts
- MQTT broker for IoT sensor data

## Projects
- Pi-KVM build with 3D-printed case
- Cluster-wide metadata node for K3s external data store (etcd alternative)
