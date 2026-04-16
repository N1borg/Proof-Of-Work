---
id: cpp
label: C++
subtitle: Language
category: skills
size: 16
icon: Code
connections: ["c"]
---
# C++

## Overview
Used when raw performance, object-oriented patterns, or specific engine integrations demand more than C or scripting languages can provide.

## Projects

### Godot GDExtension Modules
Native C++ extensions for the Godot Engine handling compute-intensive tasks:

```cpp
#include <godot_cpp/classes/node.hpp>
#include <godot_cpp/core/class_db.hpp>

class ProceduralTerrain : public Node {
    GDCLASS(ProceduralTerrain, Node);

    static void _bind_methods();
    void generate_chunk(Vector3i chunk_pos);
    float sample_noise(float x, float z);
};
```

### Embedded Development
- Advanced Arduino/ESP32 libraries using C++ templates and RAII patterns
- Custom serial protocol parsers with state machines
- RTOS task management on FreeRTOS

## Why C++ Over C?
- RAII for resource management in complex embedded systems
- Templates for type-safe abstractions without runtime overhead
- STL containers when dynamic memory is available
