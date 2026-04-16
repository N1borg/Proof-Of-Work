---
id: zappy
label: Zappy
subtitle: AI Networked Game
category: security
size: 14
icon: Gamepad2
connections: ["robin","c","cpp"]
---
# Zappy — AI Networked Game (42 Project)

## Overview
Zappy is a multiprocess client-server game from the 42 school curriculum. Multiple AI-driven clients connect to a server, compete for resources, and attempt to evolve their team to the highest level — concurrently, across a dynamic map.

## Technical Challenges
- **Concurrent server** — Custom event loop in C handling 100+ client connections via `poll()`
- **AI client** — Heuristic-driven state machine in C++ making decisions based on partial world information
- **GUI** — Real-time 3D visualization of the game state using OpenGL

## Server Core (C)
```c
// Non-blocking I/O with poll() for O(n) concurrent client handling
static void server_loop(t_server *srv) {
    while (1) {
        int ready = poll(srv->fds, srv->nfds, POLL_TIMEOUT);
        for (int i = 0; i < srv->nfds && ready > 0; i++) {
            if (srv->fds[i].revents & POLLIN) {
                if (i == 0) accept_client(srv);
                else        handle_client(srv, i);
                ready--;
            }
        }
        tick_world(srv);   // advance game state every FREQ ms
    }
}
```

## AI Client (C++)
```cpp
class ZapAI {
    State _state = State::GATHER;
    void think() {
        switch (_state) {
            case GATHER:  gather_resources(); break;
            case EVOLVE:  attempt_incantation(); break;
            case DEFEND:  evade_threats(); break;
        }
    }
};
```
