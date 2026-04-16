---
id: flipperzero
label: Flipper Zero
subtitle: Hardware Hacking
category: security
size: 14
icon: Radio
connections: ["axians"]
---
# FlipperZero — Hardware Hacking Multi-Tool

## Overview
The Flipper Zero is a portable multi-tool for hardware hacking, RF analysis, and physical security testing. Used in both lab research and controlled pentest engagements.

## Use Cases in Engagements
- **Sub-GHz RF** — Cloning 433/868 MHz gate/door remotes for physical access assessments
- **RFID/NFC** — Reading and emulating EM4100 proximity cards and ISO-14443A tags
- **Infrared** — Capturing and replaying IR signals for device control testing
- **BadUSB** — Custom Rubber Ducky-style keystroke injection payloads

## Custom Firmware / Scripts
Running **Unleashed Firmware** for extended frequency range and additional protocols outside stock limitations.

```bash
# Example: Sub-GHz replay attack workflow
# 1. Record signal
flipper subghz rx -f 433920000
# 2. Inspect captured file
flipper subghz decode capture.sub
# 3. Replay
flipper subghz tx capture.sub
```

## Research
Used in conjunction with a HackRF One for deeper analysis — FlipperZero as the quick-capture field tool, HackRF for signal analysis and custom modulation work.
