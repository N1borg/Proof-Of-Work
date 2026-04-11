---
id: proxmox
label: Proxmox
subtitle: Hypervisor Cluster
category: projects
size: 14
color: "#f59e0b"
icon: Server
connections: ["homelabs"]
---
# Proxmox Virtual Environment

## Overview
Type-1 hypervisor running on a bare-metal Dell PowerEdge R730. Serves as the backbone of the entire homelab infrastructure, managing VMs and LXC containers.

## Specifications
| Component | Details |
|-----------|---------|
| **CPU** | 2x Intel Xeon E5-2680 v4 (28C/56T total) |
| **RAM** | 128 GB DDR4 ECC |
| **Storage** | 4x 1TB NVMe (ZFS RAID-Z1) |
| **Network** | 4x 10GbE SFP+ |

## Key Configurations
- **ZFS Integration:** Native ZFS pools for fast snapshots and replication.
- **VLAN Tagging:** Integrated with pfSense for robust network isolation.
- **GPU Passthrough:** NVIDIA Tesla T4 configured with PCIe passthrough for AI/ML workloads.
- **HA Clustering:** Corosync + DRBD for VM migration and failover.

## Hosted VMs
- `pfsense-fw` — Firewall/Router VM
- `docker-host` — Primary container host (Debian)
- `k3s-master` + `k3s-worker-{1,2}` — Kubernetes cluster
- `kali-lab` — Isolated security testing VM
