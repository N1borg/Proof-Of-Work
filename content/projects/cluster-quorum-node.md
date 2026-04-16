---
id: cluster-quorum
label: Quorum Node
subtitle: Proxmox Tie-Breaker
category: projects
size: 12
icon: GitBranch
connections: ["pi","proxmox"]
---
# Cluster Quorum Node — Proxmox Tie-Breaker

## Problem
A Proxmox HA cluster with an even number of nodes (2) is unstable — if networking between nodes is interrupted, both believe the other has failed and neither can decide who should keep running VMs ("split-brain").

## Solution
A Raspberry Pi 4B acting as a **QDevice** (quorum device) — a lightweight third voter in the Corosync cluster consensus algorithm. It doesn't run any VMs; it just votes.

## Configuration
```bash
# On the Pi — install corosync-qnetd
apt install corosync-qnetd
systemctl enable --now corosync-qnetd

# On Proxmox nodes — register the qdevice
pvecm qdevice setup 10.0.10.50   # Pi's IP
```

## Result
The 2-node Proxmox cluster now achieves quorum with 2/3 votes (either node + the Pi). Even if one Proxmox node goes down, the remaining node can continue running VMs without manual intervention.

## Hardware Used
- Raspberry Pi 4B, 2GB RAM
- Runs only qnetd — minimal resource usage (~50MB RAM, negligible CPU)
- Connected via dedicated management VLAN 10
