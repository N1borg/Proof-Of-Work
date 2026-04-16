---
id: c
label: C
subtitle: Language
category: skills
size: 16
icon: Code
connections: []
---
# C Programming

## Overview
Used for low-level systems programming, embedded firmware, and deepening understanding of computer architecture and memory management.

## Projects

### Embedded Firmware
Custom firmware for STM32-based microcontrollers handling real-time sensor polling with interrupt-driven I/O:

```c
#include "stm32f4xx_hal.h"

void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin) {
    if (GPIO_Pin == SENSOR_PIN) {
        sensor_data = read_adc();
        HAL_UART_Transmit(&huart2, &sensor_data, 1, HAL_MAX_DELAY);
    }
}
```

### Linux Systems Exploration
- Writing custom Linux kernel modules as learning exercises
- Implementing basic data structures (linked lists, hash maps) from scratch
- Exploring POSIX APIs: `fork()`, `exec()`, `mmap()`, `epoll()`

## Learning Objectives
- Understand memory layout: stack, heap, BSS, text segments
- Manual memory management without garbage collection
- Bit manipulation and hardware register access
