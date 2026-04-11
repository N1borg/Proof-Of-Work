---
id: arduino
label: Arduino
subtitle: Microcontroller
category: projects
size: 12
color: "#f59e0b"
icon: Cpu
connections: ["robin","c"]
---
# Arduino

## Overview
Microcontroller platform used for real-time hardware interfacing where a full operating system would introduce unacceptable latency or complexity.

## Projects

### LED Alert Controller
Custom RGB LED strip controller that changes color based on Grafana alert states. Reads webhook payloads from a serial bridge and drives WS2812B strips.

```cpp
#include <FastLED.h>

#define NUM_LEDS 60
CRGB leds[NUM_LEDS];

void setAlert(AlertLevel level) {
  CRGB color = level == CRITICAL ? CRGB::Red : CRGB::Green;
  fill_solid(leds, NUM_LEDS, color);
  FastLED.show();
}
```

### Sensor Integration
- DHT11 temperature sensors feeding data to a serial-to-MQTT bridge
- Ultrasonic distance sensors for basic occupancy detection

## Boards Used
- Arduino Uno R3 (prototyping)
- Arduino Nano (embedded in enclosures)
- ESP32 variants (WiFi-capable projects)
