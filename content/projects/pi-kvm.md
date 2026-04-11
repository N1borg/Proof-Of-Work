---
id: pi-kvm
label: Pi-KVM
subtitle: Remote KVM-over-IP
category: projects
size: 12
color: "#f59e0b"
icon: MonitorSmartphone
connections: ["pi"]
---
# Pi-KVM — Remote Out-of-Band Management

## What is it?
A DIY KVM-over-IP built on a Raspberry Pi 4B. Gives full keyboard, video, and mouse access to the Dell PowerEdge R730 **before the OS boots** — no physical access needed for BIOS changes, OS installs, or crash recovery.

## Hardware
- Raspberry Pi 4B (4GB RAM) in a custom 3D-printed 1U rackmount case
- HDMI capture card (MACROSILICON MS2109 chip)
- USB-C for power delivery to the target server
- USB-A → USB data cable for HID emulation (keyboard + mouse)

## Software Stack
- **PiKVM OS** — Arch Linux ARM based, custom real-time kernel
- **kvmd** — The core daemon that bridges the capture card → browser
- **Nginx + HTTPS** — Reverse proxied through pfSense with cert-manager TLS

## Access
Accessible at `https://kvm.lab.home` from within the management VLAN. WireGuard VPN allows remote access from anywhere.

## Why It Matters
Before this build, a kernel panic meant driving to the server. Now it's a browser tab.
