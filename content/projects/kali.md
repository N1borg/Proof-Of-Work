---
id: kali
label: Kali
subtitle: Offensive Distro
category: security
size: 14
icon: Terminal
connections: ["axians"]
---
# Kali Linux

## Overview
Debian-derived Linux distribution built for digital forensics and penetration testing. Runs as an isolated VM on Proxmox, air-gapped from production VLANs.

## Homelab Role
Used for security auditing across the internal network and validating the effectiveness of the IDS/IPS (Suricata) and firewall rules in pfSense.

## Tools I Use Regularly
- **Nmap / Masscan** — Network discovery and port scanning
- **Metasploit** — Exploitation framework for CVE testing
- **Wireshark / tcpdump** — Packet capture and protocol analysis
- **Burp Suite** — Web application proxy and scanner
- **Nikto** — Web server vulnerability scanner
- **Hashcat** — Password cracking for credential testing

## Projects
- Internal network vulnerability assessments
- Testing pfBlockerNG threat feed effectiveness
- CEH lab environment replication
