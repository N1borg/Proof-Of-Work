---
id: vm
label: VMs
subtitle: Virtual Machines
category: projects
size: 12
color: "#f59e0b"
icon: Monitor
connections: ["proxmox"]
---
# Virtual Machines

## Overview
VMs are the primary compute abstraction unit in the homelab, provided by Proxmox VE through KVM/QEMU.

## When VMs vs Containers?
I use VMs when:
- **Strong kernel isolation** is required (e.g., pfSense needs its own network stack)
- Running **Windows** workloads (Active Directory testing)
- PCIe device passthrough is needed (GPU, NIC)
- Testing destructive operations that shouldn't affect neighbors

LXC containers are used when the overhead of a full kernel isn't needed — stateless apps, CI runners, etc.

## Active VMs in the Lab
| Name | OS | Purpose |
|------|----|---------|
| `pfsense-fw` | FreeBSD | Edge firewall |
| `docker-host` | Debian 12 | Container runtime |
| `k3s-master` | Debian 12 | K8s control plane |
| `k3s-worker-{1,2}` | Debian 12 | K8s workers |
| `kali-lab` | Kali Linux | Security testing |
| `win-ad` | Windows Server 2022 | AD lab |
