---
id: pizero
label: Pi Zero
subtitle: Embedded Projects
category: projects
size: 12
color: "#f59e0b"
icon: Cpu
connections: ["pi"]
---
# Raspberry Pi Zero W

## Overview
Ultra-compact, WiFi-enabled single-board computer. Used for IoT sensor collection and edge automation where physical size and power consumption are critical constraints.

## Active Projects

### Environmental Monitoring
DHT22 temperature + humidity sensors reporting to Home Assistant via MQTT every 30 seconds. Data is stored in InfluxDB and visualized in Grafana.

```python
import dht
import machine
import network
import mqtt

sensor = dht.DHT22(machine.Pin(4))
sensor.measure()
temp = sensor.temperature()
humidity = sensor.humidity()
```

### Smart Mirror Module
Backend data aggregation for a Magic Mirror build — fetches calendar, weather, and homelab status via REST APIs.

## Specs
| Spec | Value |
|------|-------|
| CPU | ARM1176JZF-S 1 GHz single-core |
| RAM | 512 MB |
| Connectivity | 2.4 GHz WiFi, Bluetooth 4.0 |
| Power | ~1W typical |
